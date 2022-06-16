import ReactGA from "react-ga";
import SEO from "../config/SEO";

interface IAnalyticsEvent {
    category: string;
    action: string;
    details?: any;
    value?: number;
}

ReactGA.initialize(SEO.trackingCodeGA);

export const useAnalytics = () => {
    const pageView = (path: string) => {
        ReactGA.pageview(path);
    };
    const event = (event: IAnalyticsEvent) => {
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
