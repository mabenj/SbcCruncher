import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { Nunito } from "@next/font/google";

const nunito = Nunito({
    subsets: ["latin"]
});

const config: ThemeConfig = {
    initialColorMode: "system",
    useSystemColorMode: false
};

//https://smart-swatch.netlify.app/#007bff
const colors = {
    brand: {
        900: "#000d21",
        800: "#002551",
        700: "#003d82",
        600: "#0056b4",
        500: "#006fe6",
        400: "#1a88ff",
        300: "#4aa3ff",
        200: "#7dbdff",
        100: "#aed7ff",
        50: "#dcf3ff"
    }
};

const styles = {
    global: (props: any) => ({
        body: {
            bg: mode(
                "linear-gradient(-45deg, rgb(247, 247, 247) 50%, rgba(173, 215, 246, 0.2) 100%)",
                "linear-gradient(-30deg, #1A202C 50%, #242b38 100%)"
            )(props),
            backgroundAttachment: "fixed"
        }
    })
};

const fonts = {
    body: nunito.style.fontFamily,
    heading: nunito.style.fontFamily
};

export const theme = extendTheme({ config, colors, styles, fonts });

//linear-gradient(rgb(173, 215, 246) 0%, rgb(247, 247, 247) 100%)
//#F7FAFC
//#1A202C
