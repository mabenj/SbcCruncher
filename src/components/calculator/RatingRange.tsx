import { TRY_RATINGS } from "@/common/constants";
import { range } from "@/common/utilities";
import { useConfig } from "@/context/ConfigContext";
import { useEventTracker } from "@/hooks/useEventTracker";
import { AddIcon } from "@chakra-ui/icons";
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Collapse,
    Flex,
    Heading,
    IconButton,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderMark,
    RangeSliderThumb,
    RangeSliderTrack,
    Stack,
    VStack
} from "@chakra-ui/react";
import { mdiArrowTopLeftBottomRight, mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { useMemo } from "react";
import HoverTooltip from "../ui/HoverTooltip";
import RatingCardInput from "../ui/RatingCardInput";

const WARNING_THRESHOLD = 20;
const RANGE_MIN = Math.min(...TRY_RATINGS);
const RANGE_MAX = Math.max(...TRY_RATINGS);

export default function RatingRange() {
    const [config, setConfig] = useConfig();
    const eventTracker = useEventTracker("Rating range");

    const [configMin, configMax] = useMemo(
        () => [
            Math.min(...config.tryRatingMinMax),
            Math.max(...config.tryRatingMinMax)
        ],
        [config.tryRatingMinMax]
    );
    const excludeOptions = useMemo(
        () =>
            range(configMin, configMax).filter(
                (rating) => !config.tryRatingExclude.includes(rating)
            ),
        [configMin, configMax, config.tryRatingExclude]
    );

    const markStyles = {
        pt: 3,
        ml: -2,
        fontSize: "xs",
        color: "gray.500"
    };

    const handleSliderChange = (range: [number, number]) => {
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
            "range_set_slider",
            `slider=${newMin}-${newMax}`,
            newMax - newMin + 1
        );
    };

    const handleChangeMin = (min: number) => {
        const newMin = Math.min(...[min, configMax]);
        const newMax = Math.max(...[min, configMax]);
        setConfig((prev) => ({ ...prev, tryRatingMinMax: [newMin, newMax] }));
        eventTracker("range_set_min", `min=${newMin}`, newMin);
    };

    const handleChangeMax = (max: number) => {
        const newMin = Math.min(...[configMin, max]);
        const newMax = Math.max(...[configMin, max]);
        setConfig((prev) => ({ ...prev, tryRatingMinMax: [newMin, newMax] }));
        eventTracker("range_set_max", `max=${newMax}`, newMax);
    };

    const handleExcludeAdd = () => {
        setConfig((prev) => ({
            ...prev,
            tryRatingExclude: [...prev.tryRatingExclude, excludeOptions[0]]
        }));
        eventTracker(
            "range_exclude_add",
            `exclude=${excludeOptions[0]}`,
            excludeOptions[0]
        );
    };

    const handleExcludeChange = (index: number, rating: number) => {
        setConfig((prev) => {
            const { tryRatingExclude } = prev;
            tryRatingExclude[index] = rating;
            return { ...prev, tryRatingExclude: [...tryRatingExclude] };
        });
        eventTracker("range_exclude_set", `set=${rating}`, rating);
    };

    const handleExcludeDelete = (index: number) => {
        setConfig((prev) => {
            const { tryRatingExclude } = prev;
            eventTracker(
                "range_exclude_delete",
                `delete=${tryRatingExclude[index]}`,
                tryRatingExclude[index]
            );
            tryRatingExclude.splice(index, 1);
            return { ...prev, tryRatingExclude };
        });
    };

    const handleExcludeClear = () => {
        setConfig((prev) => ({ ...prev, tryRatingExclude: [] }));
        eventTracker("range_exclude_clear", `clear`);
    };

    return (
        <Stack spacing={10}>
            <Flex justifyContent="center" alignItems="flex-end" gap={10}>
                <VStack>
                    <strong>Min</strong>

                    <RatingCardInput
                        customRange={TRY_RATINGS}
                        rating={configMin}
                        onChange={handleChangeMin}
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
                        onChange={handleChangeMax}
                        selection={range(configMin, configMax)}
                        reverseOptions
                    />
                </VStack>
            </Flex>
            <Box px={["0.4rem", "2rem", "6rem", "8rem"]} pb={6}>
                <RangeSlider
                    defaultValue={[configMin, configMax]}
                    min={RANGE_MIN}
                    max={RANGE_MAX}
                    step={1}
                    colorScheme="brand"
                    value={[configMin, configMax]}
                    onChange={handleSliderChange}>
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

            <Collapse in={config.tryRatingExclude.length > 0}>
                <Heading size="sm" textAlign="center">
                    Exclude ratings
                </Heading>
                <Box py={2} />
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={4}>
                    {config.tryRatingExclude.map((excludeRating, i) => (
                        <Flex key={`${i}_${excludeRating}`}>
                            <RatingCardInput
                                rating={excludeRating}
                                onChange={(newRating) =>
                                    handleExcludeChange(i, newRating)
                                }
                                customRange={excludeOptions}
                                reverseOptions
                            />
                            <HoverTooltip label="Remove exclude rating">
                                <IconButton
                                    variant="ghost"
                                    size="xs"
                                    rounded="full"
                                    aria-label="Remove exclude rating"
                                    icon={<Icon path={mdiClose} size={0.8} />}
                                    onClick={() => handleExcludeDelete(i)}
                                />
                            </HoverTooltip>
                        </Flex>
                    ))}
                </Flex>
            </Collapse>

            <Flex justifyContent="center" alignItems="center" gap={2}>
                <HoverTooltip label="Add a rating to exclude">
                    <Button
                        leftIcon={<AddIcon />}
                        onClick={handleExcludeAdd}
                        isDisabled={excludeOptions.length === 0}>
                        Exclude rating
                    </Button>
                </HoverTooltip>
                {config.tryRatingExclude.length > 0 && (
                    <HoverTooltip label="Clear all exclude ratings">
                        <Button variant="ghost" onClick={handleExcludeClear}>
                            Reset
                        </Button>
                    </HoverTooltip>
                )}
            </Flex>

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
