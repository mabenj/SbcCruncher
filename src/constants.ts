import { SolverConfig } from "./types/solver-config.interface";
import { range } from "./utilities";

export const RATING_MIN = 47;
export const RATING_MAX = 99;
export const SQUAD_SIZE = 11;
export const ALL_RATINGS = range(RATING_MIN, RATING_MAX);
export const TRY_RATINGS = range(75, RATING_MAX);

export const MAX_SOLUTIONS_TO_TAKE = 500;

export const EMPTY_PRICES = range(RATING_MIN, RATING_MAX).reduce(
    (acc, curr) => {
        acc[curr] = 0;
        return acc;
    },
    {} as Record<number, number>
);

export const DEFAULT_CONFIG: SolverConfig = {
    targetRating: 83,
    existingRatings: [],
    tryRatingMinMax: [82, 92],
    ratingPriceMap: EMPTY_PRICES
};
