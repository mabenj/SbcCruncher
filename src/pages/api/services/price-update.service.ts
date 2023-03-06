import { getErrorMessage, range, sleep } from "@/utilities";
import { JSDOM } from "jsdom";
import { connect, disconnect } from "../db";
import { Log } from "../log";
import RatingPriceModel from "../models/rating-price.model";
import { RatingPrice } from "../types/rating-price.interface";

const FUTBIN_BASE_URL =
    "https://www.futbin.org/futbin/api/23/getFilteredPlayers";
const FUTWIZ_BASE_URL = "https://www.futwiz.com/en/fifa23/players";
const FUTWIZ_CHEAPEST_PAGE_URL =
    "https://www.futwiz.com/en/lowest-price-ratings";

const RATINGS = range(75, 98);
const FUTWIZ_CHEAPEST_PAGE_RATINGS = range(82, 98);
const COOLDOWN_MS = 1000;

export class PriceUpdateService {
    private futwizCheapestPagePrices: Record<number, RatingPrice> | undefined;

    async updateRatingPrices() {
        const ratingPrices = await this.getRatingPrices(RATINGS);
        await this.persistRatingPrices(ratingPrices);
    }

    private async getRatingPrices(ratings: number[]): Promise<RatingPrice[]> {
        const result: RatingPrice[] = [];
        for (let i = 0; i < ratings.length; i++) {
            const rating = ratings[i];
            Log.info(`Fetching prices for rating '${rating}'`);
            const [cheapestFutbinPc, cheapestFutwizPc] = await Promise.all([
                this.getFutbinCheapest(rating, "pc"),
                this.getFutwizCheapest(rating, "pc")
            ]);
            const [cheapestFutbinConsole, cheapestFutwizConsole] =
                await Promise.all([
                    this.getFutbinCheapest(rating, "console"),
                    this.getFutwizCheapest(rating, "console")
                ]);
            result.push({
                rating,
                cheapestFutbinPc,
                cheapestFutbinConsole,
                cheapestFutwizPc,
                cheapestFutwizConsole
            });
            await sleep(COOLDOWN_MS);
        }

        return result;
    }

    private async getFutbinCheapest(
        rating: number,
        platform: "pc" | "console"
    ) {
        const isPc = platform === "pc";
        try {
            const query = new URLSearchParams({
                platform: isPc ? "PC" : "PS",
                rating: rating + "-" + rating,
                sort: isPc ? "pc_price" : "ps_price",
                order: "asc",
                [isPc ? "pcprice" : "psprice"]: "200-15000000"
            });
            const url = FUTBIN_BASE_URL + "?" + query;
            const json = await (await fetch(url)).json();

            // find first non-sbc player
            const cheapest = json.data.find(
                (player: any) =>
                    player[isPc ? "pc_MinPrice" : "ps_MinPrice"] > 0 &&
                    player[isPc ? "pc_MaxPrice" : "ps_MaxPrice"] > 0
            );
            const cheapestPrice = cheapest[isPc ? "pc_LCPrice" : "ps_LCPrice"];
            return cheapestPrice as number;
        } catch (error) {
            Log.error(
                `Error while fetching Futbin price for rating '${rating}' and platform '${platform}': ${getErrorMessage(
                    error
                )}`
            );
            return -1;
        }
    }

    private async getFutwizCheapest(
        rating: number,
        platform: "pc" | "console"
    ) {
        try {
            if (FUTWIZ_CHEAPEST_PAGE_RATINGS.includes(rating)) {
                await this.populateFutwizCheapestPagePrices();
                if (platform === "pc") {
                    return this.futwizCheapestPagePrices![rating]
                        .cheapestFutwizPc;
                }
                return this.futwizCheapestPagePrices![rating]
                    .cheapestFutwizConsole;
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
                    headers: { Cookie: `futwiz_prices=${platform}` }
                })
            ).text();
            if (!html) {
                throw new Error(`Invalid Futwiz response`);
            }

            const dom = new JSDOM(html);
            const firstRowPriceCell = dom.window.document.querySelector(
                ".table-row>td:nth-child(5)"
            );
            if (!firstRowPriceCell) {
                throw new Error(`Could not parse price`);
            }
            return parsePrice(firstRowPriceCell.innerHTML);
        } catch (error) {
            Log.error(
                `Error while fetching futwiz price for rating '${rating}' and platform '${platform}': ${getErrorMessage(
                    error
                )}`
            );
            return -1;
        }
    }

    private async populateFutwizCheapestPagePrices() {
        if (this.futwizCheapestPagePrices) {
            return;
        }

        const pricesPc = await this.getFutwizCheapestPagePrices("pc");
        const pricesConsole = await this.getFutwizCheapestPagePrices("console");
        this.futwizCheapestPagePrices = FUTWIZ_CHEAPEST_PAGE_RATINGS.reduce(
            (acc, curr) => {
                acc[curr] = {
                    rating: curr,
                    cheapestFutwizPc: pricesPc[curr] || 0,
                    cheapestFutwizConsole: pricesConsole[curr] || 0,
                    cheapestFutbinConsole: 0,
                    cheapestFutbinPc: 0
                };
                return acc;
            },
            {} as Record<number, RatingPrice>
        );
    }

    private async getFutwizCheapestPagePrices(platform: "pc" | "console") {
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

    private async persistRatingPrices(ratingPrices: RatingPrice[]) {
        try {
            await connect();

            const updatedPrices = ratingPrices as Partial<RatingPrice>[];
            updatedPrices.forEach((ratingPrice) => {
                if (ratingPrice.cheapestFutbinConsole === -1) {
                    delete ratingPrice.cheapestFutbinConsole;
                }
                if (ratingPrice.cheapestFutbinPc === -1) {
                    delete ratingPrice.cheapestFutbinPc;
                }
                if (ratingPrice.cheapestFutwizConsole === -1) {
                    delete ratingPrice.cheapestFutwizConsole;
                }
                if (ratingPrice.cheapestFutwizPc === -1) {
                    delete ratingPrice.cheapestFutwizPc;
                }
            });

            const operations = updatedPrices.map((updatedPrice) => ({
                updateOne: {
                    filter: { rating: updatedPrice.rating },
                    update: { $set: { ...updatedPrice } },
                    upsert: true
                }
            }));

            await RatingPriceModel.bulkWrite(operations).catch((error) =>
                Log.error(error)
            );
        } finally {
            await disconnect();
        }
    }
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
