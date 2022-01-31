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
					combination: [],
					status: "COMBINATION"
				};
				ctx.postMessage(response);
				resultChunk = [];
			}
		}
	}
	ctx.postMessage({
		resultChunk: resultChunk,
		combination: [],
		status: "COMBINATION"
	});
	ctx.postMessage({ combination: [], status: "DONE" });
});

// self.onmessage = async (event) => {
// 	if (event && event.data) {
// 		const { ratings, length } = event.data;
// 		combinationsWithRepetition(ratings, length);
// 		self.postMessage({ status: "DONE", combination: [] });
// 	}

// 	//https://stackoverflow.com/a/32544026
// 	function combinationsWithRepetition(arr, l) {
// 		if (l === void 0) l = arr.length; // Length of the combinations
// 		const data = Array(l); // Used to store stat
// 		const results = []; // Array of results
// 		(function f(pos, start) {
// 			// Recursive function
// 			if (pos === l) {
// 				// End reached
// 				results.push(data.slice()); // Add a copy of data to results
// 				return;
// 			}
// 			for (var i = start; i < arr.length; ++i) {
// 				data[pos] = arr[i]; // Update data
// 				f(pos + 1, i); // Call f recursively
// 			}
// 			self.postMessage({ status: "COMBINATION", combination: data });
// 		})(0, 0); // Start at index 0
// 		return results;
// 	}
// };

// //TODO check this: https://stackoverflow.com/a/48950463
