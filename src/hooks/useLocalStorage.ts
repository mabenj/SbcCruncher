import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState(() => {
        const stored = getItemOrNull<T>(key);
        if (!stored) {
            return initialValue;
        }
        return stored;
    });

    useEffect(() => setItem(key, value), [key, value]);

    return [value, setValue] as const;
}

function getItemOrNull<T>(key: string): T | null {
    const stored = localStorage.getItem(key);
    try {
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

function setItem<T>(key: string, item: T): void {
    localStorage.setItem(key, JSON.stringify(item));
}
