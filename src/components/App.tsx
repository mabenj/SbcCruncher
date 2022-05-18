import { BlockUI } from "primereact/blockui";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { ProgressBar } from "primereact/progressbar";
import { ScrollTop } from "primereact/scrolltop";
import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";
/* eslint-disable import/no-webpack-loader-syntax */
import Solver from "worker-loader!../solver/Solver.worker.ts";
import {
    CalculationButtons,
    Container,
    ExistingRatingsInput,
    Footer,
    Header,
    PricesInput,
    Solutions,
    TargetRatingInput,
    TryRatingsRangeInput
} from ".";
import Config from "../Config";
import {
    IExistingRating,
    IPriceInfo,
    ISolution,
    ISolverDataFetchRequest,
    ISolverWorkRequest,
    ISolverWorkResult
} from "../interfaces";
import { range } from "../util/utils";
import { Link } from "./Link";

function App() {
    const [solver, setSolver] = useState(new Solver());

    const [isCalculating, setIsCalculating] = useState(false);
    const [progressPercentage, setProgressPercentage] = useState(0);

    const [targetRating, setTargetRating] = useState<number | undefined>();
    const [existingRatings, setExistingRatings] = useState<IExistingRating[]>(
        []
    );
    const [tryBoundaries, setTryBoundaries] = useState<[number, number]>([
        Config.defaultTryMin,
        Config.defaultTryMax
    ]);

    const [prices, setPrices] = useState<IPriceInfo>({});
    const [solutions, setSolutions] = useState<ISolution[]>([]);
    const [solutionsCount, setSolutionsCount] = useState<number | null>(null);

    useEffect(() => {
        ReactGA.pageview(window.location.pathname);
    }, []);

    useEffect(() => {
        setSolutions([]);
        setSolutionsCount(null);
        setProgressPercentage(0);
    }, [targetRating, existingRatings, tryBoundaries]);

    useEffect(() => {
        solver.onmessage = (message) => {
            const result = message.data as ISolverWorkResult;
            switch (result.status) {
                //@ts-ignore
                case "DONE": {
                    setIsCalculating(false);
                    /* falls through */
                }
                case "IN_PROGRESS": {
                    requestAnimationFrame(() => {
                        setSolutionsCount(result.totalSolutionCount);
                        setProgressPercentage(result.percent);
                        setSolutions(result.solutions);
                    });
                    ReactGA.event({
                        category: "CALCULATION",
                        action: "CALCULATION_DONE",
                        label: "CALCULATION"
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
    }, [prices, solver]);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        setSolutions([]);
        setSolutionsCount(null);
        setProgressPercentage(0);
        setIsCalculating(true);
        const ratingsToTry = range(tryBoundaries[0], tryBoundaries[1], 1);
        const request: ISolverWorkRequest = {
            discriminator: "SOLVER-START",
            ratingsToTry: ratingsToTry,
            existingRatings:
                existingRatings?.flatMap(({ rating, quantity }) =>
                    new Array(quantity).fill(rating)
                ) || [],
            targetRating: targetRating || -1,
            prices: prices
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
        <Container>
            <ScrollTop threshold={Config.scrollToTopThreshold} />

            <div className="my-4">
                <Header />
            </div>

            <form noValidate onSubmit={calculate}>
                <FormPanelWrapper title="Target Rating" id="targetRating">
                    <TargetRatingInput
                        value={targetRating}
                        onChange={setTargetRating}
                    />
                </FormPanelWrapper>

                <FormPanelWrapper
                    title="Existing Players"
                    blocked={!targetRating}>
                    <ExistingRatingsInput
                        value={existingRatings || []}
                        onChange={(nr) => (nr ? setExistingRatings(nr) : [])}
                    />
                </FormPanelWrapper>

                <FormPanelWrapper
                    title="Range of Ratings to Try"
                    blocked={!targetRating}>
                    <TryRatingsRangeInput
                        value={tryBoundaries}
                        onChange={(newBoundaries: [min: number, max: number]) =>
                            setTryBoundaries(newBoundaries)
                        }
                    />
                </FormPanelWrapper>

                <FormPanelWrapper title="Player Prices" blocked={!targetRating}>
                    <PricesInput
                        ratings={range(tryBoundaries[0], tryBoundaries[1], 1)}
                        onChange={setPrices}
                    />
                </FormPanelWrapper>

                <CalculationButtons
                    disabled={!targetRating || isCalculating}
                    isCalculating={isCalculating}
                    onStopPressed={() => {
                        setSolver((prev) => {
                            prev.terminate();
                            prev = new Solver();
                            setIsCalculating(false);
                            return prev;
                        });
                    }}
                />

                <div
                    className="my-4"
                    style={{ visibility: targetRating ? "hidden" : "visible" }}>
                    <Message
                        severity="error"
                        text="Target rating is not specified — It is required"></Message>
                </div>

                <ProgressBar
                    className="my-6"
                    value={Math.floor(progressPercentage)}
                />

                <Solutions
                    displaySolutions={solutions}
                    targetRating={targetRating}
                    columnDefinitions={range(
                        tryBoundaries[0],
                        tryBoundaries[1],
                        1
                    )}
                    totalSolutionsCount={solutionsCount}
                    fetchMoreSolutions={fetchMoreSolutions}
                    isCalculating={isCalculating}
                />
            </form>
            <Footer />
        </Container>
    );
}

export default App;

const FormPanelWrapper = ({
    children,
    className,
    title,
    blocked,
    id
}: {
    children: React.ReactNode;
    className?: string;
    title?: string;
    blocked?: boolean;
    id?: string;
}) => {
    return (
        <div id={id}>
            <BlockUI
                blocked={blocked}
                className="block-mask"
                template={
                    <div className="text-center text-white">
                        <div className="pi pi-ban mb-3 text-4xl"></div>
                        <div>
                            Specify a{" "}
                            <Link
                                href="#targetRating"
                                openInSameTab
                                style={{ textShadow: "" }}>
                                Target Rating
                            </Link>{" "}
                            to Continue
                        </div>
                    </div>
                }>
                <Card className={`lg:my-8 p-0 m-0 lg:px-4 ${className}`}>
                    {title && (
                        <>
                            <div className="font-medium text-lg">{title}</div>
                            <Divider />
                        </>
                    )}

                    {children}
                </Card>
            </BlockUI>
        </div>
    );
};
