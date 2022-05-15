import { atomWithHash } from "jotai/utils";
import { IExistingRating } from "../interfaces";

const REGEXP_RATINGS = /((?<rating>[1-9]|[1-9][0-9])x(?<quantity>10|[1-9]))/gi;

const KEY = "players";

export const existingRatingsAtom = atomWithHash<IExistingRating[] | undefined>(
    KEY,
    undefined,
    {
        serialize: serializeRatingOptions,
        deserialize: deserializeRatingOptions,
        replaceState: true
    }
);

function serializeRatingOptions(values: IExistingRating[] | undefined): string {
    return (
        values?.map((value) => `${value.rating}x${value.quantity}`).join("-") ||
        ""
    );
}

function deserializeRatingOptions(str: string): IExistingRating[] | undefined {
    if (!str) {
        return undefined;
    }
    const result: IExistingRating[] = [];
    const parts = str.split("-");
    parts.forEach((part) => {
        const match = new RegExp(REGEXP_RATINGS).exec(part);
        const { rating, quantity } = match?.groups || {};
        if (rating && quantity) {
            result.push({
                rating: parseInt(rating),
                quantity: parseInt(quantity)
            });
        }
    });
    return result.length > 0 ? result : undefined;
}
