import { SQUAD_SIZE } from "@/constants";

export class SolverHelper {
    static getMultisubsetsCount(setLength: number, n: number) {
        return (
            this.factorial(setLength + n - 1) /
            (this.factorial(setLength - 1) * this.factorial(n))
        );
    }

    static factorial(num: number) {
        let rval = 1;
        for (let i = 2; i <= num; i++) {
            rval = rval * i;
        }
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

    static getPrice(ratings: number[], priceByRating: Record<number, number>) {
        return ratings.reduce(
            (acc, curr) => acc + (priceByRating[curr] || 0),
            0
        );
    }

    /**
     * Calculates all the multisubsets of length n of a set
     * @param set set
     * @param n multisubset length
     * @returns Iterable of multisubsets
     */
    static getMultisubsets<T>(set: Array<T>, n: number) {
        return multisubsetsImpl(set, n);
    }
}

function* multisubsetsImpl<T>(set: Array<T>, n: number): Iterable<Array<T>> {
    if (n === 0) {
        yield [];
    } else if (set.length > 0) {
        const [x, rest] = [set[0], set.slice(1)];
        for (let i = 0; i < n; i++) {
            yield* prependNTimes(x, multisubsetsImpl(rest, i), n - i);
        }
        yield* multisubsetsImpl(rest, n);
    }
}

function* prependNTimes<T>(a: T, xss: Iterable<Array<T>>, n: number) {
    const as = Array.from<T>({ length: n }).fill(a);
    for (let xs of xss) {
        yield [...as, ...xs];
    }
}
