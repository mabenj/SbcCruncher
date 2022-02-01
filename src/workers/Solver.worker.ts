/* eslint-disable no-restricted-globals */
import { multisets } from "combinatorics";
import ISolverWorkRequest from "../interfaces/SolverWorkRequest.interface";
import ISolverWorkResult from "../interfaces/SolverWorkResult.interface";
import { isTargetRating } from "../util/utils";

const CHUNK_SIZE = 40;

const ctx: Worker = self as any;

ctx.addEventListener("message", (message) => {
	const request = message.data as ISolverWorkRequest;
	let resultChunk: number[][] = [];
	const combinations = multisets(request.ratingsToTry, request.length);
	for (const combination of combinations) {
		const wholeSquad = [...request.existingRatings, ...combination];
		if (isTargetRating(wholeSquad, request.targetRating)) {
			resultChunk = [...resultChunk, combination];
			if (resultChunk.length === CHUNK_SIZE) {
				const response: ISolverWorkResult = {
					resultChunk: resultChunk,
					status: "IN_PROGRESS"
				};
				ctx.postMessage(response);
				resultChunk = [];
			}
		}
	}
	const result: ISolverWorkResult = {
		resultChunk: resultChunk,
		status: "DONE"
	};
	ctx.postMessage(result);
});
