import { Dispatch, SetStateAction, useEffect, useState } from "react";

type SetValue<T> = Dispatch<SetStateAction<T>>;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    useEffect(() => {
        if (typeof window === "undefined") {
            console.warn(
                `Tried reading localStorage key '${key}' even though environment is not a client`
            );
            return;
        }

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(parseJSON(item) as T);
            }
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setValue: SetValue<T> = (value) => {
        if (typeof window === "undefined") {
            console.warn(
                `Tried setting localStorage key '${key}' even though environment is not a client`
            );
            return;
        }

        try {
            const newValue =
                value instanceof Function ? value(storedValue) : value;
            window.localStorage.setItem(key, JSON.stringify(newValue));
            setStoredValue(newValue);
        } catch (error) {
            console.warn(`Error setting localStorage key '${key}':`, error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;

function parseJSON<T>(value: string | null): T | undefined {
    try {
        return value === "undefined" ? undefined : JSON.parse(value ?? "");
    } catch {
        console.log("parsing error on", { value });
        return undefined;
    }
}
