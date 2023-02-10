export interface ConfigState {
    targetRating: number;
    existingRatings: {rating: number, count: number}[];
    tryRatingMinMax: [number, number];
    ratingPriceMap: Record<number, number>;
}
