import React, { useState, useEffect } from "react";
import IPriceInfo from "../interfaces/PriceInfo.interface";
import IRatingOption from "../interfaces/RatingOption.interface";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

interface IPricesInputProps {
	ratings: IRatingOption[];
	onChange: (priceInfo: IPriceInfo) => void;
}

export default function PricesInput({ ratings, onChange }: IPricesInputProps) {
	const [prices, setPrices] = useState<IPriceInfo>();

	useEffect(() => {
		if (prices) {
			onChange(prices);
		}
	}, [onChange, prices]);

	const handlePriceChange = (rating: number, newPrice: number) => {
		setPrices((prev) => ({ ...prev, [rating]: newPrice }));
	};

	return (
		<Form.Group>
			<Form.Label>Player Prices</Form.Label>
			<Row>
				{ratings.map((ratingOption) => (
					<Col key={ratingOption.value} lg={2} md={4} sm={6}>
						<InputGroup className="my-2">
							<InputGroup.Text>{ratingOption.label}</InputGroup.Text>
							<Form.Control
								type="number"
								placeholder=""
								value={prices && prices[ratingOption.ratingValue]}
								onChange={(e) =>
									handlePriceChange(
										ratingOption.ratingValue,
										Number(e.target.value)
									)
								}
								step={1000}
							/>
						</InputGroup>
					</Col>
				))}
			</Row>
			<Form.Text muted>Specify the price for each rating</Form.Text>
		</Form.Group>
	);
}
