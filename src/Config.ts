import { range } from "./util/utils";

interface IConfig {
    readonly playersInSquad: number;
    readonly maxExistingRatings: number;
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
    readonly pricesLastUpdatedStorageKey: string;
    readonly tryRangeWarningThreshold: number;
    readonly oldPricesWarningThreshold: number;
    readonly shouldMergeOldPrices: boolean;
    readonly analyticsDebounceMs: number;
}

const config: IConfig = {
    playersInSquad: 11,
    maxExistingRatings: 11 - 1,
    priceDataStorageKey: "SBC_CRUNCHER_PRICE_DATA",
    maxAmountOfSolutions: 40,
    maxPriceFetchAttempts: 10,
    priceFetchCooldownMs: 1000,
    allRatings: range(99, 47, -1),
    tryRatings: range(99, 70, -1),
    defaultTryMin: 81,
    defaultTryMax: 91,
    solverUpdateFrequencyMs: 300,
    scrollToTopThreshold: 500,
    darkThemeName: "vela-blue",
    lightThemeName: "saga-blue",
    isDarkThemeStorageKey: "SBC_CRUNCHER_IS_DARK",
    pricesLastUpdatedStorageKey: "SBC_CRUNCHER_PRICES_UPDATED_AT",
    tryRangeWarningThreshold: 15,
    oldPricesWarningThreshold: 1,
    shouldMergeOldPrices: true,
    analyticsDebounceMs: 1000
};

export default config;
