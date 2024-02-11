import { useEventTracker } from "@/hooks/useEventTracker";
import { Box, Flex, Link } from "@chakra-ui/react";
import { mdiGithub } from "@mdi/js";
import Icon from "@mdi/react";
import { Nunito } from "@next/font/google";
import Image from "next/image";
import NextLink from "next/link";
import ExternalLink from "../ui/ExternalLink";
import HoverTooltip from "../ui/HoverTooltip";
import MutedSmall from "../ui/MutedSmall";

const nunito = Nunito({
    subsets: ["latin"],
    display: "swap"
});

export default function Footer() {
    const eventTracker = useEventTracker("Footer");

    return (
        <>
            <Flex
                direction="column"
                alignItems="center"
                gap={5}
                fontSize="sm"
                textAlign="center"
                mt={["10rem", null, "20rem"]}
                mb="3rem">
                <Flex
                    direction={["column", null, "row"]}
                    alignItems={["stretch", null, "center"]}
                    columnGap={5}
                    rowGap={5}
                    mb={10}>
                    <Box
                        position="relative"
                        flexGrow={1}
                        minW="10rem"
                        h="2.7rem">
                        <Link
                            href="https://www.buymeacoffee.com/mabenj"
                            isExternal
                            onClick={() =>
                                eventTracker("donate_click", "donate_click")
                            }>
                            <HoverTooltip label="Donate">
                                <Image
                                    src="/images/bmc-button.svg"
                                    alt="Buy me a coffee"
                                    fill
                                    style={{ objectFit: "contain" }}
                                />
                            </HoverTooltip>
                        </Link>
                    </Box>

                    <Box
                        position="relative"
                        flexGrow={1}
                        minW="10rem"
                        h="2.7rem">
                        <Link
                            href="https://play.google.com/store/apps/details?id=cc.sbccruncher.twa"
                            isExternal
                            onClick={() =>
                                eventTracker(
                                    "google_play_click",
                                    "google_play_click"
                                )
                            }>
                            <HoverTooltip label="Google Play">
                                <Image
                                    src="/images/google-play.png"
                                    alt="Get it on Google Play"
                                    fill
                                    style={{ objectFit: "contain" }}
                                />
                            </HoverTooltip>
                        </Link>
                    </Box>
                </Flex>

                <div
                    onClick={() =>
                        eventTracker("brute_forcer_click", "brute_forcer_click")
                    }>
                    <MutedSmall>
                        The idea for SBC Cruncher was inspired by{" "}
                        <ExternalLink
                            href="https://elmaano.github.io/sbc/"
                            small>
                            SBC Rating Brute Forcer
                        </ExternalLink>
                    </MutedSmall>
                </div>

                <Flex
                    gap={5}
                    py={5}
                    onClick={() => eventTracker("github_click", "github_click")}
                    justifyContent="center"
                    alignItems="center">
                    <Link as={NextLink} href="/privacy" color="gray.500">
                        Privacy Policy
                    </Link>
                    <Link as={NextLink} href="/contact" color="gray.500">
                        Contact
                    </Link>
                    <Flex gap={2} justifyContent="center" alignItems="center">
                        <Box color="gray.500">© {new Date().getFullYear()}</Box>
                        <Icon path={mdiGithub} size={1}></Icon>
                        <ExternalLink href="https://github.com/mabenj/SbcCruncher">
                            mabenj
                        </ExternalLink>
                    </Flex>
                </Flex>
            </Flex>
            {process.env.NEXT_PUBLIC_COMMIT_REF && (
                <Box
                    position="absolute"
                    left={0}
                    color="gray.500"
                    fontSize="xs"
                    p={2}>
                    Build commit{" "}
                    {process.env.NEXT_PUBLIC_COMMIT_REF.slice(0, 7)}
                </Box>
            )}
        </>
    );
}
