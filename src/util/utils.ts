import Config from "../Config";

export function range(start: number, stop: number, step: number): number[] {
	return Array.from(
		{ length: (stop - start) / step + 1 },
		(_, i) => start + i * step
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

export function serializeRatingOption(value: number | undefined): string {
	if (!value) {
		return "";
	}
	return value.toString();
}

export function deserializeRatingOption(str: string): number | undefined {
	if (!str) {
		return undefined;
	}
	const deserialized = Number(str);
	return Config.allRatings.find((opt) => opt === deserialized) && deserialized;
}

export function getNumberOfCombinationsWithRepetitions(n: number, k: number) {
	return factorial(n + k - 1) / (factorial(n - 1) * factorial(k));
}

export function factorial(num: number): number {
	var rval = 1;
	for (var i = 2; i <= num; i++) rval = rval * i;
	return rval;
}
