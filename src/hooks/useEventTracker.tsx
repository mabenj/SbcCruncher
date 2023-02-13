import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import useDebounce from "./useDebounce";

const DEFAULT_DEBOUNCE_MS = 500;

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
        ReactGA.event(debouncedEvent);
    }, [debouncedEvent]);

    return (action: string, label?: string, value?: number) => {
        setEvent({ category, action, label, value });
    };
};
