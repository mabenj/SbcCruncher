import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "./components/Header";
import ExistingRatingsInput from "./components/ExistingRatingsInput";
import TargetRatingInput from "./components/TargetRatingInput";
import IRatingOption from "./interfaces/RatingOption.interface";
import { calculatePrice, range } from "./util/utils";
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

const PLAYERS_IN_SQUAD = 11;

function App() {
	const [solver, setSolver] = useState(new Solver());

	const [isFormValid /*, setIsFormValid*/] = useState<boolean | undefined>();
	const [isCalculating, setIsCalculating] = useState(false);

	const [targetRating, setTargetRating] = useState<IRatingOption>();
	const [existingRatings, setExistingRatings] = useState<IRatingOption[]>([]);
	const [ratingsToTry, setRatingsToTry] =
		useState<IRatingOption[]>(DEFAULT_RANGE);

	const [prices, setPrices] = useState<IPriceInfo>({});
	const [solutions, setSolutions] = useState<ISolution[] | null>(null);

	useEffect(() => {
		setSolutions(null);
	}, [targetRating, existingRatings, ratingsToTry]);

	useEffect(() => {
		solver.onmessage = (message) => {
			const result = message.data as ISolverWorkResult;
			switch (result.status) {
				case "DONE": {
					setIsCalculating(false);
					break;
				}
				case "COMBINATION": {
					setSolutions((prev) => [
						...(prev || []),
						...result.resultChunk.map((ratings) => ({
							id: Math.random(),
							ratings: ratings,
							price: calculatePrice(ratings, prices)
						}))
					]);
					break;
				}
				default: {
					break;
				}
			}
		};
		solver.onerror = (error) => {
			console.error("ERROR", error);
			setIsCalculating(false);
		};
	}, [solver, existingRatings, targetRating?.ratingValue, prices]);

	const calculate = (e: React.FormEvent) => {
		e.preventDefault();
		setSolutions([]);
		setIsCalculating(true);
		const request: ISolverWorkRequest = {
			ratingsToTry: ratingsToTry.map((rating) => rating.ratingValue),
			existingRatings: existingRatings.map((rating) => rating.ratingValue),
			length: PLAYERS_IN_SQUAD - existingRatings.length,
			targetRating: targetRating?.ratingValue || -1
		};
		solver.postMessage(request);
	};

	return (
		<main>
			<Container fluid="md">
				<Row className="my-4">
					<Header />
				</Row>

				<Form noValidate validated={isFormValid} onSubmit={calculate}>
					<FormRowWrapper>
						<Col lg={3}>
							<TargetRatingInput
								ratingOptions={POSSIBLE_RATINGS}
								onChange={setTargetRating}
							/>
						</Col>
						<Col>
							<ExistingRatingsInput
								ratingOptions={POSSIBLE_RATINGS}
								onChange={setExistingRatings}
							/>
						</Col>
					</FormRowWrapper>

					<FormRowWrapper>
						<RatingsRangeInput
							ratingOptions={POSSIBLE_RATINGS}
							onChange={setRatingsToTry}
							defaultRange={DEFAULT_RANGE}
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
							solutions={solutions?.sort((a, b) => a.price - b.price) || null}
							targetRating={targetRating?.ratingValue}
							columnDefinitions={ratingsToTry.map((rating) => ({
								label: rating.label,
								rating: rating.ratingValue
							}))}
						/>
					</Row>
				</Form>
			</Container>
		</main>
	);
}

export default App;

const FormRowWrapper = ({ children }: { children: React.ReactNode }) => {
	return <Row className="my-5 bg-light border rounded p-4">{children}</Row>;
};

const POSSIBLE_RATINGS: IRatingOption[] = range(99, 75, -1).map((rating) => ({
	value: Math.random(),
	label: rating.toString(),
	ratingValue: rating
}));

const DEFAULT_RANGE: IRatingOption[] = range(82, 85, 1).map((rating) => ({
	value: Math.random(),
	label: rating.toString(),
	ratingValue: rating
}));

// const PRICES: IPriceInfo = {
// 	81: 600,
// 	82: 800,
// 	83: 950,
// 	84: 3500,
// 	85: 9100,
// 	86: 16000,
// 	87: 23250,
// 	88: 30000,
// 	89: 39250,
// 	90: 48000,
// 	91: 61000,
// 	92: 67000,
// 	93: 91000,
// 	94: 690000,
// 	95: 1540000,
// 	96: 231000,
// 	97: 870000,
// 	98: 936000
// };
