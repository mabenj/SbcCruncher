import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "./components/Header";
import ExistingRatingsInput from "./components/ExistingRatingsInput";
import TargetRatingInput from "./components/TargetRatingInput";
import IRatingOption from "./interfaces/RatingOption.interface";
import Form from "react-bootstrap/Form";
import RatingsRangeInput from "./components/RatingsRangeInput";
import Solutions from "./components/Solutions";
import ISolution from "./interfaces/Solution.interface";
import CalculationButtons from "./components/CalculationButtons";
/* eslint-disable import/no-webpack-loader-syntax */
import Solver from "worker-loader!./workers/Solver.worker.ts";
import ISolverWorkResult from "./interfaces/SolverWorkResult.interface";
import ISolverWorkRequest from "./interfaces/SolverWorkRequest.interface";
import IPriceInfo from "./interfaces/PriceInfo.interface";
import PricesInput from "./components/PricesInput";
import ReactGA from "react-ga";
import Sidebar from "./components/Sidebar";
import Config from "./Config";

function App() {
	const [solver, setSolver] = useState(new Solver());

	const [isFormValid /*, setIsFormValid*/] = useState<boolean | undefined>();
	const [isCalculating, setIsCalculating] = useState(false);

	const [targetRating, setTargetRating] = useState<IRatingOption>();
	const [existingRatings, setExistingRatings] = useState<IRatingOption[]>([]);
	const [ratingsToTry, setRatingsToTry] = useState<IRatingOption[]>(
		Config.defaultTryRange
	);

	const [prices, setPrices] = useState<IPriceInfo>({});
	const [solutions, setSolutions] = useState<ISolution[]>([]);
	const [solutionsCount, setSolutionsCount] = useState<number | null>(null);

	useEffect(() => {
		ReactGA.pageview(window.location.pathname);
	}, []);

	useEffect(() => {
		setSolutions([]);
		setSolutionsCount(null);
	}, [targetRating, existingRatings, ratingsToTry]);

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
					setSolutionsCount((prev) => (prev || 0) + result.resultChunk.length);
					setSolutions((prev) => {
						// Assume prev array and result array are both sorted
						if (result.resultChunk[0].price > prev[-1]?.price) {
							return prev;
						}
						const all = [...prev, ...result.resultChunk].sort(
							(a, b) => a.price - b.price
						);
						return all.slice(0, Config.maxAmountOfSolutions);
					});
					ReactGA.event({
						category: "CALCULATION",
						action: "CALCULATION_DONE",
						label: "CALCULATION"
					});
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
		setIsCalculating(true);
		const request: ISolverWorkRequest = {
			ratingsToTry: ratingsToTry.map((rating) => rating.ratingValue),
			existingRatings: existingRatings.map((rating) => rating.ratingValue),
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

	return (
		<main>
			<Container fluid="md">
				<Sidebar />
				<Row className="my-4">
					<Header />
				</Row>

				<Form noValidate validated={isFormValid} onSubmit={calculate}>
					<FormRowWrapper>
						<Col lg={3}>
							<TargetRatingInput
								ratingOptions={Config.ratingOptions}
								onChange={setTargetRating}
							/>
						</Col>
						<Col>
							<ExistingRatingsInput
								ratingOptions={Config.ratingOptions}
								onChange={setExistingRatings}
							/>
						</Col>
					</FormRowWrapper>

					<FormRowWrapper>
						<RatingsRangeInput
							ratingOptions={Config.ratingOptions}
							onChange={setRatingsToTry}
							defaultRange={Config.defaultTryRange}
						/>
					</FormRowWrapper>

					<FormRowWrapper>
						<PricesInput ratings={ratingsToTry} onChange={setPrices} />
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

					<Row className="my-5">
						<Solutions
							displaySolutions={solutions}
							targetRating={targetRating?.ratingValue}
							columnDefinitions={ratingsToTry.map((rating) => ({
								label: rating.label,
								rating: rating.ratingValue
							}))}
							totalSolutionsCount={solutionsCount}
						/>
					</Row>
				</Form>
			</Container>
		</main>
	);
}

export default App;

const FormRowWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<Row className="my-5 mx-1 bg-light border rounded p-3">{children}</Row>
	);
};
