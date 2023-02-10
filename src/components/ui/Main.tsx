import { ConfigProvider } from "@/context/ConfigContext";
import { NotAllowedIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    Heading,
    Stack
} from "@chakra-ui/react";
import { mdiCalculator } from "@mdi/js";
import Icon from "@mdi/react";
import ExistingPlayers from "../ExistingPlayers";
import PlayerPrices from "../PlayerPrices";
import RatingRange from "../RatingRange";
import Solutions from "../Solutions";
import TargetRating from "../TargetRating";
import AccentedCard from "./AccentedCard";
import HoverTooltip from "./HoverTooltip";
import MutedSmall from "./MutedSmall";

export default function Main() {
    return (
        <ConfigProvider>
            <Stack spacing={10} mt="3.7rem">
                <AccentedCard>
                    <CardHeader>
                        <Heading size="md">Target Rating</Heading>
                    </CardHeader>
                    <CardBody>
                        <TargetRating />
                    </CardBody>
                    <CardFooter>
                        <MutedSmall>Select the desired squad rating</MutedSmall>
                    </CardFooter>
                </AccentedCard>

                <AccentedCard>
                    <CardHeader>
                        <Heading size="md">Existing Players</Heading>
                    </CardHeader>
                    <CardBody>
                        <ExistingPlayers />
                    </CardBody>
                    <CardFooter>
                        <MutedSmall>
                            Specify the ratings of the players you already
                            possess and plan to use in the SBC <em>(Fodder)</em>
                        </MutedSmall>
                    </CardFooter>
                </AccentedCard>

                <AccentedCard>
                    <CardHeader>
                        <Heading size="md">Range of Ratings to Try</Heading>
                    </CardHeader>
                    <CardBody>
                        <RatingRange />
                    </CardBody>
                    <CardFooter>
                        <MutedSmall>
                            Specify the minimum and maximum ratings to use when
                            calculating the possible rating combinations
                        </MutedSmall>
                    </CardFooter>
                </AccentedCard>

                <AccentedCard>
                    <CardHeader>
                        <Heading size="md">Player Prices</Heading>
                    </CardHeader>
                    <CardBody>
                        <PlayerPrices />
                    </CardBody>
                    <CardFooter>
                        <MutedSmall>
                            <Box mb={2}>Specify the price for each rating</Box>
                            <span>
                                <strong>Note!</strong> Only the prices for
                                ratings 81 - 98 are available from FUTBIN
                            </span>
                        </MutedSmall>
                    </CardFooter>
                </AccentedCard>

                <Flex justifyContent="center" alignItems="center" gap={2}>
                    <HoverTooltip label="Calculate the cheapest SBC solution">
                        <Button
                            size="lg"
                            colorScheme="brand"
                            leftIcon={<Icon path={mdiCalculator} size={1} />}
                            loadingText="Calculating"
                            isDisabled={false}
                            isLoading={false}>
                            Calculate
                        </Button>
                    </HoverTooltip>
                    <HoverTooltip label="Stop calculating">
                        <Button
                            size="lg"
                            colorScheme="red"
                            variant="outline"
                            leftIcon={<NotAllowedIcon />}
                            isDisabled={false}
                            onClick={() => console.log("stop")}>
                            Stop
                        </Button>
                    </HoverTooltip>
                </Flex>

                <Box pt={10}>
                    <Solutions />
                </Box>
            </Stack>
        </ConfigProvider>
    );
}
