import ExternalLink from "@/components/ui/ExternalLink";
import { useEventTracker } from "@/hooks/useEventTracker";
import { Solution } from "@/types/solution.interface";
import { prettyNumber, range } from "@/utilities";
import {
    Badge,
    Box,
    Card,
    CardBody,
    Flex,
    Heading,
    Skeleton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";

export default function SolutionCard({
    solution,
    label,
    isCheapest
}: {
    solution?: Solution;
    label?: string;
    isCheapest?: boolean;
}) {
    const eventTracker = useEventTracker("Solutions");

    return (
        <Card>
            <CardBody>
                <Flex justifyContent="space-between">
                    <div>
                        <Heading size="sm">{label}</Heading>
                        <Box>
                            <Skeleton
                                w={solution ? "auto" : "8rem"}
                                h={solution ? "auto" : "0.8rem"}
                                mt={1}
                                isLoaded={!!solution}
                                fadeDuration={1}>
                                {prettyNumber(solution?.price ?? 0)} coins
                            </Skeleton>
                        </Box>
                    </div>
                    {isCheapest && (
                        <div>
                            <Badge colorScheme="green">Cheapest</Badge>
                        </div>
                    )}
                </Flex>
                <TableContainer mt={4}>
                    <Table size="sm">
                        <Thead>
                            <Tr>
                                <Th textAlign="center">Rating</Th>
                                <Th textAlign="center">Quantity</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {solution &&
                                solution.squad.map(({ rating, count }) => (
                                    <Tr key={rating}>
                                        <Td textAlign="center">
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
                                        </Td>
                                        <Td textAlign="center">{count}</Td>
                                    </Tr>
                                ))}
                            {!solution &&
                                range(0, 2).map((i) => (
                                    <Tr key={"skeleton_rating_" + i}>
                                        <Td>
                                            <Flex justifyContent="center">
                                                <Skeleton
                                                    w="4ch"
                                                    fadeDuration={1}>
                                                    00
                                                </Skeleton>
                                            </Flex>
                                        </Td>
                                        <Td>
                                            <Flex justifyContent="center">
                                                <Skeleton
                                                    w="2ch"
                                                    fadeDuration={1}>
                                                    00
                                                </Skeleton>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </CardBody>
        </Card>
    );
}
