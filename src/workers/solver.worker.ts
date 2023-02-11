import { SQUAD_SIZE } from "@/constants";
import { Solution } from "@/types/solution.interface";
import { SolverResult } from "@/types/solver-result.interface";
import {
    calculatePrice,
    getNumberOfCombinationsWithRepetitions,
    getRating
} from "@/utilities";
import { multisets } from "combinatorics";
import { Observable, Subject } from "observable-fns";
import { expose } from "threads/worker";

const _resultSubject = new Subject<SolverResult>();
const _currentSolutions: Solution[] = [];

const solver = {
    getResult$() {
        return Observable.from(_resultSubject);
    },
    solve(
        targetRating: number,
        existingRatings: number[],
        ratingRange: number[],
        priceMap: Record<number, number>
    ) {
        run(targetRating, existingRatings, ratingRange, priceMap).then(
            () => _resultSubject.complete(),
            (error) => _resultSubject.error(error)
        );
    }
};

async function run(
    targetRating: number,
    existingRatings: number[],
    ratingRange: number[],
    priceMap: Record<number, number>
) {
    const totalCombinations = getNumberOfCombinationsWithRepetitions(
        ratingRange.length,
        SQUAD_SIZE - existingRatings.length
    );
    const combinations = multisets(
        ratingRange,
        SQUAD_SIZE - existingRatings.length
    );
    let processedCombinations = 0;

    for (const combination of combinations) {
        processedCombinations++;
        const squadRatings = [...existingRatings, ...combination];
        const rating = getRating(squadRatings);
        if (rating !== targetRating) {
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
        _currentSolutions.push({
            price: calculatePrice(combination, priceMap),
            squad: squad
        });
        _currentSolutions.sort((a, b) => a.price - b.price);

        const result: SolverResult = {
            progress: (processedCombinations / totalCombinations) * 100,
            solutions: [],
            solutionsTotalCount: _currentSolutions.length
        };
        _resultSubject.next(result);
    }

    const result: SolverResult = {
        progress: (processedCombinations / totalCombinations) * 100,
        solutions: _currentSolutions,
        solutionsTotalCount: _currentSolutions.length
    };
    _resultSubject.next(result);
}

export type SolverWorker = typeof solver;

expose(solver);
