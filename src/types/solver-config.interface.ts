export interface SolverConfig {
    targetRating: number;
    existingRatings: { rating: number; count: number }[];
    tryRatingMinMax: [number, number];
    tryRatingExclude: number[];
    ratingPriceMap: Record<number, number>;
    pricesDisabled: boolean
}
