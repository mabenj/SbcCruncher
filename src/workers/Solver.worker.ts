/* eslint-disable no-restricted-globals */
import { multisets } from "combinatorics";
import ISolverWorkRequest from "../interfaces/SolverWorkRequest.interface";
import ISolverWorkResult from "../interfaces/SolverWorkResult.interface";
import {
	calculatePrice,
	getNumberOfCombinationsWithRepetitions,
	isTargetRating
} from "../util/utils";
import Config from "../Config";
import ISolution from "../interfaces/Solution.interface";

const UPDATE_FREQUENCY_MS = 300;

const ctx: Worker = self as any;

let allSolutions: ISolution[] = [];

ctx.addEventListener("message", (message) => {
	const request = message.data as ISolverWorkRequest;
	const totalCombinationsCount = getNumberOfCombinationsWithRepetitions(
		request.ratingsToTry.length,
		Config.playersInSquad - request.existingRatings.length
	);
	let processedCombinationsCount = 0;
	const combinations = multisets(
		request.ratingsToTry,
		Config.playersInSquad - request.existingRatings.length
	);
	let lastUpdate = Date.now();
	for (const combination of combinations) {
		processedCombinationsCount++;
		const wholeSquad = [...request.existingRatings, ...combination];
		if (isTargetRating(wholeSquad, request.targetRating)) {
			allSolutions.push({
				id: Math.random(),
				price: calculatePrice(combination, request.prices),
				ratings: combination
			});

			const elapsed = Date.now() - lastUpdate;
			if (elapsed >= UPDATE_FREQUENCY_MS) {
				postStatus(
					"IN_PROGRESS",
					(processedCombinationsCount / totalCombinationsCount) * 100
				);
				lastUpdate = Date.now();
			}
		}
	}
	postStatus("DONE", 100);
});

function postStatus(status: "DONE" | "IN_PROGRESS", percent: number) {
	const message: ISolverWorkResult = {
		cheapestSolutions: getCheapestSolutions(Config.maxAmountOfSolutions),
		status: status,
		percent: percent,
		totalSolutionCount: allSolutions.length
	};
	ctx.postMessage(message);
}

function getCheapestSolutions(n: number): ISolution[] {
	return allSolutions.sort((a, b) => a.price - b.price).slice(0, n);
}
