const FORMATTER = new Intl.RelativeTimeFormat("en", {
    localeMatcher: "best fit",
    numeric: "auto",
    style: "long"
});

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

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
    if (error instanceof Error || error instanceof ErrorEvent)
        return error.message;
    const str = String(error);
    return str === "Undefined" ? undefined : str;
}

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function capitalize(text: string) {
    return text.at(0)?.toUpperCase() + text.slice(1);
}

export function prettyNumber(number: number | undefined) {
    if (typeof number === "undefined") {
        return "";
    }
    return NUMBER_FORMATTER.format(number);
}
