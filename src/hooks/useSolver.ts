import { useEffect, useRef, useState } from "react";
/* eslint-disable import/no-webpack-loader-syntax */
import Solver from "worker-loader!../workers/Solver.worker.ts";
import { IPriceInfo } from "../interfaces/PriceInfo.interface";
import { ISolution } from "../interfaces/Solution.interface";
import { ISolverDataFetchRequest } from "../interfaces/SolverDataFetchRequest.interface";
import { ISolverWorkRequest } from "../interfaces/SolverWorkRequest.interface";
import { ISolverWorkResult } from "../interfaces/SolverWorkResult.interface";
import { useAnalytics } from "./useAnalytics";

const CALCULATION_END_DELAY_MS = 1000;

export const useSolver = () => {
    const { event } = useAnalytics();

    const [solver, setSolver] = useState<Solver>();

    const [isCalculating, setIsCalculating] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);

    const [solutions, setSolutions] = useState<ISolution[]>([]);
    const [solutionsCount, setSolutionsCount] = useState<number | null>(null);

    const originalTitle = useRef(document.title);

    useEffect(() => setSolver(new Solver()), []);

    useEffect(() => {
        document.title = isCalculating
            ? `SBC Cruncher (Solving ${Math.floor(progressPercent)}%)`
            : originalTitle.current;
    }, [isCalculating, progressPercent]);

    useEffect(() => {
        if (!solver) {
            return;
        }
        solver.onmessage = (message) => {
            const result = message.data as ISolverWorkResult;
            switch (result.status) {
                //@ts-ignore
                case "DONE": {
                    setTimeout(() => {
                        setIsCalculating(false);
                        setProgressPercent(0);
                    }, CALCULATION_END_DELAY_MS);
                    event({
                        category: "SOLVER",
                        action: "CALCULATION_SUCCESS",
                        details: { solutions_count: result.totalSolutionCount }
                    });
                    /* falls through */
                }
                case "IN_PROGRESS": {
                    requestAnimationFrame(() => {
                        setSolutionsCount(result.totalSolutionCount);
                        setProgressPercent(result.percent);
                        setSolutions(() => result.solutions);
                    });
                    break;
                }
                case "DATA_FETCH": {
                    setSolutions((prev: ISolution[]) =>
                        prev
                            .concat(result.solutions)
                            .sort((a, b) => a.price - b.price)
                    );
                    break;
                }
                default: {
                    break;
                }
            }
        };
        solver.onerror = (error) => {
            console.error("SOLVER WORKER ERROR", error);
            event({
                category: "SOLVER",
                action: "SOLVER_ERROR",
                details: { solver_error: error }
            });
            setIsCalculating(false);
        };
    }, [event, solver]);

    const calculate = (
        targetRating: number,
        existingRatings: number[],
        ratingsToTry: number[],
        prices: IPriceInfo
    ) => {
        setSolutions([]);
        setSolutionsCount(null);
        setProgressPercent(0);
        setIsCalculating(true);
        const request: ISolverWorkRequest = {
            discriminator: "SOLVER-START",
            targetRating,
            existingRatings,
            ratingsToTry,
            prices
        };
        solver && solver.postMessage(request);
        event({
            category: "SOLVER",
            action: "START_CALCULATE",
            details: {
                calculation_config: {
                    target: targetRating,
                    existing_ratings: existingRatings,
                    try_ratings: ratingsToTry
                }
            }
        });
    };

    const fetchSolutions = (fromIndex: number) => {
        const request: ISolverDataFetchRequest = {
            discriminator: "SOLVER-FETCH",
            fromIndex
        };
        solver && solver.postMessage(request);
    };

    const stopSolver = () => {
        if (!isCalculating) {
            return;
        }
        setSolver((prev) => {
            prev && prev.terminate();
            prev = new Solver();
            setIsCalculating(false);
            return prev;
        });
    };

    const resetState = () => {
        setSolutions([]);
        setSolutionsCount(null);
        setProgressPercent(0);
        stopSolver();
    };

    const solverState = {
        isCalculating,
        progressPercent,
        solutions,
        solutionsCount
    };

    return [
        solverState,
        calculate,
        stopSolver,
        fetchSolutions,
        resetState
    ] as const;
};
