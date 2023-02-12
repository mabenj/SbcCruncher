import { SQUAD_SIZE } from "./constants";

const FORMATTER = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto"
});

const DIVISIONS = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" }
];

export function timeAgo(date: Date) {
    if (!date) {
        return undefined;
    }
    let duration = (date.getTime() - new Date().getTime()) / 1000;

    for (let i = 0; i < DIVISIONS.length; i++) {
        const division = DIVISIONS[i];
        if (Math.abs(duration) < division.amount) {
            return FORMATTER.format(
                Math.round(duration),
                division.name as Intl.RelativeTimeFormatUnit
            );
        }
        duration /= division.amount;
    }
}

export function range(start: number, stop: number, step: number = 1): number[] {
    return Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
    );
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
}

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getNumberOfCombinationsWithRepetitions(n: number, k: number) {
    return factorial(n + k - 1) / (factorial(n - 1) * factorial(k));
}

export function factorial(num: number): number {
    let rval = 1;
    for (let i = 2; i <= num; i++) rval = rval * i;
    return rval;
}

export function getRating(ratings: number[]): number {
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / ratings.length;
    const excess = ratings.reduce((acc, curr) => {
        if (curr <= avg) {
            return acc;
        }
        return acc + curr - avg;
    }, 0);
    const rating = Math.round(sum + excess) / SQUAD_SIZE;
    return Math.floor(rating);
}

export function calculatePrice(ratings: number[], priceByRating: Record<number, number>){
    return ratings.reduce((acc, curr) => acc + (priceByRating[curr] || 0), 0)
}
