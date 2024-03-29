import { MAX_SOLUTIONS_TO_TAKE, SQUAD_SIZE } from "@/common/constants";
import { Solution } from "@/types/solution.interface";
import { SolverRequest } from "@/types/solver-request.interface";
import { SolverResponse } from "@/types/solver-response.interface";
import { SolverHelper } from "./solver-helper";

const UPDATE_INTERVAL_MS = 20;

const ctx: Worker = self as any;

ctx.onmessage = (e: MessageEvent<SolverRequest>) => handleRequest(e.data);

function handleRequest(request: SolverRequest) {
    try {
        const { targetRating, existingRatings, ratingsToTry, priceByRating } =
            request;
        const solutions: Solution[] = [];

        const totalCombinations = SolverHelper.getMultisubsetsCount(
            ratingsToTry.length,
            SQUAD_SIZE - existingRatings.length
        );
        const combinations = SolverHelper.getMultisubsets(
            ratingsToTry,
            SQUAD_SIZE - existingRatings.length
        );
        let processedCombinations = 0;
        let lastUpdate = performance.now();

        for (const combination of combinations) {
            processedCombinations++;
            const elapsed = performance.now() - lastUpdate;
            if (elapsed >= UPDATE_INTERVAL_MS) {
                const response: SolverResponse = {
                    status: "ok",
                    done: false,
                    progress: (processedCombinations / totalCombinations) * 100,
                    solutionsFound: solutions.length,
                    solutions: []
                };
                ctx.postMessage(response);
                lastUpdate = performance.now();
            }

            const rating = SolverHelper.getRating([
                ...existingRatings,
                ...combination
            ]);
            if (rating < targetRating) {
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
                price: SolverHelper.getPrice(combination, priceByRating),
                squad: squad
            });
        }

        solutions.sort((a, b) => a.price - b.price);
        const response: SolverResponse = {
            status: "ok",
            done: true,
            progress: 100,
            solutionsFound: solutions.length,
            solutions: solutions.slice(0, MAX_SOLUTIONS_TO_TAKE)
        };
        ctx.postMessage(response);
    } catch (error) {
        const response: SolverResponse = {
            status: "error",
            error: error,
            done: true,
            progress: 100,
            solutionsFound: 0,
            solutions: []
        };
        ctx.postMessage(response);
    }
}
