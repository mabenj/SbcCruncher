import { SQUAD_SIZE } from "@/constants";
import { useConfig } from "@/context/ConfigContext";
import { useEventTracker } from "@/hooks/useEventTracker";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    IconButton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import { mdiClose, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import HoverTooltip from "../ui/HoverTooltip";
import RatingCardInput from "../ui/RatingCardInput";

const PLAYER_LIMIT = SQUAD_SIZE - 1;
const DEFAULT_RATING = 83;

export default function ExistingPlayers() {
    const [config, setConfig] = useConfig();

    const eventTracker = useEventTracker("Existing players");

    const totalPlayers = config.existingRatings
        .map(({ count }) => count)
        .reduce((acc, curr) => acc + curr, 0);

    const setRatingCount = (index: number, count: number) => {
        const numOfOtherRatings = config.existingRatings
            .filter((_, i) => i !== index)
            .map(({ count }) => count)
            .reduce((acc, curr) => acc + curr, 0);
        if (count < 1 || numOfOtherRatings + count > PLAYER_LIMIT) {
            return () => null;
        }
        return () =>
            setConfig((prev) => {
                const prevRatings = prev.existingRatings;
                if (prevRatings[index]) {
                    prevRatings[index].count = count;
                }
                return { ...prev, existingRatings: prevRatings };
            });
    };

    const setRating = (index: number, rating: number) => {
        setConfig((prev) => {
            const prevRatings = prev.existingRatings;
            if (prevRatings[index]) {
                prevRatings[index].rating = rating;
            }
            return { ...prev, existingRatings: [...prevRatings] };
        });
        eventTracker(
            "set_existing_rating=" + rating,
            rating.toString(),
            rating
        );
    };

    const removeRatingAt = (index: number) => {
        return () =>
            setConfig((prev) => {
                const ratings = prev.existingRatings;
                ratings.splice(index, 1);
                eventTracker("delete_existing_rating");
                return {
                    ...prev,
                    existingRatings: [...ratings]
                };
            });
    };

    const clearAllRatings = () => {
        setConfig((prev) => ({ ...prev, existingRatings: [] }));
        eventTracker("clear_existing_ratings");
    };

    const addRating = () => {
        setConfig((prev) => ({
            ...prev,
            existingRatings: [
                ...prev.existingRatings,
                { rating: DEFAULT_RATING, count: 1 }
            ]
        }));
        eventTracker("add_existing_rating");
    };

    return (
        <>
            {config.existingRatings.length === 0 ? (
                <Box color="gray.500">No ratings specified</Box>
            ) : (
                <TableContainer overflowX="hidden">
                    <Table>
                        <Thead>
                            <Tr>
                                <Th textAlign="center">Rating</Th>
                                <Th textAlign="center">Quantity</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {config.existingRatings.map(
                                ({ rating, count }, i) => (
                                    <Tr key={i}>
                                        <Td px={0}>
                                            <Flex justifyContent="center">
                                                <RatingCardInput
                                                    rating={rating}
                                                    onChange={(newRating) =>
                                                        setRating(i, newRating)
                                                    }
                                                />
                                            </Flex>
                                        </Td>
                                        <Td px={0}>
                                            <Flex
                                                justifyContent="center"
                                                alignItems="center"
                                                gap={3}>
                                                <HoverTooltip label="Remove one">
                                                    <IconButton
                                                        variant="ghost"
                                                        size="xs"
                                                        aria-label="Increment"
                                                        icon={<MinusIcon />}
                                                        onClick={setRatingCount(
                                                            i,
                                                            count - 1
                                                        )}
                                                        isDisabled={count === 1}
                                                    />
                                                </HoverTooltip>
                                                {count}
                                                <HoverTooltip label="Add one">
                                                    <IconButton
                                                        variant="ghost"
                                                        size="xs"
                                                        aria-label="Increment"
                                                        icon={<AddIcon />}
                                                        onClick={setRatingCount(
                                                            i,
                                                            count + 1
                                                        )}
                                                        isDisabled={
                                                            totalPlayers ===
                                                            PLAYER_LIMIT
                                                        }
                                                    />
                                                </HoverTooltip>
                                            </Flex>
                                        </Td>
                                        <Td px={0}>
                                            <HoverTooltip label="Delete">
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    aria-label="delete"
                                                    icon={
                                                        <Icon
                                                            path={
                                                                mdiTrashCanOutline
                                                            }
                                                            size={0.8}
                                                        />
                                                    }
                                                    onClick={removeRatingAt(
                                                        i
                                                    )}></IconButton>
                                            </HoverTooltip>
                                        </Td>
                                    </Tr>
                                )
                            )}
                            <Tr>
                                <Td>Total</Td>
                                <Td textAlign="center">{totalPlayers}</Td>
                                <Td></Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            )}

            <Flex justifyContent={["center", null, "flex-start"]}>
                <ButtonGroup colorScheme="gray" variant="solid" mt={10}>
                    <HoverTooltip label="Add a player rating">
                        <Button
                            leftIcon={<Icon path={mdiPlus} size={0.8} />}
                            onClick={addRating}
                            isDisabled={totalPlayers === PLAYER_LIMIT}>
                            Add rating
                        </Button>
                    </HoverTooltip>
                    {config.existingRatings.length > 0 && (
                        <HoverTooltip label="Clear all player ratings">
                            <Button
                                leftIcon={<Icon path={mdiClose} size={0.8} />}
                                onClick={clearAllRatings}>
                                Reset
                            </Button>
                        </HoverTooltip>
                    )}
                </ButtonGroup>
            </Flex>
        </>
    );
}
