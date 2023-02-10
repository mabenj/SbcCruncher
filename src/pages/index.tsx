import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import Main from "@/components/ui/Main";
import { Container } from "@chakra-ui/react";
import { Nunito } from "@next/font/google";
import Head from "next/head";

// TODO https://stackoverflow.com/questions/60411351/how-to-use-google-analytics-with-next-js-app
// TODO google site verification old site

const font = Nunito({
    subsets: ["latin"]
});

export default function Home() {
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
            content="k5Shx6P2PcuHEhWQ_DYgw6k1L562FAY-V0N1dAPuc1Y"
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
