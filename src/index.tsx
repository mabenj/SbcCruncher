import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";

import "react-virtualized/styles.css";

import ReactGA from "react-ga";

ReactGA.initialize(process.env.REACT_APP_GA || "");

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
