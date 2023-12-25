import "@/styles/globals.scss";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import Script from "next/script";
import { theme } from "../common/theme";

if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ANALYTICS_ID
) {
    import("react-ga").then((ReactGA) =>
        ReactGA.initialize(process.env.NEXT_PUBLIC_ANALYTICS_ID!)
    );
}

// get rid of service workers from previous versions
if (typeof window !== "undefined" && "navigator" in window) {
    navigator.serviceWorker.getRegistrations().then((registrations) =>
        registrations.forEach((r) => {
            r.unregister();
            console.log("Service worker unregistered");
            import("react-ga").then((ReactGA) =>
                ReactGA.event({
                    category: "Service worker",
                    action: "unregister"
                })
            );
        })
    );
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <ScriptHotjar />
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </>
    );
}

const ScriptHotjar = () => (
    <Script id="hotjar">{`
(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:3379793,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
`}</Script>
);
