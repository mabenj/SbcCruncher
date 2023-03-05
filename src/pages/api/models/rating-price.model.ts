import mongoose, { Schema } from "mongoose";
import { RatingPrice } from "../types/rating-price.interface";

const RatingPriceSchema: Schema = new Schema(
    {
        rating: { type: Number, required: true, unique: true },
        cheapestFutbinPc: { type: Number, required: true },
        cheapestFutbinConsole: { type: Number, required: true },
        cheapestFutwizPc: { type: Number, required: true },
        cheapestFutwizConsole: { type: Number, required: true }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: false,
            versionKey: false,
            transform: (doc, ret) => {
                delete ret._id;
            }
        }
    }
);

export default (mongoose.models.RatingPrice as mongoose.Model<RatingPrice>) ||
    mongoose.model<RatingPrice>("RatingPrice", RatingPriceSchema);
