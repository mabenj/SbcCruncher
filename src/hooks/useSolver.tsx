import { Solution } from "@/types/solution.interface";
import { SolverConfig } from "@/types/solver-config.interface";
import { SolverRequest } from "@/types/solver-request.interface";
import { SolverResponse } from "@/types/solver-response.interface";
import { getErrorMessage, range } from "@/utilities";
import { useToast } from "@chakra-ui/react";
import prettyMilliseconds from "pretty-ms";
import { useEffect, useRef, useState } from "react";
import { useEventTracker } from "./useEventTracker";

const TIMER_KEY = "SOLVER";

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
        );

        const message: SolverRequest = {
            targetRating: config.targetRating,
            existingRatings: existingRatings,
            ratingsToTry: ratingsToTry,
            priceByRating: config.ratingPriceMap
        };
        solverRef.current.postMessage(message);
        startTimeRef.current = performance.now();
        setIsSolving(true);
        eventTracker(
            "solve_start",
            `target=${config.targetRating}|existing=${config.existingRatings
                .map(({ rating, count }) => count + "x" + rating)
                .join(",")}|minMax=${config.tryRatingMinMax[0]}, ${
                config.tryRatingMinMax[1]
            }`
        );
    };

    const onStopSolve = async () => {
        resetWorker();
        eventTracker("solve_stop");
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
            const elapsed = prettyMilliseconds(
                performance.now() - startTimeRef.current,
                { verbose: true }
            );
            console.log(`Solved in ${elapsed}`);
            toast({
                status: "success",
                description: `Calculation completed in ${elapsed}`
            });
            setIsSolving(false);
            setProgress(e.data.progress);
            setSolutions(e.data.solutions);
            setSolutionsFound(e.data.solutionsFound);
            eventTracker(
                `solve_success=${elapsed}`,
                `solutions=${e.data.solutionsFound}|t=${elapsed}`,
                e.data.solutionsFound
            );
        } else {
            setProgress(e.data.progress);
            setSolutionsFound(e.data.solutionsFound);
        }
    };

    const handleError = async (e: ErrorEvent | unknown) => {
        const message = getErrorMessage(e instanceof ErrorEvent ? e.error : e);
        console.error(e);
        toast({
            status: "error",
            title: "Calculation error",
            description: message
        });
        resetWorker();
        eventTracker("solve_error", message || JSON.stringify(e));
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