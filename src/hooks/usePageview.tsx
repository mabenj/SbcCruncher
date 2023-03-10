export const usePageview = () => {
    return (path: string) => {
        import("react-ga").then((ReactGA) => ReactGA.pageview(path));
    };
};
