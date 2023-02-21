import "@/styles/globals.scss";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import Script from "next/script";
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
        <>
            <Script id="ezoicId">{`var ezoicId = 437895;`}</Script>
            <Script
                type="text/javascript"
                src="//go.ezoic.net/ezoic/ezoic.js"
                defer
            />
            <Script
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3653518580503209"
                defer
                crossOrigin="anonymous"
            />
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </>
    );
}
