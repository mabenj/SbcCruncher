import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
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
	TryRatingsRangeInput
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
import { range, ratingRange } from "./util/utils";

import "./styles/App.scss";

function App() {
	const [solver, setSolver] = useState(new Solver());

	const [isFormValid /*, setIsFormValid*/] = useState<boolean | undefined>();
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
		<main>
			<Container fluid="md">
				<Sidebar />
				<Row className="my-4">
					<Header />
				</Row>

				<Form noValidate validated={isFormValid} onSubmit={calculate}>
					<FormRowWrapper>
						<Col lg={3} className="my-3">
							<TargetRatingInput
								value={targetRating}
								onChange={setTargetRating}
							/>
						</Col>
						<Col className="my-3">
							<ExistingRatingsInput
								value={existingRatings || []}
								onChange={setExistingRatings}
							/>
						</Col>
					</FormRowWrapper>

					<FormRowWrapper>
						<TryRatingsRangeInput
							valueOfMin={tryRatingMin}
							valueOfMax={tryRatingMax}
							onChange={(min, max) => {
								setTryRatingMin(min);
								setTryRatingMax(max);
							}}
						/>
					</FormRowWrapper>

					<FormRowWrapper>
						<PricesInput
							ratings={ratingRange(tryRatingMin, tryRatingMax, 1)}
							onChange={setPrices}
						/>
					</FormRowWrapper>

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
						className="my-5"
						animated={isCalculating}
						striped
						now={progressPercentage}
						label={
							progressPercentage === 100
								? "Done"
								: `${Math.round(progressPercentage)}%`
						}
					/>

					<Row>
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
					</Row>
				</Form>
			</Container>
		</main>
	);
}

export default App;

const FormRowWrapper = ({
	children,
	className
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<Row className={`my-5 mx-1 bg-light border rounded p-3 ${className}`}>
			{children}
		</Row>
	);
};
