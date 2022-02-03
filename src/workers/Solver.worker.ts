/* eslint-disable no-restricted-globals */
import { multisets } from "combinatorics";
import ISolverWorkRequest from "../interfaces/SolverWorkRequest.interface";
import ISolverWorkResult from "../interfaces/SolverWorkResult.interface";
import { calculatePrice, isTargetRating } from "../util/utils";
import Config from "../Config";
import ISolution from "../interfaces/Solution.interface";

const ctx: Worker = self as any;

ctx.addEventListener("message", (message) => {
	const request = message.data as ISolverWorkRequest;
	let resultChunk: ISolution[] = [];
	let solutionId = 0;
	const combinations = multisets(
		request.ratingsToTry,
		Config.playersInSquad - request.existingRatings.length
	);
	for (const combination of combinations) {
		const wholeSquad = [...request.existingRatings, ...combination];
		if (isTargetRating(wholeSquad, request.targetRating)) {
			const solution: ISolution = {
				id: solutionId++,
				price: calculatePrice(combination, request.prices),
				ratings: combination
			};
			resultChunk = [...resultChunk, solution];
			if (resultChunk.length === Config.solverResultChunkSize) {
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
