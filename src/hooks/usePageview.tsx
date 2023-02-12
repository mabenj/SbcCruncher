import ReactGA from "react-ga";

export const usePageview = () => {
    return (path: string) => {
        console.log("PAGEVIEW: ", path);
        ReactGA.pageview(path);
    };
};
