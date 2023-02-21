import { ColorModeScript } from "@chakra-ui/react";
import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";
import { theme } from "../theme";

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <ColorModeScript
                    initialColorMode={theme.config.initialColorMode}
                />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
