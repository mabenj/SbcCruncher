import { Types } from "mongoose";
import connect from "../db";
import RatingPriceModel from "../models/rating-price.model";
import { RatingPrice } from "../types/rating-price.interface";

const FUTBIN_BASE_URL =
    "https://www.futbin.org/futbin/api/23/getFilteredPlayers";
const PRICES_STALE_THRESHOLD_MS = 30 * 60 * 1000; // 30 min

export async function getPrices(
    dataSource: "futbin" | "futwiz",
    platform: "pc" | "console",
    ratings: number[]
) {
    await connect();

    const result = await RatingPriceModel.find({
        dataSource: dataSource,
        platform: platform,
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
            now - storedRatingPrice.timestamp < PRICES_STALE_THRESHOLD_MS
        ) {
            resultPrices.push({
                rating: storedRatingPrice.rating,
                price: storedRatingPrice.cheapest
            });
            continue;
        }

        const currentPrice = await getCheapest(
            currentRating,
            platform,
            dataSource
        );
        const ratingPrice: RatingPrice = {
            cheapest: currentPrice,
            dataSource: dataSource,
            platform: platform,
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
}

async function getCheapest(
    rating: number,
    platform: "pc" | "console",
    dataSource: "futbin" | "futwiz"
) {
    switch (dataSource) {
        case "futwiz":
            return getCheapestFutwiz(rating, platform);
        default:
            return getCheapestFutbin(rating, platform);
    }
}

async function getCheapestFutwiz(rating: number, platform: "pc" | "console") {
    return -1; //TODO
}

async function getCheapestFutbin(rating: number, platform: "pc" | "console") {
    const query = new URLSearchParams({
        platform: platform === "pc" ? "PC" : "PS",
        rating: rating + "-" + rating,
        sort: platform === "pc" ? "pc_price" : "ps_price",
        order: "asc",
        [platform === "pc" ? "pcprice" : "psprice"]: "200-15000000"
    });
    const url = FUTBIN_BASE_URL + "?" + query;
    const json = await (await fetch(url)).json();

    const cheapest = json.data[0];
    const cheapestPrice = cheapest[
        platform === "pc" ? "pc_LCPrice" : "ps_LCPrice"
    ] as number;
    return cheapestPrice;
}
