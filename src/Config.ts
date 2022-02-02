import IRatingOption from "./interfaces/RatingOption.interface";
import { range } from "./util/utils";

const possibleRatings = range(75, 99, 1);
const possibleRatingOptions: IRatingOption[] = possibleRatings.map(
	(rating) => ({
		value: Math.random(),
		label: rating.toString(),
		ratingValue: rating
	})
);

const defaultRange = range(82, 85, 1);
const defaultRangeOptions: IRatingOption[] = defaultRange.map((rating) => ({
	value: Math.random(),
	label: rating.toString(),
	ratingValue: rating
}));

interface IConfig {
	readonly playersInSquad: number;
	readonly priceDataStorageKey: string;
	readonly maxAmountOfSolutions: number;
	readonly maxPriceFetchAttempts: number;
	readonly priceFetchCooldownMs: number;
	readonly solverResultChunkSize: number;
	readonly ratingOptions: IRatingOption[];
	readonly defaultTryRange: IRatingOption[];
}

const config: IConfig = {
	playersInSquad: 11,
	priceDataStorageKey: "SBC_SOLVER_PRICE_DATA",
	maxAmountOfSolutions: 200,
	maxPriceFetchAttempts: 5,
	priceFetchCooldownMs: 1000,
	solverResultChunkSize: 54,
	ratingOptions: possibleRatingOptions,
	defaultTryRange: defaultRangeOptions
};

export default config;
