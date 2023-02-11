import { Solution } from "@/types/solution.interface";
import { SolverConfig } from "@/types/solver-config.interface";
import { SolverResult } from "@/types/solver-result.interface";
import { getErrorMessage, range } from "@/utilities";
import { SolverWorker } from "@/workers/solver.worker";
import { useToast } from "@chakra-ui/react";
import { Subscription } from "observable-fns";
import { useRef, useState } from "react";
import { ModuleThread, spawn, Thread } from "threads";

const TIMER_KEY = "SOLVER";

export const useSolver = () => {
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [solutionsTotalCount, setSolutionsTotalCount] = useState(0);
    const [isSolving, setIsSolving] = useState(false);
    const [progress, setProgress] = useState(0);

    // const workerFnRef = useRef<SolveFnType | null>(null);
    const workerRef = useRef<ModuleThread<SolverWorker> | null>(null);
    const resultSubscriptionRef = useRef<Subscription<SolverResult> | null>(
        null
    );

    const toast = useToast();

    const onSolve = async (config: SolverConfig) => {
        await terminate();
        setIsSolving(true);

        const existingRatings = config.existingRatings.flatMap(
            ({ count, rating }) =>
                Array.from({ length: count }).fill(rating) as number[]
        );
        const ratingRange = range(
            Math.min(...config.tryRatingMinMax),
            Math.max(...config.tryRatingMinMax)
        );

        const solver = await spawn<SolverWorker>(
            new Worker(new URL("../workers/solver.worker.ts", import.meta.url))
        );
        const subscription = solver
            .getResult$()
            .subscribe(handleNext, handleError, handleComplete);

        workerRef.current = solver;
        resultSubscriptionRef.current = subscription;

        console.time(TIMER_KEY);
        solver.solve(
            config.targetRating,
            existingRatings,
            ratingRange,
            config.ratingPriceMap
        );
    };

    const onStopSolve = async () => {
        reset();
    };

    const onClearSolutions = async () => {
        reset();
    };

    const handleNext = (result: SolverResult) => {
        setSolutions(result.solutions);
        setProgress(result.progress);
        setSolutionsTotalCount(result.solutionsTotalCount);
    };

    const handleError = async (error: unknown) => {
        console.error({ error });
        toast({
            status: "error",
            title: "Calculation error",
            description: getErrorMessage(error)
        });
        reset();
    };

    const handleComplete = async () => {
        console.timeEnd(TIMER_KEY);
        toast({
            status: "success",
            description: "Calculation complete"
        });
        setIsSolving(false);
        setProgress(0);
    };

    const terminate = async () => {
        if (workerRef.current) {
            await Thread.terminate(workerRef.current);
            workerRef.current = null;
        }
        resultSubscriptionRef.current?.unsubscribe();
        resultSubscriptionRef.current = null;
    };

    const reset = async () => {
        await terminate();
        setProgress(0);
        setSolutionsTotalCount(0);
        setIsSolving(false);
        setSolutions([]);
    };

    return {
        solutions,
        solutionsTotalCount,
        isSolving,
        progress,
        onSolve,
        onStopSolve,
        onClearSolutions
    };
};
