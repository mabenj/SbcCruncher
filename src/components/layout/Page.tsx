import { usePageview } from "@/hooks/usePageview";
import { Box, Container } from "@chakra-ui/react";
import React, { useEffect } from "react";
import AnimatedBg from "../ui/AnimatedBg";
import Footer from "./Footer";
import Header from "./Header";
import HtmlHead from "./HtmlHead";

interface PageProps {
    head: {
        title: string;
        description: string;
    };
    children: React.ReactNode;
    showHelpBtn?: boolean;
}

export default function Page({
    head,
    showHelpBtn = false,
    children
}: PageProps) {
    const pageview = usePageview();

    useEffect(
        () => pageview(window.location.pathname + window.location.search),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <>
            <HtmlHead title={head.title} description={head.description} />
            <AnimatedBg />
            <Container maxW="4xl">
                <header>
                    <Header showHelpBtn={showHelpBtn} />
                </header>
                <main>
                    <Box py={7} />
                    {children}
                </main>
                <footer>
                    <Footer />
                </footer>
            </Container>
        </>
    );
}
