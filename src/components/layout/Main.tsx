import { ConfigProvider } from "@/context/ConfigContext";
import { useEventTracker } from "@/hooks/useEventTracker";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    CardBody,
    CardHeader,
    Heading,
    Popover,
    PopoverAnchor,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    Stack,
    Text
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import ExistingPlayers from "../form/ExistingPlayers";
import PlayerPrices from "../form/PlayerPrices";
import RatingRange from "../form/RatingRange";
import Solutions from "../form/solutions/Solutions";
import TargetRating from "../form/TargetRating";
import AccentedCard from "../ui/AccentedCard";

export default function Main() {
    return (
        <ConfigProvider>
            <Stack spacing={10} mt="3.7rem">
                <Card
                    header="Target Rating"
                    infoParagraphs={[
                        "Choose a target rating.",
                        "This can be, for example, the required rating of an SBC."
                    ]}
                    step={1}>
                    <TargetRating />
                </Card>

                <Card
                    header="Existing Players"
                    infoParagraphs={[
                        "If you already have some players you want to use, add them here by pressing the 'Add player' button."
                    ]}
                    step={2}>
                    <ExistingPlayers />
                </Card>

                <Card
                    header="Range of Ratings to Use"
                    infoParagraphs={[
                        "Select the minimum and maximum ratings you want SBC Cruncher to use when calculating solutions."
                    ]}
                    step={3}>
                    <RatingRange />
                </Card>

                <Card
                    header="Player Prices"
                    infoParagraphs={[
                        "Enter the price for each rating so that SBC Cruncher can properly rank the calculated solutions.",
                        "You can also fill the prices with Futbin or Futwiz price data by pressing the 'Auto-fill' button."
                    ]}
                    step={4}>
                    <PlayerPrices />
                </Card>

                <Solutions />
            </Stack>
        </ConfigProvider>
    );
}

const Card = ({
    header,
    infoParagraphs,
    children,
    step
}: {
    header: string;
    infoParagraphs: string[];
    children: React.ReactNode;
    step: number;
}) => {
    return (
        <AccentedCard>
            <CardHeader
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start">
                <Heading size="md">{header}</Heading>
                <InfoBtn step={step}>
                    {infoParagraphs.map((text, i) => (
                        <Text key={i} py={1}>
                            {text}
                        </Text>
                    ))}
                </InfoBtn>
            </CardHeader>
            <CardBody>
                <Box pb={8}>{children}</Box>
            </CardBody>
        </AccentedCard>
    );
};

const InfoBtn = ({
    step,
    children
}: {
    step: number;
    children: React.ReactNode;
}) => {
    const initRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    const eventTracker = useEventTracker("Info");

    return (
        <Popover
            isOpen={isHovering}
            onClose={() => setIsHovering(false)}
            initialFocusRef={initRef}
            closeOnBlur
            placement="bottom-end">
            <PopoverAnchor>
                <Button
                    size="sm"
                    variant="ghost"
                    cursor="help"
                    color="gray.500"
                    rightIcon={<QuestionOutlineIcon mb={0.5} />}
                    onMouseOver={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={() => eventTracker("click_info_step=" + step)}>
                    Step {step}
                </Button>
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
