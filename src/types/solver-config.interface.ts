export interface SolverConfig {
    targetRating: number;
    existingRatings: { rating: number; count: number }[];
    tryRatingMinMax: [number, number];
    ratingPriceMap: Record<number, number>;
}
