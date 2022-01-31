import { useState, useEffect } from "react";

const BREAKPOINT = 768;

const useIsMobile = () => {
	const [width, setWidth] = useState(window.innerWidth);

	function handleWindowSizeChange() {
		setWidth(window.innerWidth);
	}
	useEffect(() => {
		window.addEventListener("resize", handleWindowSizeChange);
		return () => {
			window.removeEventListener("resize", handleWindowSizeChange);
		};
	}, []);

	return [width <= BREAKPOINT];
};

export default useIsMobile;
