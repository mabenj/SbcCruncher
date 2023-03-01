import { TRY_RATINGS } from "@/constants";
import { useConfig } from "@/context/ConfigContext";
import { useEventTracker } from "@/hooks/useEventTracker";
import { range } from "@/utilities";
import {
    Alert,
    AlertIcon,
    Box,
    Flex,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderMark,
    RangeSliderThumb,
    RangeSliderTrack,
    Stack,
    VStack
} from "@chakra-ui/react";
import { mdiArrowTopLeftBottomRight } from "@mdi/js";
import Icon from "@mdi/react";
import HoverTooltip from "../ui/HoverTooltip";
import RatingCardInput from "../ui/RatingCardInput";

const WARNING_THRESHOLD = 20;
const DEBOUNCE_MS = 4000;
const RANGE_MIN = Math.min(...TRY_RATINGS);
const RANGE_MAX = Math.max(...TRY_RATINGS);

export default function RatingRange() {
    const [config, setConfig] = useConfig();
    const eventTracker = useEventTracker("Rating range", DEBOUNCE_MS);

    const configMin = Math.min(...config.tryRatingMinMax);
    const configMax = Math.max(...config.tryRatingMinMax);

    const markStyles = {
        pt: 3,
        ml: -2,
        fontSize: "xs",
        color: "gray.500"
    };

    const handleRangeChange =
        (isSlider: boolean) => (range: [number, number]) => {
            const newMin = Math.min(...range);
            const newMax = Math.max(...range);
            if (newMin === configMin && newMax === configMax) {
                return;
            }
            setConfig((prev) => ({
                ...prev,
                tryRatingMinMax: [newMin, newMax]
            }));
            eventTracker(
                isSlider
                    ? `range_slider=${configMin},${configMax}`
                    : `range_card=${configMin},${configMax}`,
                configMin + "-" + configMax
            );
        };

    return (
        <Stack spacing={10}>
            <Flex justifyContent="center" alignItems="flex-end" gap={10}>
                <VStack>
                    <strong>Min</strong>

                    <RatingCardInput
                        customRange={TRY_RATINGS}
                        rating={configMin}
                        onChange={(newVal) =>
                            handleRangeChange(false)([newVal, configMax])
                        }
                        selection={range(configMin, configMax)}
                        reverseOptions
                    />
                </VStack>

                <Box py={3} color="gray.500">
                    <Icon
                        path={mdiArrowTopLeftBottomRight}
                        size={1}
                        rotate={-45}
                    />
                </Box>

                <VStack>
                    <strong>Max</strong>
                    <RatingCardInput
                        customRange={TRY_RATINGS}
                        rating={configMax}
                        onChange={(newVal) =>
                            handleRangeChange(false)([newVal, configMin])
                        }
                        selection={range(configMin, configMax)}
                        reverseOptions
                    />
                </VStack>
            </Flex>
            <Box px={["0.4rem", "2rem", "6rem", "8rem"]}>
                <RangeSlider
                    defaultValue={[configMin, configMax]}
                    min={RANGE_MIN}
                    max={RANGE_MAX}
                    step={1}
                    colorScheme="brand"
                    value={[configMin, configMax]}
                    onChange={handleRangeChange(true)}>
                    <RangeSliderTrack>
                        <RangeSliderFilledTrack bg="brand.400" />
                    </RangeSliderTrack>
                    {range(RANGE_MIN, RANGE_MAX, 5).map((rating) => (
                        <RangeSliderMark
                            key={rating}
                            value={rating}
                            {...markStyles}>
                            {rating}
                        </RangeSliderMark>
                    ))}
                    <RangeSliderMark value={RANGE_MAX} {...markStyles}>
                        {RANGE_MAX}
                    </RangeSliderMark>
                    <HoverTooltip label={configMin.toString()}>
                        <RangeSliderThumb index={0} boxShadow="0 0 3px black" />
                    </HoverTooltip>
                    <HoverTooltip label={configMax.toString()}>
                        <RangeSliderThumb index={1} boxShadow="0 0 3px black" />
                    </HoverTooltip>
                </RangeSlider>
            </Box>

            {Math.abs(configMax - configMin) > WARNING_THRESHOLD && (
                <Alert status="warning">
                    <AlertIcon />
                    <Box display="inline" ml={2}>
                        <strong>Note!</strong> Large rating ranges might take a
                        while to calculate
                    </Box>
                </Alert>
            )}
        </Stack>
    );
}
