import ExternalLink from "@/components/ui/ExternalLink";
import MutedSmall from "@/components/ui/MutedSmall";
import { useEventTracker } from "@/hooks/useEventTracker";
import { Solution } from "@/types/solution.interface";
import { prettyNumber, range } from "@/utilities";
import {
    Card,
    CardBody,
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
import { useMemo } from "react";

export default function TableSolutions({
    solutions,
    loading
}: {
    solutions: Solution[];
    loading: boolean;
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
            <MutedSmall>
                Each row represents how many players of each rating you need to
                acquire to reach the target rating
            </MutedSmall>
            <Card>
                <CardBody>
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
                                                                "click_futbin_link=" +
                                                                    rating,
                                                                rating.toString()
                                                            )
                                                        }>
                                                        {rating}
                                                    </span>
                                                </ExternalLink>
                                            </Th>
                                        ))}
                                        <Th textAlign="right">Coins</Th>
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

                                            <Td
                                                textAlign="right"
                                                bg={
                                                    i % 2 === 0
                                                        ? "gray.800"
                                                        : undefined
                                                }>
                                                {prettyNumber(solution.price)}
                                            </Td>
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
