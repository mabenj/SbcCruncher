import React, { useState, useEffect, useCallback } from "react";
import IPriceInfo from "../interfaces/PriceInfo.interface";
import IRatingOption from "../interfaces/RatingOption.interface";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { fetchFutbinPrices } from "../services/FutbinPrices.service";
import { setItem, getItemOrNull } from "../services/LocalStorage.service";

const PRICE_DATA_KEY = "SBC_SOLVER_PRICE_DATA";

interface IPricesInputProps {
	ratings: IRatingOption[];
	onChange: (priceInfo: IPriceInfo) => void;
}

export default function PricesInput({ ratings, onChange }: IPricesInputProps) {
	const [prices, setPrices] = useState<IPriceInfo>(
		getItemOrNull<IPriceInfo>(PRICE_DATA_KEY) || {}
	);
	const [isFetching, setIsFetching] = useState(false);
	const [fetchError, setFetchError] = useState("");

	useEffect(() => {
		if (prices) {
			setItem(PRICE_DATA_KEY, prices);
			onChange(prices);
		}
	}, [onChange, prices]);

	const handlePriceChange = (rating: number, newPrice: number) => {
		setPrices((prev) => ({ ...prev, [rating]: newPrice }));
	};

	const handleFetchFutbin = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();
		setIsFetching(true);
		const [prices, errorMessage] = await fetchFutbinPrices();
		if (prices) {
			setPrices(prices);
		}
		setFetchError(errorMessage);
		setIsFetching(false);
	}, []);

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
								min={0}
								step={1000}
							/>
						</InputGroup>
					</Col>
				))}
				<Form.Text muted>Specify the price for each rating</Form.Text>
			</Row>

			<div>
				<span>
					<Button
						variant="dark"
						className="mt-5 mb-2"
						onClick={handleFetchFutbin}
						disabled={isFetching}>
						{isFetching ? (
							<>
								<div className="lds-ring">
									<div></div>
									<div></div>
									<div></div>
									<div></div>
								</div>
								<span className="m-2">Fetching...</span>
							</>
						) : (
							<>
								<i className="fas fa-redo-alt"></i> Fetch from FUTBIN.com
							</>
						)}
					</Button>
					{fetchError && (
						<Alert variant="danger" dismissible>
							Could not fetch price data from FUTBIN: {fetchError}
						</Alert>
					)}
				</span>
			</div>
			<Form.Text muted>
				Fetching the prices from FUTBIN will scrape the price data from FUTBIN's{" "}
				<a href="https://www.futbin.com/stc/cheapest">
					cheapest players by rating
				</a>{" "}
				page. The price of the cheapest player of each rating will be used.{" "}
				<br />
			</Form.Text>
			<Form.Text muted>
				<strong>
					Note! Only the prices for ratings 81 - 98 are available from FUTBIN.
				</strong>
			</Form.Text>
		</Form.Group>
	);
}
