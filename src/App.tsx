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
import { Panel } from "primereact/panel";
import { ProgressBar } from "primereact/progressbar";
import { ScrollTop } from "primereact/scrolltop";
import { Card } from "primereact/card";
import { range, ratingRange } from "./util/utils";

import "./styles/App.scss";

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
		const ratingsToTry = range(
			tryRatingMin?.ratingValue || 0,
			tryRatingMax?.ratingValue || 0,
			1
		);
		const request: ISolverWorkRequest = {
			discriminator: "SOLVER-START",
			ratingsToTry: ratingsToTry,
			existingRatings:
				existingRatings?.map((rating) => rating.ratingValue) || [],
			targetRating: targetRating?.ratingValue || -1,
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
			<ScrollTop threshold={200} />

			<Sidebar />

			<div className="p-my-4">
				<Header />
			</div>

			<form noValidate onSubmit={calculate}>
				<FormPanelWrapper header="Target Rating & Fodder">
					<div className="p-lg-3 p-my-3">
						<TargetRatingInput
							value={targetRating}
							onChange={setTargetRating}
						/>
					</div>
					<div className="p-col p-my-3">
						<ExistingRatingsInput
							value={existingRatings || []}
							onChange={setExistingRatings}
						/>
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
						ratings={ratingRange(tryRatingMin, tryRatingMax, 1)}
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
					className="p-my-5"
					// animated={isCalculating}
					// striped
					value={Math.floor(progressPercentage)}
					// label={
					// 	progressPercentage === 100
					// 		? "Done"
					// 		: `${Math.round(progressPercentage)}%`
					// }
				/>

				<Solutions
					displaySolutions={solutions}
					targetRating={targetRating?.ratingValue}
					columnDefinitions={range(
						tryRatingMin?.ratingValue || 0,
						tryRatingMax?.ratingValue || 0,
						1
					).map((rating) => ({
						label: rating.toString(),
						rating: rating
					}))}
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
		<Card header={header} className={`p-my-5 p-mx-1 p-p-3 p-grid ${className}`}>
			{children}
		</Card>
	);
};
