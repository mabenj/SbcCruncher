import IRatingOption from "../interfaces/RatingOption.interface";

export function range(start: number, stop: number, step: number): number[] {
	return Array.from(
		{ length: (stop - start) / step + 1 },
		(_, i) => start + i * step
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
	const rating = Math.round(sum + excess) / 11;
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
