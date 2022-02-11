import React, { useState, useEffect, useCallback, useRef } from "react";
import { IPriceInfo } from "../interfaces";
import { IRatingOption } from "../interfaces";
import { fetchFutbinPrices } from "../services/FutbinPrices.service";
import { setItem, getItemOrNull } from "../services/LocalStorage.service";
import ReactGA from "react-ga";
import { Link } from "./";
import Config from "../Config";
import Spinner from "./Spinner";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface IPricesInputProps {
	ratings: IRatingOption[];
	onChange: (priceInfo: IPriceInfo) => void;
}

export function PricesInput({ ratings, onChange }: IPricesInputProps) {
	const errorToast = useRef<Toast>(null);
	const [prices, setPrices] = useState<IPriceInfo>(
		getItemOrNull<IPriceInfo>(Config.priceDataStorageKey) || {}
	);
	const [isFetching, setIsFetching] = useState(false);

	useEffect(() => {
		if (prices) {
			setItem(Config.priceDataStorageKey, prices);
			onChange(prices);
		}
	}, [onChange, prices]);

	const handlePriceChange = (rating: number, newPrice: number | null) => {
		if (newPrice === null) {
			setPrices((prev) => {
				const clone = { ...prev };
				delete clone[rating];
				return clone;
			});
		} else {
			setPrices((prev) => ({ ...prev, [rating]: newPrice }));
		}
	};

	const handleFetchFutbin = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();
		setIsFetching(true);
		const [prices, errorMessage] = await fetchFutbinPrices();
		if (errorMessage && errorToast.current !== null) {
			errorToast.current.show({
				severity: "error",
				summary: "Could not fetch price data from FUTBIN",
				detail: errorMessage,
				life: 3000
			});
		}
		if (prices && !errorMessage) {
			setPrices(prices);
		}
		setIsFetching(false);
		ReactGA.event({
			category: "FUTBIN",
			action: "FUTBIN_FETCH",
			label: errorMessage ? `FUTBIN_ERROR=${errorMessage}` : "FUTBIN_SUCCESS"
		});
	}, []);

	return (
		<>
			<Toast ref={errorToast} />
			<div className="p-field">
				<label htmlFor="playerPrices">Player Prices</label>
				<div id="playerPrices" className="p-grid">
					{ratings.map((ratingOption) => (
						<div
							key={ratingOption.ratingValue}
							className="p-col-12 p-lg-2 p-md-4 p-sm-6">
							<div className="p-inputgroup">
								<span className="p-inputgroup-addon">{ratingOption.label}</span>
								<InputNumber
									placeholder=""
									value={prices[ratingOption.ratingValue]}
									onChange={(e) =>
										handlePriceChange(ratingOption.ratingValue, e.value)
									}
									showButtons
									min={0}
									step={1000}
								/>
							</div>
						</div>
					))}
					<small>Specify the price for each rating</small>
				</div>
			</div>

			<div>
				<span>
					<Button
						label={isFetching ? "Fetching..." : "Fetch from FUTBIN"}
						className="p-mt-5 p-mb-2 p-button-secondary p-button-raised"
						onClick={handleFetchFutbin}
						disabled={isFetching}
						title="Fetch from FUTBIN">
						{isFetching ? (
							<>
								<Spinner.Ring />
								&nbsp;
							</>
						) : (
							<>
								<i className="fas fa-redo-alt"></i>&nbsp;
							</>
						)}
					</Button>
				</span>
			</div>
			<small>
				Fetching the prices from FUTBIN will scrape the price data from FUTBIN's{" "}
				<Link href="https://www.futbin.com/stc/cheapest">
					cheapest players by rating
				</Link>{" "}
				page. The price of the cheapest player of each rating will be used here.{" "}
				<br />
				<br />
			</small>
			<small>
				<strong>
					Note! Only the prices for ratings 81 - 98 are available from FUTBIN.
				</strong>
			</small>
		</>
	);
}
