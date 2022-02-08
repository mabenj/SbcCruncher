import { IPriceInfo } from "./";

export interface ISolverWorkRequest {
	discriminator: "SOLVER-START";
	ratingsToTry: number[];
	targetRating: number;
	existingRatings: number[];
	prices: IPriceInfo;
}

export function instanceOfISolverWorkRequest(
	object: any
): object is ISolverWorkRequest {
	return object.discriminator === "SOLVER-START";
}
