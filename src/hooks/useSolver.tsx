import { getErrorMessage, range } from "@/common/utilities";
import { Solution } from "@/types/solution.interface";
import { SolverConfig } from "@/types/solver-config.interface";
import { SolverRequest } from "@/types/solver-request.interface";
import { SolverResponse } from "@/types/solver-response.interface";
import { useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useEventTracker } from "./useEventTracker";

export const useSolver = () => {
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [solutionsFound, setSolutionsFound] = useState(0);
    const [isSolving, setIsSolving] = useState(false);
    const [progress, setProgress] = useState(0);

    const startTimeRef = useRef(0);
    const solverRef = useRef<Worker | null>(null);

    const toast = useToast();

    const eventTracker = useEventTracker("Solver");

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => initWorker(), []);

    const initWorker = () => {
        if (!checkIsWorkerSupported() || solverRef.current !== null) {
            return;
        }
        solverRef.current = new Worker(
            new URL("../workers/solver.worker.ts", import.meta.url)
        );
        solverRef.current.onmessage = handleResponse;
        solverRef.current.onerror = handleError;
    };

    const resetWorker = () => {
        if (solverRef.current) {
            solverRef.current.terminate();
            solverRef.current = null;
            initWorker();
        }
        setIsSolving(false);
        setProgress(0);
    };

    const resetState = () => {
        setSolutions([]);
        setSolutionsFound(0);
        setIsSolving(false);
        setProgress(0);
    };

    const onSolve = async (config: SolverConfig) => {
        if (!checkIsWorkerSupported() || !solverRef.current) {
            return;
        }

        resetState();
        const existingRatings = config.existingRatings.flatMap(
            ({ count, rating }) =>
                Array.from({ length: count }).fill(rating) as number[]
        );
        const ratingsToTry = range(
            Math.min(...config.tryRatingMinMax),
            Math.max(...config.tryRatingMinMax)
        ).filter((rating) => !config.tryRatingExclude.includes(rating));

        const message: SolverRequest = {
            targetRating: config.targetRating,
            existingRatings: existingRatings,
            ratingsToTry: ratingsToTry,
            priceByRating: config.ratingPriceMap
        };
        setTimeout(() => {
            solverRef.current?.postMessage(message);
            startTimeRef.current = performance.now();
            setIsSolving(true);
        });
    };

    const onStopSolve = async () => {
        resetWorker();
        resetState();
        eventTracker("solve_stop", "stop");
    };

    const onClearSolutions = async () => {
        resetWorker();
        resetState();
    };

    const handleResponse = (e: MessageEvent<SolverResponse>) => {
        if (e.data.status === "error") {
            handleError(e.data.error);
            return;
        }
        if (e.data.done) {
            const elapsedMs = performance.now() - startTimeRef.current;
            toast({
                status: "success",
                description: `Calculation complete`
            });
            setIsSolving(false);
            setProgress(e.data.progress);
            setSolutions(e.data.solutions);
            setSolutionsFound(e.data.solutionsFound);
            eventTracker(
                `solve_complete`,
                `duration=${getDurationClass(elapsedMs)}`,
                e.data.solutionsFound
            );
        } else {
            setProgress(e.data.progress);
            setSolutionsFound(e.data.solutionsFound);
        }
    };

    const handleError = async (e: unknown) => {
        const message = getErrorMessage(e);
        console.error(e);
        toast({
            status: "error",
            title: "Calculation error",
            description: message
        });
        resetWorker();
        eventTracker(
            "solve_error",
            `ua=${navigator.userAgent},err=${JSON.stringify(e)}`
        );
    };

    const checkIsWorkerSupported = () => {
        if (window.Worker) {
            return true;
        }
        toast({
            status: "error",
            description: "Your browser does not support Web Workers"
        });
        eventTracker("worker_unsupported", navigator.userAgent);
        return false;
    };

    return {
        solutions,
        solutionsFound,
        isSolving,
        progress,
        onSolve,
        onStopSolve,
        onClearSolutions
    };
};

function getDurationClass(ms: number) {
    if (ms < 500) {
        return "instant";
    } else if (ms < 2000) {
        return "sub-2s";
    } else if (ms < 5000) {
        return "sub-5s";
    } else if (ms < 10000) {
        return "sub-10s";
    } else if (ms < 30000) {
        return "sub-30s";
    } else if (ms < 60000) {
        return "sub-1m";
    } else if (ms < 120000) {
        return "sub-2m";
    } else {
        return "longer";
    }
}
