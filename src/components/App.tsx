import PrimeReact from "primereact/api";
import { ProgressBar } from "primereact/progressbar";
import { ScrollTop } from "primereact/scrolltop";
import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";
/* eslint-disable import/no-webpack-loader-syntax */
import Solver from "worker-loader!../solver/Solver.worker.ts";
import { Container, Footer, Header, Solutions } from ".";
import Config from "../Config";
import {
    IPriceInfo,
    ISolution,
    ISolverDataFetchRequest,
    ISolverWorkRequest,
    ISolverWorkResult
} from "../interfaces";
import { range } from "../util/utils";
import ConfigurationForm from "./ConfigurationForm";
PrimeReact.ripple = true;

const CALCULATION_END_DELAY_MS = 1000;

function App() {
    const [solver, setSolver] = useState(new Solver());

    const [isCalculating, setIsCalculating] = useState(false);
    const [progressPercentage, setProgressPercentage] = useState(0);

    const [solutions, setSolutions] = useState<ISolution[]>([]);
    const [solutionsCount, setSolutionsCount] = useState<number | null>(null);
    const [solutionColumns, setSolutionColumns] = useState<number[]>(
        range(Config.defaultTryMin, Config.defaultTryMax)
    );

    useEffect(() => {
        ReactGA.pageview(window.location.pathname);
    }, []);

    useEffect(() => {
        solver.onmessage = (message) => {
            const result = message.data as ISolverWorkResult;
            switch (result.status) {
                //@ts-ignore
                case "DONE": {
                    setTimeout(() => {
                        setIsCalculating(false);
                        setProgressPercentage(0);
                    }, CALCULATION_END_DELAY_MS);
                    /* falls through */
                }
                case "IN_PROGRESS": {
                    requestAnimationFrame(() => {
                        setSolutionsCount(result.totalSolutionCount);
                        setProgressPercentage(result.percent);
                        setSolutions(result.solutions);
                    });
                    break;
                }
                case "DATA_FETCH": {
                    setSolutions((prev) =>
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
            ReactGA.event({
                category: "ERROR",
                action: "SOLVER_MESSAGE",
                label: "SOLVER"
            });
            setIsCalculating(false);
        };
    }, [solver]);

    const calculate = (
        targetRating: number,
        existingRatings: number[],
        ratingsToTry: number[],
        prices: IPriceInfo
    ) => {
        setSolutions([]);
        setSolutionsCount(null);
        setProgressPercentage(0);
        setIsCalculating(true);
        const request: ISolverWorkRequest = {
            discriminator: "SOLVER-START",
            targetRating,
            existingRatings,
            ratingsToTry,
            prices
        };
        solver.postMessage(request);
        ReactGA.event({
            category: "CALCULATE",
            action: "CALCULATE_PRESSED",
            label: "CALCULATE"
        });
    };

    const fetchMoreSolutions = (fromIndex: number) => {
        const request: ISolverDataFetchRequest = {
            discriminator: "SOLVER-FETCH",
            fromIndex
        };
        solver.postMessage(request);
    };

    return (
        <>
            <Container>
                <Header />

                <ConfigurationForm
                    calculate={calculate}
                    configChanged={() => {
                        setSolutions([]);
                        setSolutionsCount(null);
                        setProgressPercentage(0);
                    }}
                    stopPressed={() => {
                        setSolver((prev) => {
                            prev.terminate();
                            prev = new Solver();
                            setIsCalculating(false);
                            return prev;
                        });
                    }}
                    tryBoundsChanged={(newBounds) =>
                        setSolutionColumns(range(newBounds[0], newBounds[1]))
                    }
                    isCalculating={isCalculating}
                />

                <Solutions
                    displaySolutions={solutions}
                    columnDefinitions={solutionColumns}
                    totalSolutionsCount={solutionsCount}
                    fetchMoreSolutions={fetchMoreSolutions}
                    isCalculating={isCalculating}
                />

                <Footer />
            </Container>

            <ScrollTop threshold={Config.scrollToTopThreshold} />

            <ProgressBar
                value={progressPercentage}
                showValue={false}
                className="fixed top-0 w-full"
                style={{
                    height: "4px",
                    backgroundColor: "transparent",
                    visibility: isCalculating ? "visible" : "hidden"
                }}
            />
        </>
    );
}

export default App;
