import ReactGA from "react-ga";

interface IAnalyticsEvent {
    category: string;
    action: string;
    details?: any;
    value?: number;
}

if (navigator.userAgent !== "ReactSnap") {
    ReactGA.initialize(process.env.REACT_APP_GA || "");
}

export const useAnalytics = () => {
    const pageView = (path: string) => {
        console.log({ path });
        if (navigator.userAgent === "ReactSnap") {
            return;
        }
        ReactGA.pageview(path);
    };
    const event = (event: IAnalyticsEvent) => {
        console.log({ event });
        if (navigator.userAgent === "ReactSnap") {
            return;
        }
        const details = JSON.stringify(event.details);
        ReactGA.event({
            category: event.category,
            action: event.action,
            label: details,
            value: event.value
        });
    };
    return { pageView, event };
};
