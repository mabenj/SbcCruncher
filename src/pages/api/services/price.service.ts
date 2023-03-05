import { getErrorMessage, range } from "@/utilities";
import { JSDOM } from "jsdom";
import { Types } from "mongoose";
import { connect, disconnect } from "../db";
import { Log } from "../log";
import RatingPriceModel from "../models/rating-price.model";
import { RatingPrice } from "../types/rating-price.interface";

const FUTBIN_BASE_URL =
    "https://www.futbin.org/futbin/api/23/getFilteredPlayers";
const FUTWIZ_BASE_URL = "https://www.futwiz.com/en/fifa23/players";
const FUTWIZ_CHEAPEST_PAGE_URL =
    "https://www.futwiz.com/en/lowest-price-ratings";

const PRICES_STALE_THRESHOLD_MS = 30 * 60 * 1000; // 30 min
const FUTWIZ_CHEAPEST_RANGE = range(82, 98);

export default class PriceService {
    private futwizCheapestPagePlayers: Record<number, number> | undefined;

    constructor(
        private readonly dataSource: "futbin" | "futwiz",
        private readonly platform: "pc" | "console"
    ) {}

    async getPrices(ratings: number[]) {
        ratings = Array.from(new Set(ratings));

        try {
            await connect();

            const result = await RatingPriceModel.find({
                dataSource: this.dataSource,
                platform: this.platform,
                rating: { $in: ratings }
            }).exec();
            const storedPrices = result.map((res) => ({
                rating: res.rating,
                cheapest: res.cheapest,
                timestamp: res.updatedAt,
                id: res.id
            }));

            const now = Date.now();
            const resultPrices: { rating: number; price: number }[] = [];
            for (let i = 0; i < ratings.length; i++) {
                const currentRating = ratings[i];
                const storedRatingPrice = storedPrices.find(
                    ({ rating }) => rating === currentRating
                );
                if (
                    storedRatingPrice &&
                    now - storedRatingPrice.timestamp <
                        PRICES_STALE_THRESHOLD_MS
                ) {
                    // still fresh
                    resultPrices.push({
                        rating: storedRatingPrice.rating,
                        price: storedRatingPrice.cheapest
                    });
                    continue;
                }

                const currentPrice = await this.getCheapest(currentRating);
                const ratingPrice: RatingPrice = {
                    cheapest: currentPrice,
                    dataSource: this.dataSource,
                    platform: this.platform,
                    rating: currentRating
                };
                await RatingPriceModel.findByIdAndUpdate(
                    storedRatingPrice?.id || new Types.ObjectId(),
                    { $set: { ...ratingPrice } },
                    { upsert: true }
                );
                resultPrices.push({
                    rating: currentRating,
                    price: currentPrice
                });
            }

            return resultPrices;
        } finally {
            await disconnect();
        }
    }

    private async getCheapest(rating: number) {
        try {
            let price = -1;
            switch (this.dataSource) {
                case "futbin":
                    price = await this.getCheapestFutbin(rating);
                    break;
                case "futwiz":
                    price = await this.getCheapestFutwiz(rating);
                    break;
                default:
                    throw new Error(`Unknown data source '${this.dataSource}'`);
            }
            return price;
        } catch (error) {
            Log.error(
                `Error fetching price data for rating '${rating}' (${
                    this.dataSource
                }-${this.platform}): ${getErrorMessage(error)}`
            );
            return 0;
        }
    }

    private async getCheapestFutwiz(rating: number) {
        if (FUTWIZ_CHEAPEST_RANGE.includes(rating)) {
            this.futwizCheapestPagePlayers ??=
                await getFutwizCheapestPagePrices(this.platform);

            return this.futwizCheapestPagePlayers[rating];
        }

        const query = new URLSearchParams({
            page: "0",
            minrating: rating.toString(),
            maxrating: rating.toString(),
            minprice: "200",
            order: "bin",
            s: "asc"
        });
        const url = FUTWIZ_BASE_URL + "?" + query;
        const html = await (
            await fetch(url, {
                headers: { Cookie: `futwiz_prices=${this.platform}` }
            })
        ).text();
        if (!html) {
            throw new Error(`Invalid Futwiz response for rating '${rating}'`);
        }

        const dom = new JSDOM(html);
        const firstRowPriceCell = dom.window.document.querySelector(
            ".table-row>td:nth-child(5)"
        );
        if (!firstRowPriceCell) {
            throw new Error(`Could not parse price for rating '${rating}'`);
        }
        return parsePrice(firstRowPriceCell.innerHTML);
    }

    private async getCheapestFutbin(rating: number) {
        const query = new URLSearchParams({
            platform: this.platform === "pc" ? "PC" : "PS",
            rating: rating + "-" + rating,
            sort: this.platform === "pc" ? "pc_price" : "ps_price",
            order: "asc",
            [this.platform === "pc" ? "pcprice" : "psprice"]: "200-15000000"
        });
        const url = FUTBIN_BASE_URL + "?" + query;
        const json = await (await fetch(url)).json();

        // find first non-sbc player
        const cheapest = json.data.find(
            (player: any) =>
                player[this.platform === "pc" ? "pc_MinPrice" : "ps_MinPrice"] >
                    0 &&
                player[this.platform === "pc" ? "pc_MaxPrice" : "ps_MaxPrice"] >
                    0
        );
        const cheapestPrice = cheapest[
            this.platform === "pc" ? "pc_LCPrice" : "ps_LCPrice"
        ] as number;
        return cheapestPrice;
    }
}

async function getFutwizCheapestPagePrices(platform: "pc" | "console") {
    const cheapestByRating: Record<number, number> = {};

    const html = await (
        await fetch(FUTWIZ_CHEAPEST_PAGE_URL, {
            headers: { Cookie: `futwiz_prices=${platform}` }
        })
    ).text();
    if (!html) {
        throw new Error("Invalid Futwiz cheapest response");
    }

    const dom = new JSDOM(html);
    const ratingColumns = dom.window.document.querySelectorAll(
        ".col-4[style='padding-right:0px;']"
    );
    ratingColumns.forEach((column) => {
        const rating = parseInt(
            column.querySelector(".title")?.innerHTML.trim() ?? "-1"
        );
        if (isNaN(rating) || rating === -1) {
            return;
        }
        const playersBins = column.querySelectorAll(".bin");
        const playerPrices = Array.from(playersBins).map((bin) =>
            parsePrice(bin.textContent?.trim())
        );
        if (playerPrices.length === 0) {
            return;
        }

        cheapestByRating[rating] = Math.min(...playerPrices);
    });

    return cheapestByRating;
}

function parsePrice(text: string | undefined | null) {
    if (!text) {
        return 0;
    }
    const isThousand = text.endsWith("K");
    const isMillion = text.endsWith("M");
    const num = parseFloat(text);
    const result = isThousand ? 1000 * num : isMillion ? 1_000_000 * num : num;
    if (
        isNaN(result) ||
        result === Number.POSITIVE_INFINITY ||
        result === Number.NEGATIVE_INFINITY
    ) {
        throw new Error("Error parsing price '" + text + "'");
    }
    return result;
}
