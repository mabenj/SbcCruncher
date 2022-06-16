/* eslint-disable @next/next/no-css-tags */
import type { NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import PrimeReact from "primereact/api";
import { ScrollTop } from "primereact/scrolltop";
import React, { useEffect, useState } from "react";
import ConfigurationForm from "../components/inputs/ConfigurationForm";
import { Solutions } from "../components/Solutions";
import { Container } from "../components/ui-elements/Container";
import { Footer } from "../components/ui-elements/Footer";
import { Header } from "../components/ui-elements/Header";
import ProgressBar from "../components/ui-elements/ProgressBar";
import Config from "../config/Config";
import SEO from "../config/SEO";
import { useAnalytics } from "../hooks/useAnalytics";
import { useSolver } from "../hooks/useSolver";
import { range } from "../utils/utils";
PrimeReact.ripple = true;

const Home: NextPage = () => {
    const { pageView } = useAnalytics();

    const [solverState, calculate, stopSolver, fetchSolutions, resetState] =
        useSolver();

    const [solutionColumns, setSolutionColumns] = useState<number[]>(
        range(Config.defaultTryMin, Config.defaultTryMax)
    );

    useEffect(() => {
        pageView(window.location.pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <DocumentHead />

            <Container>
                <Header />

                <ConfigurationForm
                    calculate={calculate}
                    configChanged={() => resetState()}
                    stopPressed={() => stopSolver()}
                    tryBoundsChanged={(newBounds) =>
                        setSolutionColumns(range(newBounds[0], newBounds[1]))
                    }
                    isCalculating={solverState.isCalculating}
                />

                <Solutions
                    displaySolutions={solverState.solutions}
                    columnDefinitions={solutionColumns}
                    totalSolutionsCount={solverState.solutionsCount}
                    fetchMoreSolutions={fetchSolutions}
                    isCalculating={solverState.isCalculating}
                />

                <Footer />
            </Container>

            <ScrollTop threshold={Config.scrollToTopThreshold} />
            <ProgressBar
                percent={solverState.progressPercent}
                hidden={!solverState.isCalculating}
            />

            <Script src={Config.fontAwesomeCdn} />
        </>
    );
};

const DocumentHead = () => {
    return (
        <Head>
            {/* TODO: https://stackoverflow.com/questions/68326186/how-to-dynamically-change-global-stylesheets-in-next-js */}
            <link
                rel="stylesheet"
                type="text/css"
                href={`/assets/themes/${Config.darkThemeName}/theme.css`}
            />
            <link
                id="app-theme"
                rel="stylesheet"
                type="text/css"
                href={`/assets/themes/${Config.lightThemeName}/theme.css`}
            />
            <title>{SEO.title}</title>
            <meta name="description" content={SEO.description} />
            {/* OG Tags */}
            <meta property="og:title" content={SEO.title} />
            <meta property="og:description" content={SEO.description} />
            <meta property="og:site_name" content={SEO.siteName} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={SEO.url} />
            {/* 200x200px - 1200x1200px */}
            <meta property="og:image" content={SEO.bannerImage} />{" "}
            {/* realfavicongenerator.net */}
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/apple-touch-icon.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/manifest.json" />
            <link
                rel="mask-icon"
                href="/safari-pinned-tab.svg"
                color="#5bbad5"
            />
            <meta name="msapplication-TileColor" content="#2d89ef" />
            <meta name="theme-color" content="#ffffff" />
            {/* Google site verification */}
            <meta
                name="google-site-verification"
                content={SEO.siteVerificationGoogle}
            />
        </Head>
    );
};

export default Home;
