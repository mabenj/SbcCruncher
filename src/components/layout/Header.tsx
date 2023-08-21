import { useEventTracker } from "@/hooks/useEventTracker";
import { MoonIcon, QuestionOutlineIcon, SunIcon } from "@chakra-ui/icons";
import {
    Box,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    IconButton,
    ListItem,
    OrderedList,
    Text,
    useColorMode,
    useDisclosure
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ExternalLink from "../ui/ExternalLink";
import HoverTooltip from "../ui/HoverTooltip";

const DEBOUNCE_MS = 200;

export default function Header() {
    const { colorMode, toggleColorMode } = useColorMode();
    const {
        isOpen: isHelpOpen,
        onOpen: onHelpOpen,
        onClose: onHelpClose
    } = useDisclosure();

    const eventTracker = useEventTracker("Header", DEBOUNCE_MS);

    const handleToggleTheme = () => {
        eventTracker(
            "set_theme",
            colorMode === "dark" ? "light" : "dark",
            colorMode === "dark" ? 1 : -1
        );
        toggleColorMode();
    };

    const handleOpenHelp = () => {
        onHelpOpen();
        eventTracker("open_help", "open_help");
    };

    return (
        <Box position="relative" px={2} pt={5}>
            <Flex
                wrap="wrap"
                justifyContent="space-between"
                alignItems="center">
                <Link href="/">
                    <Flex
                        wrap="nowrap"
                        gap={2}
                        alignItems="center"
                        cursor="pointer">
                        <Image
                            src="/images/logo.png"
                            alt="SBC Cruncher logo"
                            width={40}
                            height={40}
                        />
                        <Flex gap={0.5} fontSize="xl" userSelect="none">
                            <span>SBC</span>
                            <Box fontWeight={900} color="brand.400">
                                cruncher
                            </Box>
                        </Flex>
                    </Flex>
                </Link>
                <Flex alignItems="center">
                    {/* <HoverTooltip label="Go to the old website">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                eventTracker("nav_old_site");
                                window.open(
                                    "https://old.sbccruncher.cc/",
                                    "_self"
                                );
                            }}>
                            Old site
                        </Button>
                    </HoverTooltip> */}
                    <HoverTooltip
                        label={
                            colorMode === "dark" ? "Light mode" : "Dark mode"
                        }>
                        <IconButton
                            size="sm"
                            variant="ghost"
                            icon={
                                colorMode === "dark" ? (
                                    <SunIcon />
                                ) : (
                                    <MoonIcon />
                                )
                            }
                            aria-label={
                                colorMode === "dark"
                                    ? "Light mode"
                                    : "Dark mode"
                            }
                            onClick={handleToggleTheme}
                        />
                    </HoverTooltip>
                    <HoverTooltip label="How to use">
                        <IconButton
                            size="sm"
                            variant="ghost"
                            icon={<QuestionOutlineIcon />}
                            aria-label="Help"
                            onClick={handleOpenHelp}
                        />
                    </HoverTooltip>
                </Flex>
            </Flex>

            <Text fontSize="sm" mt={3} color="gray.500">
                Calculate the cheapest combination of player ratings for SBC
                solutions
            </Text>

            <HelpDrawer isOpen={isHelpOpen} onClose={onHelpClose} />
        </Box>
    );
}

const HelpDrawer = ({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => any;
}) => {
    return (
        <Drawer
            onClose={onClose}
            isOpen={isOpen}
            size={["full", "full", "full", "lg", "lg"]}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>How to use SBC Cruncher</DrawerHeader>
                <DrawerBody pl={10} pr={20} pb="7rem">
                    <OrderedList
                        spacing={7}
                        lineHeight={1.8}
                        letterSpacing={0.3}>
                        <ListItem pl={4}>
                            <Text>
                                <strong>Choose your target rating</strong>: In
                                the <Em>Target Rating</Em> section, select a
                                rating card to specify your desired target
                                rating.
                            </Text>
                        </ListItem>
                        <ListItem pl={4}>
                            <Text>
                                <strong>Enter existing player ratings</strong>:
                                If you have players you plan to use in the SBC,
                                go to the <Em>Existing Players</Em> section and
                                enter their ratings.
                            </Text>
                        </ListItem>
                        <ListItem pl={4}>
                            <Text>
                                <strong>Set the ratings to use</strong>: In the{" "}
                                <Em>Ratings to Use</Em> section, specify the
                                range of ratings you want to use for calculating
                                solutions.
                            </Text>
                            <Text mt={2}>
                                For instance, if you set a range from{" "}
                                <Em>81</Em> to <Em>84</Em>, SBC Cruncher will
                                generate player rating combinations from{" "}
                                <Em>81</Em>, <Em>82</Em>, <Em>83</Em>,{" "}
                                <Em>84</Em>, and the ratings you entered in the{" "}
                                <Em>Existing Players</Em> section.
                            </Text>
                        </ListItem>
                        <ListItem pl={4}>
                            <Text>
                                <strong>Set player prices</strong>: In the{" "}
                                <Em>Player Prices</Em> section, you can specify
                                the price of each rating in coins so that SBC
                                Cruncher can rank the solutions based on their
                                price.
                            </Text>
                            <Text mt={2}>
                                You can also fetch the prices directly from{" "}
                                <ExternalLink href="https://www.futbin.com/stc/cheapest">
                                    Futbin
                                </ExternalLink>{" "}
                                or{" "}
                                <ExternalLink href="https://www.futwiz.com/en/lowest-price-ratings">
                                    Futwiz
                                </ExternalLink>{" "}
                                by clicking the <Em>Auto-fill</Em> button. This
                                will automatically fetch and fill the prices
                                with the current prices listed in{" "}
                                <Em>Futbin</Em> or <Em>Futwiz</Em>.
                            </Text>
                        </ListItem>
                        <ListItem pl={4}>
                            <Text>
                                <strong>Get solutions</strong>: Finally, press
                                the <Em>Calculate</Em> button and wait for the
                                solutions to appear at the bottom of the page.
                            </Text>
                            <Text mt={2}>
                                Each solution will show the player ratings you
                                need to acquire to reach your target rating.
                            </Text>
                        </ListItem>
                    </OrderedList>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

const Em = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box as="span" display="inline" fontWeight="semibold">
            {children}
        </Box>
    );
};
