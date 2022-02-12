import React, { useEffect, useState } from "react";
import {
	ISolution,
	ISolverWorkResult,
	ISolverWorkRequest,
	IPriceInfo,
	ISolverDataFetchRequest
} from "./interfaces";
import {
	CalculationButtons,
	ExistingRatingsInput,
	Header,
	PricesInput,
	Sidebar,
	Solutions,
	TargetRatingInput,
	TryRatingsRangeInput,
	Container
} from "./components/";
/* eslint-disable import/no-webpack-loader-syntax */
import Solver from "worker-loader!./solver/Solver.worker.ts";
import ReactGA from "react-ga";
import { useAtom } from "jotai";
import {
	targetRatingAtom,
	existingRatingsAtom,
	tryRatingMinAtom,
	tryRatingMaxAtom
} from "./atoms";
import { ProgressBar } from "primereact/progressbar";
import { ScrollTop } from "primereact/scrolltop";
import { Card } from "primereact/card";
import { range } from "./util/utils";

import "./styles/App.scss";
import Config from "./Config";

function App() {
	const [solver, setSolver] = useState(new Solver());

	const [isCalculating, setIsCalculating] = useState(false);
	const [progressPercentage, setProgressPercentage] = useState(0);

	const [targetRating, setTargetRating] = useAtom(targetRatingAtom);
	const [existingRatings, setExistingRatings] = useAtom(existingRatingsAtom);
	const [tryRatingMin, setTryRatingMin] = useAtom(tryRatingMinAtom);
	const [tryRatingMax, setTryRatingMax] = useAtom(tryRatingMaxAtom);

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
	}, [targetRating, existingRatings, tryRatingMin, tryRatingMax]);

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
						prev.concat(result.solutions).sort((a, b) => a.price - b.price)
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
		const ratingsToTry = range(tryRatingMin, tryRatingMax, 1);
		const request: ISolverWorkRequest = {
			discriminator: "SOLVER-START",
			ratingsToTry: ratingsToTry,
			existingRatings: existingRatings || [],
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
		console.log("Fetch more!");
		const request: ISolverDataFetchRequest = {
			discriminator: "SOLVER-FETCH",
			fromIndex
		};
		solver.postMessage(request);
	};

	return (
		<Container>
			<ScrollTop threshold={Config.scrollToTopThreshold} />
            
			<div className="p-my-4">
				<Header />
			</div>

			<form noValidate onSubmit={calculate}>
				<FormPanelWrapper>
					<div className="p-grid">
						<div className="p-col-12 p-lg-3 p-mx-3">
							<TargetRatingInput
								value={targetRating}
								onChange={setTargetRating}
							/>
						</div>
						<div className="p-col p-mx-3">
							<ExistingRatingsInput
								value={existingRatings || []}
								onChange={setExistingRatings}
							/>
						</div>
					</div>
				</FormPanelWrapper>

				<FormPanelWrapper>
					<TryRatingsRangeInput
						valueOfMin={tryRatingMin}
						valueOfMax={tryRatingMax}
						onChange={(min, max) => {
							setTryRatingMin(min);
							setTryRatingMax(max);
						}}
					/>
				</FormPanelWrapper>

				<FormPanelWrapper>
					<PricesInput
						ratings={range(tryRatingMin, tryRatingMax, 1)}
						onChange={setPrices}
					/>
				</FormPanelWrapper>

				<CalculationButtons
					disabled={!targetRating || isCalculating}
					isCalculating={isCalculating}
					onStopPressed={() => {
						setSolver((prev) => {
							prev.terminate();
							setIsCalculating(false);
							return new Solver();
						});
					}}
				/>

				<ProgressBar
					className="p-my-6"
					value={Math.floor(progressPercentage)}
				/>

				<Solutions
					displaySolutions={solutions}
					targetRating={targetRating}
					columnDefinitions={range(tryRatingMin, tryRatingMax, 1)}
					totalSolutionsCount={solutionsCount}
					fetchMoreSolutions={fetchMoreSolutions}
					isCalculating={isCalculating}
				/>
			</form>
		</Container>
	);
}

export default App;

const FormPanelWrapper = ({
	children,
	className,
	header
}: {
	children: React.ReactNode;
	className?: string;
	header?: string;
}) => {
	return (
		<Card header={header} className={`p-my-5 p-p-lg-3 p-p-md-1 ${className}`}>
			{children}
		</Card>
	);
};
