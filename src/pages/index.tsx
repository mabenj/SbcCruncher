import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Main from "@/components/layout/Main";
import { usePageview } from "@/hooks/usePageview";
import { Container } from "@chakra-ui/react";
import { Nunito } from "@next/font/google";
import Head from "next/head";
import { useEffect } from "react";

const font = Nunito({
    subsets: ["latin"]
});

export default function Home() {
    const pageview = usePageview();

    useEffect(
        () => pageview(window.location.pathname + window.location.search),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <>
            <HtmlHead />
            <Container maxW="4xl" className={font.className}>
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
        </>
    );
}

const HtmlHead = () => (
    <Head>
        <title>SBC Cruncher - FIFA Ultimate Team SBC Rating Calculator</title>
        <meta
            name="description"
            content="SBC Cruncher calculates the cheapest player rating combinations for FIFA Ultimate Team SBCs based on FUTBIN price data"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="manifest.json" />

        <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_SITE_VERIFICATION}
        />

        {/* <!-- OG tags --> */}
        <meta
            property="og:title"
            content="SBC Cruncher - FIFA Ultimate Team SBC Rating Calculator"
        />
        <meta
            property="og:description"
            content="Calculate the cheapest player rating combinations for FIFA Ultimate Team SBCs based on FUTBIN price data"
        />
        <meta property="og:site_name" content="SBC Cruncher" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sbccruncher.cc" />
        {/* 200x200px - 1200x1200px */}
        <meta property="og:image" content="https://i.imgur.com/pHxDN7k.png" />
    </Head>
);
