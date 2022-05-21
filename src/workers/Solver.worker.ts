/* eslint-disable no-restricted-globals */
import { multisets } from "combinatorics";
import Config from "../Config";
import { ISolution } from "../interfaces/Solution.interface";
import {
    instanceOfISolverDataFetchRequest,
    ISolverDataFetchRequest
} from "../interfaces/SolverDataFetchRequest.interface";
import {
    instanceOfISolverWorkRequest,
    ISolverWorkRequest
} from "../interfaces/SolverWorkRequest.interface";
import { ISolverWorkResult } from "../interfaces/SolverWorkResult.interface";
import {
    calculatePrice,
    getNumberOfCombinationsWithRepetitions,
    isTargetRating
} from "../util/utils";

const ctx: Worker = self as any;

let allSolutions: ISolution[];

ctx.addEventListener("message", (message) => {
    if (instanceOfISolverWorkRequest(message.data)) {
        handleWorkRequest(message.data);
    } else if (instanceOfISolverDataFetchRequest(message.data)) {
        handleDataFetch(message.data);
    }
});

function handleWorkRequest(request: ISolverWorkRequest) {
    allSolutions = [];
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
            if (elapsed >= Config.solverUpdateFrequencyMs) {
                postStatus(
                    "IN_PROGRESS",
                    (processedCombinationsCount / totalCombinationsCount) * 100
                );
                lastUpdate = Date.now();
            }
        }
    }

    postStatus("DONE", 100);
}

function handleDataFetch(request: ISolverDataFetchRequest) {
    const CHUNK_SIZE = 100;
    postStatus(
        "DATA_FETCH",
        100,
        request.fromIndex,
        request.fromIndex + CHUNK_SIZE
    );
}

function postStatus(
    status: "DONE" | "IN_PROGRESS" | "DATA_FETCH",
    percent: number,
    fromIndex: number = 0,
    toIndex: number = Config.maxAmountOfSolutions
) {
    const message: ISolverWorkResult = {
        solutions: getSolutions(fromIndex, toIndex),
        status: status,
        percent: percent,
        totalSolutionCount: allSolutions.length
    };
    ctx.postMessage(message);
}

function getSolutions(from: number, to: number): ISolution[] {
    return allSolutions.sort((a, b) => a.price - b.price).slice(from, to);
}
