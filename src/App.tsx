import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "./components/Header";
import ExistingRatingsInput from "./components/ExistingRatingsInput";
import TargetRatingInput from "./components/TargetRatingInput";
import IRatingOption from "./interfaces/RatingOption.interface";
import { range } from "./utils";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import RatingsRangeInput from "./components/RatingsRangeInput";

function App() {
	const [isFormValid, setIsFormValid] = useState(true);
	const [targetRating, setTargetRating] = useState<IRatingOption>();
	const [existingRatings, setExistingRatings] = useState<IRatingOption[]>([]);
	const [ratingsToTry, setRatingsToTry] =
		useState<IRatingOption[]>(DEFAULT_RANGE);

	const calculate = () => {};

	return (
		<main>
			<Container fluid="md">
				<Row className="my-4">
					<Header />
				</Row>

				<Form noValidate validated={isFormValid} onSubmit={calculate}>
					<Row className="g-5 my-5">
						<Col md={3}>
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
						{ratingsToTry.map((r) => r.ratingValue + ", ")}
						<RatingsRangeInput
							ratingOptions={POSSIBLE_RATINGS}
							onChange={setRatingsToTry}
							defaultRange={DEFAULT_RANGE}
						/>
					</Row>

					<Button
						type="submit"
						disabled={!targetRating || existingRatings.length < 2}>
						Calculate Ratings
					</Button>
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

const DEFAULT_RANGE: IRatingOption[] = [
	{
		label: "82",
		ratingValue: 82,
		value: Math.random()
	},
	{
		label: "85",
		ratingValue: 85,
		value: Math.random()
	}
];
