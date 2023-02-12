import ReactGA from "react-ga";

export const useEventTracker = (category: string) => {
    return (action: string, label?: string, value?: number) => {
        ReactGA.event({ category, action, label, value });
    };
};
