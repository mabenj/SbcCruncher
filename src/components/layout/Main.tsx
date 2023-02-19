import { ConfigProvider } from "@/context/ConfigContext";
import {
    Box,
    CardBody,
    CardHeader,
    Heading,
    IconButton,
    Popover,
    PopoverAnchor,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    Stack
} from "@chakra-ui/react";
import { mdiInformationOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useRef, useState } from "react";
import ExistingPlayers from "../form/ExistingPlayers";
import PlayerPrices from "../form/PlayerPrices";
import RatingRange from "../form/RatingRange";
import Solutions from "../form/Solutions";
import TargetRating from "../form/TargetRating";
import AccentedCard from "../ui/AccentedCard";

export default function Main() {
    return (
        <ConfigProvider>
            <Stack spacing={10} mt="3.7rem">
                <Card
                    header="Target Rating"
                    info="Select the desired squad rating">
                    <TargetRating />
                </Card>

                <Card
                    header="Existing Players"
                    info="Specify the ratings of the players you already
                    possess and plan to use in the SBC (aka, fodder)">
                    <ExistingPlayers />
                </Card>

                <Card
                    header="Range of Ratings to Try"
                    info="Specify the minimum and maximum ratings to use when
                    calculating the possible rating combinations">
                    <RatingRange />
                </Card>

                <Card
                    header="Player Prices"
                    info="Specify the price for each rating">
                    <PlayerPrices />
                </Card>

                <Solutions />
            </Stack>
        </ConfigProvider>
    );
}

const Card = ({
    header,
    info,
    children
}: {
    header: string;
    info: string;
    children: React.ReactNode;
}) => {
    return (
        <AccentedCard>
            <CardHeader
                display="flex"
                justifyContent="space-between"
                alignItems="center">
                <Heading size="md">{header}</Heading>
                <InfoBtn>{info}</InfoBtn>
            </CardHeader>
            <CardBody>
                <Box pb={8}>{children}</Box>
            </CardBody>
        </AccentedCard>
    );
};

const InfoBtn = ({ children }: { children: React.ReactNode }) => {
    const initRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    return (
        <Popover
            isOpen={isHovering}
            onClose={() => setIsHovering(false)}
            initialFocusRef={initRef}
            closeOnBlur
            placement="bottom-end">
            <PopoverAnchor>
                <IconButton
                    size="xs"
                    variant="ghost"
                    cursor="help"
                    color="gray.500"
                    onMouseOver={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    icon={<Icon path={mdiInformationOutline} size={0.7} />}
                    aria-label={""}
                />
            </PopoverAnchor>
            <PopoverContent
                w="auto"
                maxW="min(30rem, 90vw)"
                onMouseOver={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}>
                <PopoverArrow />
                <PopoverBody ref={initRef}>{children}</PopoverBody>
            </PopoverContent>
        </Popover>
    );
};
