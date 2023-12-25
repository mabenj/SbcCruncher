import { RATING_MAX, RATING_MIN, SQUAD_SIZE } from "@/common/constants";
import { useConfig } from "@/context/ConfigContext";
import { useEventTracker } from "@/hooks/useEventTracker";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    ButtonGroup,
    Collapse,
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
import { mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import HoverTooltip from "../ui/HoverTooltip";
import RatingCardInput from "../ui/RatingCardInput";

const PLAYER_LIMIT = SQUAD_SIZE - 1;
const DEFAULT_RATING = 85;

export default function ExistingPlayers() {
    const [config, setConfig] = useConfig();

    const eventTracker = useEventTracker("Existing players");

    const totalPlayers = config.existingRatings
        .map(({ count }) => count)
        .reduce((acc, curr) => acc + curr, 0);

    const isFull = totalPlayers === PLAYER_LIMIT;

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
                if (prevRatings[index] && prevRatings[index].count !== count) {
                    const operation =
                        prevRatings[index].count > count
                            ? "decrement"
                            : "increment";
                    prevRatings[index].count = count;
                    eventTracker(
                        `existing_player_${operation}`,
                        `${operation}=${count}x${prevRatings[index].rating}`,
                        operation === "decrement" ? -1 : 1
                    );
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
        eventTracker("existing_player_set", "set=" + rating, rating);
    };

    const removeRatingAt = (index: number) => {
        return () =>
            setConfig((prev) => {
                const ratings = prev.existingRatings;
                const [deleted] = ratings.splice(index, 1);
                eventTracker(
                    "existing_player_delete",
                    `delete=${deleted.count}x${deleted.rating}`
                );
                return {
                    ...prev,
                    existingRatings: [...ratings]
                };
            });
    };

    const clearAllRatings = () => {
        setConfig((prev) => ({ ...prev, existingRatings: [] }));
        eventTracker("existing_player_reset", "reset");
    };

    const addRating = () => {
        setConfig((prev) => {
            const lowestRating =
                prev.existingRatings
                    .map(({ rating }) => rating)
                    .sort((a, b) => a - b)[0] ?? DEFAULT_RATING + 1;
            const ratingToAdd = Math.min(
                Math.max(lowestRating - 1, RATING_MIN),
                RATING_MAX
            );
            return {
                ...prev,
                existingRatings: [
                    ...prev.existingRatings,
                    {
                        rating: ratingToAdd,
                        count: 1
                    }
                ]
            };
        });
        eventTracker("existing_player_add", "add");
    };

    return (
        <>
            <Collapse in={config.existingRatings.length > 0} animateOpacity>
                <TableContainer overflowX="hidden" pb={8}>
                    <Table variant="unstyled">
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
                                            <Flex
                                                justifyContent="center"
                                                alignItems="center"
                                                gap={3}>
                                                <HoverTooltip
                                                    label="Decrement rating"
                                                    placement="left">
                                                    <IconButton
                                                        variant="ghost"
                                                        size="xs"
                                                        aria-label="Decrement"
                                                        icon={<MinusIcon />}
                                                        onClick={() =>
                                                            setRating(
                                                                i,
                                                                rating - 1
                                                            )
                                                        }
                                                        isDisabled={
                                                            rating ===
                                                            RATING_MIN
                                                        }
                                                    />
                                                </HoverTooltip>
                                                <RatingCardInput
                                                    rating={rating}
                                                    onChange={(newRating) =>
                                                        setRating(i, newRating)
                                                    }
                                                />
                                                <HoverTooltip
                                                    label="Increment rating"
                                                    placement="right">
                                                    <IconButton
                                                        variant="ghost"
                                                        size="xs"
                                                        aria-label="Increment"
                                                        icon={<AddIcon />}
                                                        onClick={() =>
                                                            setRating(
                                                                i,
                                                                rating + 1
                                                            )
                                                        }
                                                        isDisabled={
                                                            rating ===
                                                            RATING_MAX
                                                        }
                                                    />
                                                </HoverTooltip>
                                            </Flex>
                                        </Td>
                                        <Td px={0}>
                                            <Flex
                                                justifyContent="center"
                                                alignItems="center"
                                                gap={3}>
                                                <HoverTooltip
                                                    label="Remove one"
                                                    placement="left">
                                                    <IconButton
                                                        variant="ghost"
                                                        size="xs"
                                                        aria-label="Decrement"
                                                        icon={<MinusIcon />}
                                                        onClick={setRatingCount(
                                                            i,
                                                            count - 1
                                                        )}
                                                        isDisabled={count === 1}
                                                    />
                                                </HoverTooltip>
                                                {count}
                                                <HoverTooltip
                                                    label="Add one"
                                                    placement="right">
                                                    <IconButton
                                                        variant="ghost"
                                                        size="xs"
                                                        aria-label="Increment"
                                                        icon={<AddIcon />}
                                                        onClick={setRatingCount(
                                                            i,
                                                            count + 1
                                                        )}
                                                        isDisabled={isFull}
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
                                                    onClick={removeRatingAt(i)}
                                                />
                                            </HoverTooltip>
                                        </Td>
                                    </Tr>
                                )
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Collapse>

            <Collapse in={isFull}>
                <Box pb={8}>
                    <Alert status="warning" variant="left-accent">
                        <AlertIcon />
                        <AlertDescription>
                            Existing player limit reached
                        </AlertDescription>
                    </Alert>
                </Box>
            </Collapse>

            <Flex
                justifyContent={["center", null, "space-between"]}
                direction={["column", null, "row"]}
                gap={3}
                alignItems="center">
                <ButtonGroup colorScheme="gray" variant="solid">
                    <HoverTooltip label="Add a player rating">
                        <Button
                            leftIcon={<Icon path={mdiPlus} size={0.8} />}
                            onClick={addRating}
                            isDisabled={totalPlayers === PLAYER_LIMIT}>
                            Add player
                        </Button>
                    </HoverTooltip>
                    {config.existingRatings.length > 0 && (
                        <HoverTooltip label="Clear all player ratings">
                            <Button
                                variant="ghost"
                                colorScheme="gray"
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
