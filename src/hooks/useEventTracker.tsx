import { useEffect, useState } from "react";
import type ReactGA from "react-ga";
import useDebounce from "./useDebounce";

const DEFAULT_DEBOUNCE_MS = 2000;

export const useEventTracker = (category: string, debounceMs?: number) => {
    const [event, setEvent] = useState<null | ReactGA.EventArgs>(null);
    const debouncedEvent = useDebounce(
        event,
        debounceMs ?? DEFAULT_DEBOUNCE_MS
    );

    useEffect(() => {
        if (!debouncedEvent) {
            return;
        }
        import("react-ga").then((ReactGA) => ReactGA.event(debouncedEvent));
    }, [debouncedEvent]);

    return (action: string, label: string | number, value?: number) => {
        setEvent({ category, action, label: label.toString(), value });
    };
};
