import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

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
            bg: mode("#F7FAFC", "#1A202C")(props)
        }
    })
};

export const theme = extendTheme({ config, colors, styles });
