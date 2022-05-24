import ReactGA from "react-ga";

interface IAnalyticsEvent {
    action: string;
    details?: any;
}

if (navigator.userAgent !== "ReactSnap") {
    ReactGA.initialize(process.env.REACT_APP_GA || "");
}

export const useAnalytics = () => {
    const pageView = (path: string) => {
        if (navigator.userAgent === "ReactSnap") {
            return;
        }
        ReactGA.pageview(path);
    };
    const event = (event: IAnalyticsEvent) => {
        if (navigator.userAgent === "ReactSnap") {
            return;
        }
        const details = JSON.stringify(event.details);
        ReactGA.event({ category: event.action, action: details });
    };
    return { pageView, event };
};
