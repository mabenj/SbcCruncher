import "primeflex/primeflex.css";
import "primeicons/primeicons.css"; //icons
import "primereact/resources/primereact.min.css"; //core css
import React from "react";
import { hydrate, render } from "react-dom";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// import reportWebVitals from "./reportWebVitals";
import App from "./components/App";
import "./styles/styles.scss";

const rootElement = document.getElementById("root");
if (rootElement?.hasChildNodes()) {
    hydrate(<App />, rootElement);
} else {
    render(<App />, rootElement);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register({
// 	onUpdate: (registration) => {
// 		const waitingServiceWorker = registration.waiting;
// 		waitingServiceWorker?.postMessage({ type: "SKIP_WAITING" });
// 		const url = new URL(window.location.href);
// 		url.searchParams.set("update", "true");
// 		window.location.href = url.toString();
// 	}
// });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
