import "@/styles/globals.scss";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import ReactGA from "react-ga";
import { theme } from "../theme";

if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ANALYTICS_ID
) {
    ReactGA.initialize(process.env.NEXT_PUBLIC_ANALYTICS_ID);
}

// get rid of service workers from previous versions
if (typeof window !== "undefined" && "navigator" in window) {
    navigator.serviceWorker.getRegistrations().then((registrations) =>
        registrations.forEach((r) => {
            r.unregister();
            ReactGA.event({
                category: "Service worker",
                action: "unregister"
            });
            console.log("Service worker unregistered");
        })
    );
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}
