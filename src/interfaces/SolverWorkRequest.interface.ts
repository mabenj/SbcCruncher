export default interface ISolverWorkRequest {
	ratingsToTry: number[];
	length: number;
	targetRating: number;
	existingRatings: number[];
}
