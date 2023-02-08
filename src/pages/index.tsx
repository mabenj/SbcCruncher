import { Inter } from "@next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            <Head>
                <title>
                    SBC Cruncher - FIFA Ultimate Team SBC Rating Calculator
                </title>
                <meta
                    name="description"
                    content="SBC Cruncher calculates the cheapest player rating combinations for FIFA Ultimate Team SBCs based on FUTBIN price data"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>Hello</main>
        </>
    );
}
