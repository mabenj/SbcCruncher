import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HtmlHead from "@/components/layout/HtmlHead";
import Main from "@/components/layout/Main";
import AnimatedBg from "@/components/ui/AnimatedBg";
import { ConfigProvider } from "@/context/ConfigContext";
import { usePageview } from "@/hooks/usePageview";
import { Container } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Home() {
    const pageview = usePageview();

    useEffect(
        () => pageview(window.location.pathname + window.location.search),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <ConfigProvider>
            <HtmlHead
                title="SBC Cruncher - EA Sports FC Ultimate Team SBC Rating Calculator"
                description="SBC Cruncher calculates the cheapest player rating combinations for EA Sports FC 24 Ultimate Team SBCs based on FUTBIN and FUTWIZ price data"
            />
            <AnimatedBg />
            <Container maxW="4xl">
                <header>
                    <Header />
                </header>
                <main>
                    <Main />
                </main>
                <footer>
                    <Footer />
                </footer>
            </Container>
        </ConfigProvider>
    );
}
