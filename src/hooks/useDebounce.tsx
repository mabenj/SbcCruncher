import { useEffect, useState } from "react";

const DEFAULT_DELAY_MS = 500;

function useDebounce<T>(value: T, delayMs?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(
            () => setDebouncedValue(value),
            delayMs || DEFAULT_DELAY_MS
        );

        return () => {
            clearTimeout(timer);
        };
    }, [value, delayMs]);

    return debouncedValue;
}

export default useDebounce;
