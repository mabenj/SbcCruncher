import { SQUAD_SIZE } from "@/constants";
import { Solution } from "@/types/solution.interface";
import { SolverRequest } from "@/types/solver-request.interface";
import { SolverResponse } from "@/types/solver-response.interface";
import {
    calculatePrice,
    getNumberOfCombinationsWithRepetitions,
    getRating
} from "@/utilities";
import { multisets } from "combinatorics";

const UPDATE_INTERVAL_MS = 20;
const MAX_SOLUTIONS_TO_RETURN = 500;

const ctx: Worker = self as any;

ctx.onmessage = async (e: MessageEvent<SolverRequest>) => {
    const { targetRating, existingRatings, ratingsToTry, priceByRating } =
        e.data;
    const solutions: Solution[] = [];

    const totalCombinations = getNumberOfCombinationsWithRepetitions(
        ratingsToTry.length,
        SQUAD_SIZE - existingRatings.length
    );
    const combinations = multisets(
        ratingsToTry,
        SQUAD_SIZE - existingRatings.length
    );
    let processedCombinations = 0;
    let lastUpdate = Date.now();

    for (const combination of combinations) {
        processedCombinations++;
        const elapsed = Date.now() - lastUpdate;
        if (elapsed >= UPDATE_INTERVAL_MS) {
            const response: SolverResponse = {
                done: false,
                progress: (processedCombinations / totalCombinations) * 100,
                solutionsFound: solutions.length,
                solutions: []
            };
            ctx.postMessage(response);
            lastUpdate = Date.now();
        }

        if (getRating([...existingRatings, ...combination]) < targetRating) {
            continue;
        }

        const ratingCounts = combination.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);
        const squad = Object.keys(ratingCounts).map((rating) => ({
            rating: +rating,
            count: ratingCounts[+rating]
        }));
        solutions.push({
            price: calculatePrice(combination, priceByRating),
            squad: squad
        });
    }

    solutions.sort((a, b) => a.price - b.price);
    const response: SolverResponse = {
        done: true,
        progress: 100,
        solutionsFound: solutions.length,
        solutions: solutions.slice(0, MAX_SOLUTIONS_TO_RETURN)
    };
    ctx.postMessage(response);
};

export {};
