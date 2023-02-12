import { SQUAD_SIZE } from "@/constants";
import { multisets } from "combinatorics";

export class SolverHelper {
    static getNumberOfCombinationsWithRepetitions(n: number, k: number) {
        return (
            this.factorial(n + k - 1) /
            (this.factorial(n - 1) * this.factorial(k))
        );
    }

    static factorial(num: number) {
        let rval = 1;
        for (let i = 2; i <= num; i++) rval = rval * i;
        return rval;
    }

    // https://www.reddit.com/r/FIFA/comments/5osq7k/new_overall_rating_figured_out/
    static getRating(ratings: number[]) {
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

    static calculatePrice(
        ratings: number[],
        priceByRating: Record<number, number>
    ) {
        return ratings.reduce(
            (acc, curr) => acc + (priceByRating[curr] || 0),
            0
        );
    }

    static multisets(set: number[], k: number) {
        return multisets(set, k);
    }
}
