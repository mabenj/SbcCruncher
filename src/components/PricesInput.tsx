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
import ReactGA from "react-ga";
import Collapse from "react-bootstrap/Collapse";
import Link from "./Link";
import Config from "../Config";
import Ring from "./Spinners/Ring";

interface IPricesInputProps {
	ratings: IRatingOption[];
	onChange: (priceInfo: IPriceInfo) => void;
}

export default function PricesInput({ ratings, onChange }: IPricesInputProps) {
	const [prices, setPrices] = useState<IPriceInfo>(
		getItemOrNull<IPriceInfo>(Config.priceDataStorageKey) || {}
	);
	const [isFetching, setIsFetching] = useState(false);
	const [fetchError, setFetchError] = useState("");

	useEffect(() => {
		if (prices) {
			setItem(Config.priceDataStorageKey, prices);
			onChange(prices);
		}
	}, [onChange, prices]);

	const handlePriceChange = (rating: number, newPrice: string) => {
		if (newPrice === "") {
			setPrices((prev) => {
				const clone = { ...prev };
				delete clone[rating];
				return clone;
			});
		} else {
			setPrices((prev) => ({ ...prev, [rating]: Number(newPrice) }));
		}
	};

	const handleFetchFutbin = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();
		setIsFetching(true);
		const [prices, errorMessage] = await fetchFutbinPrices();
		if (prices && !errorMessage) {
			setPrices(prices);
		}
		setFetchError(errorMessage);
		setIsFetching(false);
		ReactGA.event({
			category: "FUTBIN",
			action: "FUTBIN_FETCH",
			label: "FUTBIN"
		});
	}, []);

	return (
		<Form.Group>
			<Form.Label>Player Prices</Form.Label>
			<Row>
				{ratings.map((ratingOption) => (
					<Col key={ratingOption.ratingValue} lg={2} md={4} sm={6}>
						<InputGroup className="my-2">
							<InputGroup.Text>{ratingOption.label}</InputGroup.Text>
							<Form.Control
								type="number"
								placeholder=""
								value={prices[ratingOption.ratingValue]}
								onChange={(e) =>
									handlePriceChange(ratingOption.ratingValue, e.target.value)
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
						disabled={isFetching}
						title="Fetch from FUTBIN">
						{isFetching ? (
							<>
								<Ring />
								<span className="m-2">Fetching...</span>
							</>
						) : (
							<>
								<i className="fas fa-redo-alt"></i>
								&nbsp;Fetch&nbsp;from&nbsp;FUTBIN
							</>
						)}
					</Button>
					<Collapse in={!!fetchError}>
						<div>
							<Alert
								variant="danger"
								dismissible
								onClose={() => setFetchError("")}>
								Could not fetch price data from FUTBIN: {fetchError}
							</Alert>
						</div>
					</Collapse>
				</span>
			</div>
			<Form.Text muted>
				Fetching the prices from FUTBIN will scrape the price data from FUTBIN's{" "}
				<Link href="https://www.futbin.com/stc/cheapest">
					cheapest players by rating
				</Link>{" "}
				page. The price of the cheapest player of each rating will be used here.{" "}
				<br />
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
