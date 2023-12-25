import { ColorModeScript } from "@chakra-ui/react";
import { Head, Html, Main, NextScript } from "next/document";
import { theme } from "../common/theme";

// Translations disabled because of this: https://github.com/facebook/react/issues/13278

export default function Document() {
    return (
        <Html lang="en" translate="no">
            <Head />
            <body className="notranslate">
                <ColorModeScript
                    initialColorMode={theme.config.initialColorMode}
                />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
