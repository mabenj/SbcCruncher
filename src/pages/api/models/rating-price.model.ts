import mongoose, { Schema } from "mongoose";
import { RatingPrice } from "../types/rating-price.interface";

const RatingPriceSchema: Schema = new Schema(
    {
        rating: { type: Number, required: true },
        platform: { type: String, required: true },
        cheapest: { type: Number, required: true },
        dataSource: { type: String, required: true }
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

export default mongoose.models.RatingPrice ||
    mongoose.model<RatingPrice>("RatingPrice", RatingPriceSchema);
