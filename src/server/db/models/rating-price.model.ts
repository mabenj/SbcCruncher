import mongoose, { Schema } from "mongoose";
import { RatingPrice } from "../../../types/rating-price.interface";

interface RatingPriceDocument extends Document, RatingPrice {}

const RatingPriceSchema: Schema = new Schema(
    {
        rating: { type: Number, required: true, unique: true },
        pricesPc: {
            type: Object,
            of: Number,
            required: true
        },
        pricesConsole: {
            type: Object,
            of: Number,
            required: true
        }
    },
    {
        timestamps: true
        // toJSON: {
        //     virtuals: false,
        //     versionKey: false,
        //     transform: (doc, ret) => {
        //         delete ret._id;
        //     }
        // }
    }
);

export default (mongoose.models
    .RatingPrice as mongoose.Model<RatingPriceDocument>) ||
    mongoose.model<RatingPriceDocument>("RatingPrice", RatingPriceSchema);
