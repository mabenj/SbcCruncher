import { ConfigProvider } from "@/context/ConfigContext";
import {
    Box,
    CardBody,
    CardFooter,
    CardHeader,
    Heading,
    Stack
} from "@chakra-ui/react";
import ExistingPlayers from "../form/ExistingPlayers";
import PlayerPrices from "../form/PlayerPrices";
import RatingRange from "../form/RatingRange";
import Solutions from "../form/Solutions";
import TargetRating from "../form/TargetRating";
import AccentedCard from "../ui/AccentedCard";
import MutedSmall from "../ui/MutedSmall";

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
                                ratings 81 - 98 are available from Futbin and 82 - 98 from Futwiz
                            </span>
                        </MutedSmall>
                    </CardFooter>
                </AccentedCard>

                <Solutions />
            </Stack>
        </ConfigProvider>
    );
}
