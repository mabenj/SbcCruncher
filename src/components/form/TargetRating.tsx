import { ALL_RATINGS } from "@/constants";
import { useConfig } from "@/context/ConfigContext";
import { useEventTracker } from "@/hooks/useEventTracker";
import { Flex, Text } from "@chakra-ui/react";
import RatingCardCarouselSelect from "../ui/RatingCardCarouselSelect";

export default function TargetRating() {
    const [config, setConfig] = useConfig();
    const eventTracker = useEventTracker("Target rating");

    const setRating = (rating: number) => {
        eventTracker("target_set", "set=" + rating, rating);
        setConfig((prev) => ({ ...prev, targetRating: rating }));
    };

    return (
        <>
            <Flex alignItems="center" gap={2}>
                Selected
                <Text fontWeight={700} fontSize="2xl">
                    {config.targetRating}
                </Text>
            </Flex>
            <RatingCardCarouselSelect
                ratingRange={ALL_RATINGS}
                value={config.targetRating}
                onChange={(r) => setRating(r)}
            />
        </>
    );
}
