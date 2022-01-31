import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "./components/Header";
import ExistingRatingsInput from "./components/ExistingRatingsInput";
import TargetRatingInput from "./components/TargetRatingInput";
import IRatingOption from "./interfaces/RatingOption.interface";
import { isTargetRating, range } from "./util/utils";
import Form from "react-bootstrap/Form";
import RatingsRangeInput from "./components/RatingsRangeInput";
import ICombinationWorkResult from "./interfaces/CombinationWorkResult.interface";
import ICombinationWorkRequest from "./interfaces/CombinationWorkRequest.interface";
import Solutions from "./components/Solutions";
import ISolution from "./interfaces/Solution.interface";
import CalculationButtons from "./components/CalculationButtons";
/* eslint-disable import/no-webpack-loader-syntax */
import Solver from "worker-loader!./workers/Solver.worker.ts";

const PLAYERS_IN_SQUAD = 11;

function App() {
	const [solver, setSolver] = useState(new Solver());

	const [isFormValid /*, setIsFormValid*/] = useState<boolean | undefined>();
	const [isCalculating, setIsCalculating] = useState(false);

	const [targetRating, setTargetRating] = useState<IRatingOption>();
	const [existingRatings, setExistingRatings] = useState<IRatingOption[]>([]);
	const [ratingsToTry, setRatingsToTry] =
		useState<IRatingOption[]>(DEFAULT_RANGE);

	const [solutions, setSolutions] = useState<ISolution[] | null>(null);

	useEffect(() => {
		setSolutions(null);
	}, [targetRating, existingRatings, ratingsToTry]);

	useEffect(() => {
		// combinationsWorker.onmessage = (event) => {
		// 	const data = event.data as ICombinationWorkResult;
		// 	switch (data.status) {
		// 		case "DONE":
		// 			setIsCalculating(false);
		// 			break;
		// 		case "COMBINATION":
		// 			const wholeSquad = [
		// 				...existingRatings.map((rating) => rating.ratingValue),
		// 				...data.combination
		// 			];
		// 			if (isTargetRating(wholeSquad, targetRating?.ratingValue || -1)) {
		// 				setSolutions((prev) => [
		// 					...(prev || []),
		// 					{ ratings: data.combination, price: 0 }
		// 				]);
		// 			}
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// };
		solver.onmessage = (message) => {
			console.log(message);
		};
		solver.onerror = (error) => {
			console.error("ERROR", error);
			setIsCalculating(false);
		};
	}, [solver, existingRatings, targetRating?.ratingValue]);

	const calculate = (e: React.FormEvent) => {
		e.preventDefault();
		setSolutions([]);
		setIsCalculating(true);
		const request: ICombinationWorkRequest = {
			ratings: ratingsToTry.map((rating) => rating.ratingValue),
			length: PLAYERS_IN_SQUAD - existingRatings.length
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
					<Row className="g-5 my-5">
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
					</Row>

					<Row className="my-5">
						<RatingsRangeInput
							ratingOptions={POSSIBLE_RATINGS}
							onChange={setRatingsToTry}
							defaultRange={DEFAULT_RANGE}
						/>
					</Row>

					<CalculationButtons
						disabled={!targetRating || isCalculating}
						isCalculating={isCalculating}
						onStopPressed={() => {
							setSolver((prev) => {
								prev.terminate();
								return new Solver();
							});
							setIsCalculating(false);
						}}
					/>

					<Row className="my-5">
						<Solutions
							solutions={solutions}
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
