import { range } from "./util/utils";

interface IConfig {
	readonly playersInSquad: number;
	readonly priceDataStorageKey: string;
	readonly maxAmountOfSolutions: number;
	readonly maxPriceFetchAttempts: number;
	readonly priceFetchCooldownMs: number;
	readonly allRatings: number[];
	readonly tryRatings: number[];
	readonly defaultTryMin: number;
	readonly defaultTryMax: number;
	readonly solverUpdateFrequencyMs: number;
	readonly scrollToTopThreshold: number;
	readonly darkThemeName: string;
	readonly lightThemeName: string;
	readonly isDarkThemeStorageKey: string;
}

const config: IConfig = {
	playersInSquad: 11,
	priceDataStorageKey: "SBC_CRUNCHER_PRICE_DATA",
	maxAmountOfSolutions: 40,
	maxPriceFetchAttempts: 10,
	priceFetchCooldownMs: 1000,
	allRatings: range(98, 47, -1),
	tryRatings: range(98, 70, -1),
	defaultTryMin: 81,
	defaultTryMax: 87,
	solverUpdateFrequencyMs: 300,
	scrollToTopThreshold: 1000,
	darkThemeName: "arya-blue",
	lightThemeName: "saga-blue",
	isDarkThemeStorageKey: "SBC_CRUNCHER_IS_DARK"
};

export default config;
