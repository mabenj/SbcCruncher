import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Header from "./components/Header";
import ExistingRatingsInput from "./components/ExistingRatingsInput";
import TargetRatingInput from "./components/TargetRatingInput";
import IRatingOption from "./interfaces/RatingOption.interface";
import { isTargetRating, range } from "./util/utils";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import RatingsRangeInput from "./components/RatingsRangeInput";
import ICombinationWorkResult from "./interfaces/CombinationWorkResult.interface";
import ICombinationWorkRequest from "./interfaces/CombinationWorkRequest.interface";

const PLAYERS_IN_SQUAD = 11;

const combinationsWorker: Worker = new Worker(
	"./workers/combinations.worker.js"
);

function App() {
	const [isFormValid /*, setIsFormValid*/] = useState<boolean | undefined>();
	const [isCalculating, setIsCalculating] = useState(false);

	const [targetRating, setTargetRating] = useState<IRatingOption>();
	const [existingRatings, setExistingRatings] = useState<IRatingOption[]>([]);
	const [ratingsToTry, setRatingsToTry] =
		useState<IRatingOption[]>(DEFAULT_RANGE);

	const [solutions, setSolutions] = useState<
		{ ratings: number[]; price: number }[]
	>([]);

	useEffect(() => {
		combinationsWorker.onmessage = (event) => {
			const data = event.data as ICombinationWorkResult;
			switch (data.status) {
				case "DONE":
					setIsCalculating(false);
					break;
				case "COMBINATION":
					const wholeSquad = [
						...existingRatings.map((rating) => rating.ratingValue),
						...data.combination
					];
					if (isTargetRating(wholeSquad, targetRating?.ratingValue || -1)) {
						setSolutions((prev) => [
							...prev,
							{ ratings: data.combination, price: -1 }
						]);
					}
					break;
				default:
					break;
			}
		};
		combinationsWorker.onerror = (error) => {
			console.error("ERROR", error);
			setIsCalculating(false);
		};
	}, [existingRatings, targetRating?.ratingValue]);

	const calculate = (e: React.FormEvent) => {
		e.preventDefault();
		setSolutions([]);
		setIsCalculating(true);
		const request: ICombinationWorkRequest = {
			ratings: ratingsToTry.map((rating) => rating.ratingValue),
			length: PLAYERS_IN_SQUAD - existingRatings.length
		};
		combinationsWorker.postMessage(request);
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

					<Button
						type="submit"
						variant="secondary"
						title="Calculate"
						disabled={!targetRating || isCalculating}>
						{isCalculating && (
							<Spinner
								as="span"
								animation="grow"
								size="sm"
								role="status"
								aria-hidden="true"
							/>
						)}
						{isCalculating ? " Calculating..." : "Calculate Ratings"}
					</Button>

					<Row className="my-5">
						<h3>
							Solutions{" "}
							{solutions.length > 0 && (
								<Badge bg="success">{solutions.length}</Badge>
							)}
						</h3>
						<small className="text-muted mb-4">
							These are the ratings of the players you need to aquire in order
							to achieve the target rating
							{targetRating && (
								<>
									{" "}
									of <strong>{targetRating.ratingValue}</strong>
								</>
							)}
						</small>

						{solutions.map((solution, index) => (
							<div key={index}>{solution.ratings.join(", ")}</div>
						))}
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
