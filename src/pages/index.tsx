import Calculator from "@/components/calculator/Calculator";
import Page from "@/components/layout/Page";
import { ConfigProvider } from "@/context/ConfigContext";

export default function Home() {
    return (
        <Page
            head={{
                title: "SBC Cruncher - EA Sports FC Ultimate Team SBC Rating Calculator",
                description:
                    "SBC Cruncher calculates the cheapest player rating combinations for EA Sports FC 24 Ultimate Team SBCs based on FUTBIN and FUTWIZ price data"
            }}
            showHelpBtn>
            <ConfigProvider>
                <Calculator />
            </ConfigProvider>
        </Page>
    );
}
