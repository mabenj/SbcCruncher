import Config from "../Config";
import { IRatingOption } from "../interfaces";

export function range(start: number, stop: number, step: number): number[] {
	return Array.from(
		{ length: (stop - start) / step + 1 },
		(_, i) => start + i * step
	);
}

export function ratingRange(
	start: IRatingOption | undefined,
	stop: IRatingOption | undefined,
	step: number
): IRatingOption[] {
	if (!start || !stop) {
		return [];
	}
	return range(start.ratingValue, stop.ratingValue, step).map<IRatingOption>(
		(rating) => ({
			label: rating.toString(),
			ratingValue: rating,
			value: Math.random()
		})
	);
}

export function getMinRatingOption(ratings: IRatingOption[]): IRatingOption {
	return ratings.reduce((prev, curr) =>
		prev.ratingValue < curr.ratingValue ? prev : curr
	);
}

export function getMaxRatingOption(ratings: IRatingOption[]): IRatingOption {
	return ratings.reduce((prev, curr) =>
		prev.ratingValue > curr.ratingValue ? prev : curr
	);
}

export function isTargetRating(ratings: number[], target: number): boolean {
	const rating = getRating(ratings);
	return rating === target;
}

function getRating(ratings: number[]): number {
	const sum = ratings.reduce((acc, curr) => acc + curr, 0);
	const avg = sum / ratings.length;
	const excess = ratings.reduce((acc, curr) => {
		if (curr <= avg) {
			return acc;
		}
		return acc + curr - avg;
	}, 0);
	const rating = Math.round(sum + excess) / Config.playersInSquad;
	return Math.floor(rating);
}

export function calculatePrice(
	ratings: number[],
	pricesDictionary: { [rating: number]: number }
): number {
	let sum = 0;
	ratings.forEach((rating: number) => {
		sum += pricesDictionary[rating] || 0;
	});
	return sum;
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function serializeRatingOption(
	value: IRatingOption | undefined
): string {
	if (!value) {
		return "";
	}
	return value.ratingValue.toString();
}

export function deserializeRatingOption(
	str: string
): IRatingOption | undefined {
	if (!str) {
		return undefined;
	}
	const deserialized: IRatingOption = {
		label: str,
		ratingValue: Number(str),
		value: Math.random()
	};
	return (
		Config.ratingOptions.find(
			(rating) => rating.ratingValue === deserialized.ratingValue
		) && deserialized
	);
}

export function getNumberOfCombinationsWithRepetitions(n: number, k: number) {
	return factorial(n + k - 1) / (factorial(n - 1) * factorial(k));
}

export function factorial(num: number): number {
	var rval = 1;
	for (var i = 2; i <= num; i++) rval = rval * i;
	return rval;
}
