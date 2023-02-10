import { TRY_RATINGS } from "@/constants";
import { useConfig } from "@/context/ConfigContext";
import { range } from "@/utilities";
import {
    Alert,
    AlertIcon,
    Box,
    Flex,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    RangeSliderTrack,
    Stack,
    VStack
} from "@chakra-ui/react";
import { mdiArrowTopLeftBottomRight } from "@mdi/js";
import Icon from "@mdi/react";
import RatingCardInput from "./ui/RatingCardInput";

const WARNING_THRESHOLD = 15;

export default function RatingRange() {
    const [config, setConfig] = useConfig();
    const min = Math.min(...config.tryRatingMinMax);
    const max = Math.max(...config.tryRatingMinMax);

    const handleRangeChange = (range: [number, number]) => {
        const newMin = Math.min(...range);
        const newMax = Math.max(...range);
        if (newMin === min && newMax === max) {
            return;
        }
        setConfig((prev) => ({ ...prev, tryRatingMinMax: [newMin, newMax] }));
    };

    return (
        <Stack spacing={10}>
            <Flex justifyContent="center" alignItems="center" gap={10}>
                <VStack>
                    <strong>From</strong>

                    <RatingCardInput
                        customRange={TRY_RATINGS}
                        rating={min}
                        onChange={(newVal) => handleRangeChange([newVal, max])}
                        selection={range(min, max)}
                        reverseOptions
                    />
                </VStack>

                <Icon path={mdiArrowTopLeftBottomRight} size={1} rotate={-45} />

                <VStack>
                    <strong>To</strong>
                    <RatingCardInput
                        customRange={TRY_RATINGS}
                        rating={max}
                        onChange={(newVal) => handleRangeChange([newVal, min])}
                        selection={range(min, max)}
                        reverseOptions
                    />
                </VStack>
            </Flex>
            <RangeSlider
                defaultValue={[min, max]}
                min={Math.min(...TRY_RATINGS)}
                max={Math.max(...TRY_RATINGS)}
                step={1}
                colorScheme="brand"
                value={[min, max]}
                onChange={handleRangeChange}>
                <RangeSliderTrack>
                    <RangeSliderFilledTrack bg="brand.500" />
                </RangeSliderTrack>
                <RangeSliderThumb
                    index={0}
                    boxSize={6}
                    fontSize="xs"
                    border="1px solid"
                    borderColor="brand.400"
                    color="gray.700">
                    {min}
                </RangeSliderThumb>
                <RangeSliderThumb
                    index={1}
                    boxSize={6}
                    fontSize="xs"
                    border="1px solid"
                    borderColor="brand.400"
                    color="gray.700">
                    {max}
                </RangeSliderThumb>
            </RangeSlider>
            {Math.abs(max - min) > WARNING_THRESHOLD && (
                <Alert status="warning">
                    <AlertIcon />
                    <small>
                        <strong>Note!</strong>
                        <Box display="inline" ml={2}>
                            Large rating ranges might take a while to calculate
                        </Box>
                    </small>
                </Alert>
            )}
        </Stack>
    );
}
