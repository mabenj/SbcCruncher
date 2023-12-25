import Log from "@/common/log";
import mongoose from "mongoose";
import RatingPriceModel from "./models/rating-price.model";

const CONN_STRING = process.env.MONGO_CONN_STRING;

export class Database {
    private static instance: Database | null = null;

    private readonly logger = new Log("DB");

    private constructor() {}

    public readonly models = {
        RatingPrice: RatingPriceModel
    };

    static async getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
            await Database.instance.connect();
        }
        return Database.instance;
    }

    public async dispose() {
        await this.disconnect();
        Database.instance = null;
    }

    private async connect() {
        this.logger.info("Connecting to database...");
        try {
            if (!CONN_STRING) {
                throw new Error("Connection string missing");
            }
            await mongoose.connect(CONN_STRING);
            this.logger.info("Connected");
        } catch (err) {
            this.logger.error("Error connecting to database", err);
        }
    }

    private async disconnect() {
        this.logger.info("Disconnecting from database...");
        try {
            await mongoose.disconnect();
            this.logger.info("Disconnected");
        } catch (err) {
            this.logger.error("Error disconnecting from database", err);
        }
    }
}
