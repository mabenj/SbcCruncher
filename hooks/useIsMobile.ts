import { useEffect, useState } from "react";

const BREAKPOINT = 1000;

export const useIsMobile = () => {
    const [width, setWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : -1
    );

    useEffect(() => {
        function handleWindowSizeChange() {
            setWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    return width <= BREAKPOINT;
};
