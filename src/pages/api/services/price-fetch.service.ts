import { connect, disconnect } from "../db";
import RatingPriceModel from "../models/rating-price.model";

export class PriceFetchService {
    constructor(
        private readonly dataSource: "futbin" | "futwiz",
        private readonly platform: "pc" | "console"
    ) {}

    async getPrices(ratings: number[]) {
        ratings = Array.from(new Set(ratings));

        try {
            await connect();

            const result = await RatingPriceModel.find({
                rating: { $in: ratings }
            }).exec();

            return result.map((res) => ({
                rating: res.rating,
                price:
                    this.platform === "pc"
                        ? res.pricesPc[this.dataSource]
                        : res.pricesConsole[this.dataSource]
            }));
        } finally {
            await disconnect();
        }
    }
}
