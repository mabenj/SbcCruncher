import ReactGA from "react-ga";

export const useEventTracker = (category: string) => {
    return (action: string, label?: string, value?: number) => {
        console.log("EVENT: ", { category, action, label, value });
        ReactGA.event({ category, action, label, value });
    };
};
