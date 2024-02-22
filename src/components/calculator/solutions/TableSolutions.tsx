import { prettyNumber, range } from "@/common/utilities";
import ExternalLink from "@/components/ui/ExternalLink";
import MutedSmall from "@/components/ui/MutedSmall";
import { useEventTracker } from "@/hooks/useEventTracker";
import { Solution } from "@/types/solution.interface";
import {
    Badge,
    Card,
    CardBody,
    Fade,
    Flex,
    Skeleton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useColorModeValue
} from "@chakra-ui/react";
import { mdiAlertCircleOutline, mdiAlertOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useMemo } from "react";

export default function TableSolutions({
    solutions,
    loading,
    noPriceData
}: {
    solutions: Solution[];
    loading: boolean;
    noPriceData?: boolean;
}) {
    const ratingColumns = useMemo(() => {
        const allRatings = solutions.flatMap((sol) =>
            sol.squad.map((player) => player.rating)
        );
        const minRating = Math.min(...allRatings);
        const maxRating = Math.max(...allRatings);
        return range(minRating, maxRating);
    }, [solutions]);
    const tableVariant = useColorModeValue("striped", "simple");

    const eventTracker = useEventTracker("Solutions");

    const emptyArray = useMemo(() => Array.from({ length: 10 }), []);

    return (
        <>
            <Fade in={!loading}>
                <MutedSmall>
                    Each row represents how many players of each rating you need
                    to acquire to reach the target rating
                </MutedSmall>
            </Fade>

            <Card>
                <CardBody>
                    {!loading && noPriceData && (
                        <Flex pb={4} justifyContent="end">
                            <Badge colorScheme="red">
                                <Flex
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={1}>
                                    <Icon path={mdiAlertCircleOutline} size={0.7} />
                                    <span>Price data missing</span>
                                </Flex>
                            </Badge>
                        </Flex>
                    )}
                    <TableContainer>
                        <Table
                            variant={loading ? "simple" : tableVariant}
                            size="sm">
                            <Thead>
                                {!loading && (
                                    <Tr>
                                        {ratingColumns.map((rating) => (
                                            <Th key={rating} textAlign="center">
                                                <ExternalLink
                                                    // Note: prices are sorted by ps (console) prices
                                                    href={`https://www.futbin.com/players?order=asc&player_rating=${rating}-${rating}&ps_price=200-15000000&sort=ps_price`}>
                                                    <span
                                                        onClick={() =>
                                                            eventTracker(
                                                                "click_futbin_link",
                                                                "click_link=" +
                                                                    rating,
                                                                rating
                                                            )
                                                        }>
                                                        {rating}
                                                    </span>
                                                </ExternalLink>
                                            </Th>
                                        ))}
                                        {!noPriceData && (
                                            <Th textAlign="right">Price</Th>
                                        )}
                                    </Tr>
                                )}
                            </Thead>
                            <Tbody>
                                {loading &&
                                    emptyArray.map((_, i) => (
                                        <Tr key={i}>
                                            <Td
                                                colSpan={
                                                    ratingColumns.length + 1
                                                }>
                                                <Skeleton height="1.2rem" />
                                            </Td>
                                        </Tr>
                                    ))}
                                {!loading &&
                                    solutions.map((solution, i) => (
                                        <Tr key={i}>
                                            {ratingColumns.map((rating) => {
                                                const count =
                                                    solution.squad.find(
                                                        (player) =>
                                                            player.rating ===
                                                            rating
                                                    )?.count || 0;
                                                return (
                                                    <Td
                                                        key={rating}
                                                        textAlign="center"
                                                        color={
                                                            count === 0
                                                                ? "gray.500"
                                                                : undefined
                                                        }
                                                        bg={
                                                            i % 2 === 0
                                                                ? "gray.800"
                                                                : undefined
                                                        }>
                                                        {count || "-"}
                                                    </Td>
                                                );
                                            })}

                                            {!noPriceData && (
                                                <Td
                                                    textAlign="right"
                                                    bg={
                                                        i % 2 === 0
                                                            ? "gray.800"
                                                            : undefined
                                                    }>
                                                    {prettyNumber(
                                                        solution.price
                                                    )}
                                                </Td>
                                            )}
                                        </Tr>
                                    ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </CardBody>
            </Card>
        </>
    );
}
