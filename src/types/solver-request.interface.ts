export interface SolverRequest{
    targetRating: number,
    existingRatings: number[],
    ratingsToTry: number[],
    priceByRating: Record<number, number>
}