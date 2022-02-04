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
	const totalCombinations = getNumberOfCombinations(
		request.ratingsToTry.length,
		Config.playersInSquad - request.existingRatings.length
	);
	let processedCombinations = 0;
	let solutionId = 0;
	const combinations = multisets(
		request.ratingsToTry,
		Config.playersInSquad - request.existingRatings.length
	);
	for (const combination of combinations) {
		processedCombinations++;
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
					status: "IN_PROGRESS",
					percent: (processedCombinations / totalCombinations) * 100
				};
				ctx.postMessage(response);
				resultChunk = [];
			}
		}
	}
	const result: ISolverWorkResult = {
		resultChunk: resultChunk,
		status: "DONE",
		percent: 100
	};
	ctx.postMessage(result);
});

function getNumberOfCombinations(n: number, k: number) {
	return factorial(n + k - 1) / (factorial(n - 1) * factorial(k));
}

function factorial(num: number): number {
	var rval = 1;
	for (var i = 2; i <= num; i++) rval = rval * i;
	return rval;
}
