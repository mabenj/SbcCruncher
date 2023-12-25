import { Database } from "../db/database";

export class PriceFetchService {
    constructor(
        private readonly dataSource: "futbin" | "futwiz",
        private readonly platform: "pc" | "console"
    ) {}

    async getPrices(ratings: number[]) {
        ratings = Array.from(new Set(ratings));

        let db: Database | null = null;
        try {
            db = await Database.getInstance();

            const result = await db.models.RatingPrice.find({
                rating: { $in: ratings }
            }).exec();

            return result.map((res) => ({
                rating: res.rating,
                price:
                    (this.platform === "pc"
                        ? res.pricesPc[this.dataSource]
                        : res.pricesConsole[this.dataSource]) ?? 0
            }));
        } finally {
            await db?.dispose();
        }
    }
}
