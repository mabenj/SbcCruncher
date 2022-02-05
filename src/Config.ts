import IRatingOption from "./interfaces/RatingOption.interface";
import { range } from "./util/utils";

const possibleRatings = range(70, 98, 1);
const possibleRatingOptions: IRatingOption[] = possibleRatings.map(
	(rating) => ({
		value: Math.random(),
		label: rating.toString(),
		ratingValue: rating
	})
);

interface IConfig {
	readonly playersInSquad: number;
	readonly priceDataStorageKey: string;
	readonly maxAmountOfSolutions: number;
	readonly maxPriceFetchAttempts: number;
	readonly priceFetchCooldownMs: number;
	readonly ratingOptions: IRatingOption[];
	readonly defaultTryMin: IRatingOption;
	readonly defaultTryMax: IRatingOption;
	readonly solverUpdateFrequencyMs: number;
}

const config: IConfig = {
	playersInSquad: 11,
	priceDataStorageKey: "SBC_SOLVER_PRICE_DATA",
	maxAmountOfSolutions: 40,
	maxPriceFetchAttempts: 5,
	priceFetchCooldownMs: 1000,
	ratingOptions: possibleRatingOptions,
	defaultTryMin: {
		value: Math.random(),
		label: "81",
		ratingValue: 81
	},
	defaultTryMax: {
		value: Math.random(),
		label: "86",
		ratingValue: 86
	},
	solverUpdateFrequencyMs: 300
};

export default config;
