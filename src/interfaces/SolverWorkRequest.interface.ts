import IPriceInfo from "./PriceInfo.interface";

export default interface ISolverWorkRequest {
	ratingsToTry: number[];
	targetRating: number;
	existingRatings: number[];
	prices: IPriceInfo;
}
