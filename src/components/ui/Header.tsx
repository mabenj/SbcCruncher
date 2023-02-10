import { MoonIcon, QuestionOutlineIcon, SunIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
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
import { Nunito } from "@next/font/google";
import Image from "next/image";
import Link from "next/link";
import ExternalLink from "./ExternalLink";
import HoverTooltip from "./HoverTooltip";

const font = Nunito({
    subsets: ["latin"]
});

export default function Header() {
    const { colorMode, toggleColorMode } = useColorMode();
    const {
        isOpen: isHelpOpen,
        onOpen: onHelpOpen,
        onClose: onHelpClose
    } = useDisclosure();

    return (
        <Box px={2} pt={5}>
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
                            src="/logo.png"
                            alt="SBC Cruncher logo"
                            width={40}
                            height={40}
                        />
                        <Flex
                            gap={0.5}
                            className={font.className}
                            fontSize="xl"
                            userSelect="none">
                            <span>SBC</span>
                            <Box fontWeight={900} color="brand.400">
                                cruncher
                            </Box>
                        </Flex>
                    </Flex>
                </Link>
                <Flex alignItems="center">
                    <HoverTooltip label="Go to the old website">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                window.open(
                                    "https://old.sbccruncher.cc/",
                                    "_self"
                                )
                            }>
                            Old site
                        </Button>
                    </HoverTooltip>
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
                            onClick={toggleColorMode}
                        />
                    </HoverTooltip>
                    <HoverTooltip label="How to use">
                        <IconButton
                            size="sm"
                            variant="ghost"
                            icon={<QuestionOutlineIcon />}
                            aria-label="Help"
                            onClick={onHelpOpen}
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
                <DrawerHeader>How to use</DrawerHeader>
                <DrawerBody>
                    <OrderedList spacing={7}>
                        <ListItem pl={4}>
                            <p>
                                Specify your desired target rating by clicking a
                                rating card in the{" "}
                                <strong>Target Rating</strong> section
                                (Required)
                            </p>
                        </ListItem>
                        <ListItem pl={4}>
                            <p>
                                Enter the ratings of the players you already own
                                and plan to use in the SBC in the{" "}
                                <strong>Existing Players</strong> section
                                (Optional)
                            </p>
                        </ListItem>
                        <ListItem pl={4}>
                            <p>
                                In the <strong>Range of Ratings to Try</strong>{" "}
                                section, specify the range of ratings to use
                                when calculating the solutions.
                            </p>
                        </ListItem>
                        <ListItem pl={4}>
                            <p>
                                For example, with a range from{" "}
                                <strong>81</strong> to <strong>84</strong>, the
                                resulting player rating combinations will be
                                calculated from ratings <strong>81</strong>,{" "}
                                <strong>82</strong>, <strong>83</strong> and{" "}
                                <strong>84</strong>, plus from the ratings you
                                specified in the{" "}
                                <strong>Existing Players</strong> section.
                            </p>
                        </ListItem>
                        <ListItem pl={4}>
                            <p>
                                In the <strong>Player Prices</strong> section
                                you can specify the price, in coins, for each of
                                the ratings specified in the{" "}
                                <strong>Range of Ratings to Try</strong>{" "}
                                section.
                            </p>
                            <br />
                            <p>
                                You can also fetch the price data directly from
                                FUTBIN&apos;s{" "}
                                <ExternalLink href="https://www.futbin.com/stc/cheapest">
                                    cheapest player by rating
                                </ExternalLink>{" "}
                                page by clicking the{" "}
                                <strong>Fetch FUTBIN</strong> button. It will
                                scrape the price of the cheapest player for each
                                rating.
                            </p>
                        </ListItem>
                        <ListItem pl={4}>
                            <p>
                                Lastly, press the <strong>Calculate</strong>{" "}
                                button and wait for player rating combination
                                solutions to appear in the{" "}
                                <strong>Solutions</strong> table.
                            </p>
                            <br />
                            <p>
                                Each row in the table represents a group of
                                remaining player ratings you need to acquire in
                                order to achieve the specified target rating.
                            </p>
                        </ListItem>
                    </OrderedList>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
