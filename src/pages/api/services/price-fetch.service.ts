import { connect, disconnect } from "../db";
import RatingPriceModel from "../models/rating-price.model";

export default class PriceFetchService {
    constructor(
        private readonly dataSource: "futbin" | "futwiz",
        private readonly platform: "pc" | "console"
    ) {}

    async getPrices(ratings: number[]) {
        ratings = Array.from(new Set(ratings));

        try {
            await connect();

            let priceKey = "";
            if (this.dataSource === "futbin" && this.platform === "pc") {
                priceKey = "cheapestFutbinPc";
            } else if (
                this.dataSource === "futbin" &&
                this.platform === "console"
            ) {
                priceKey = "cheapestFutbinConsole";
            } else if (this.dataSource === "futwiz" && this.platform === "pc") {
                priceKey = "cheapestFutwizPc";
            } else {
                priceKey = "cheapestFutwizConsole";
            }

            const result = await RatingPriceModel.find(
                {
                    rating: { $in: ratings }
                },
                {
                    rating: true,
                    [priceKey]: true
                }
            ).exec();

            return result.map((res) => ({
                rating: res.rating,
                price: (res as any)[priceKey]
            }));
        } finally {
            await disconnect();
        }
    }
}
