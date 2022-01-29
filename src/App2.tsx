import React, { useState } from "react";
import axios from "axios";

const FUTBIN_URL = "https://www.futbin.com/stc/cheapest";

type PlayerRating =
	| "81"
	| "82"
	| "83"
	| "84"
	| "85"
	| "86"
	| "87"
	| "88"
	| "89"
	| "90"
	| "91"
	| "92"
	| "93"
	| "94"
	| "95"
	| "96"
	| "97"
	| "98";

function App() {
	const [playerPrices, setPlayerPrices] = useState<
		Record<PlayerRating, number[]>
	>({} as Record<PlayerRating, number[]>);
	const [priceFetchError, setPriceFetchError] = useState("");

	const fetchPlayerPrices = async (e: React.MouseEvent) => {
		e.preventDefault();
		setPlayerPrices({} as Record<PlayerRating, number[]>);
		setPriceFetchError("");
		try {
			const html = (await axios.get<string>(FUTBIN_URL)).data;
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, "text/html");

			const ratingGroups = doc.querySelectorAll(".top-stc-players-col");

			const resultPrices: Record<PlayerRating, number[]> = {} as Record<
				PlayerRating,
				number[]
			>;

			for (let i = 0; i < ratingGroups.length; i++) {
				const rating = ratingGroups[i]
					.querySelector(".top-players-stc-title>span>span")
					?.innerHTML.trim();
				const playerPrices: number[] = Array.from(
					ratingGroups[i].querySelectorAll(".price-holder-row>span")
				).map((span) => parsePrice(span.textContent?.trim()));

				if (rating) {
					resultPrices[rating as PlayerRating] = playerPrices;
				}
			}

			setPlayerPrices(resultPrices);
			console.log(resultPrices);
		} catch (error: unknown) {
			console.warn("Could not fetch player prices: ", error);
			if (typeof error === "string") {
				setPriceFetchError(error);
			} else if (error instanceof Error) {
				setPriceFetchError(error.message);
			} else {
				setPriceFetchError("Unknown error");
			}
		}
	};

	return (
		<div className="App">
			<header className="App-header">
				<h1>FIFA Ultimate Team SBC Rating Solver</h1>
				<div>
					{(Object.keys(playerPrices) as Array<PlayerRating>).map((rating) => (
						<div key={rating}>
							Avg. of cheapest <strong>{rating}</strong> rated players:{" "}
							{Math.floor(
								playerPrices[rating].reduce(
									(prev, current) => prev + current,
									0
								) / playerPrices[rating].length
							)}
						</div>
					))}
				</div>
				<div>{priceFetchError}</div>
				<button onClick={fetchPlayerPrices}>Fetch prices</button>
			</header>
		</div>
	);
}

export default App;

const parsePrice = (text: string | undefined): number => {
	if (!text) return 0;
	const isThousand = text.endsWith("K");
	const isMillion = text.endsWith("M");
	const num = parseFloat(text);
	return isThousand ? 1000 * num : isMillion ? 1000000 * num : num;
};
