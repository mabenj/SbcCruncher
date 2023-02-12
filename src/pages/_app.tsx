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

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}
