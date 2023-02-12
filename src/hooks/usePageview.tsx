import ReactGA from "react-ga";

export const usePageview = () => {
    return (path: string) => {
        ReactGA.pageview(path);
    };
};
