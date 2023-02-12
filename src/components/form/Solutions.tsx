import { useConfig } from "@/context/ConfigContext";
import { useEventTracker } from "@/hooks/useEventTracker";
import { useSolver } from "@/hooks/useSolver";
import { Solution } from "@/types/solution.interface";
import { range } from "@/utilities";
import { NotAllowedIcon } from "@chakra-ui/icons";
import {
    Alert,
    AlertIcon,
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    Flex,
    Heading,
    Progress,
    SimpleGrid,
    Skeleton,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import { mdiCalculator } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import HoverTooltip from "../ui/HoverTooltip";
import MutedSmall from "../ui/MutedSmall";

const NUMBER_FORMATTER = new Intl.NumberFormat();
const PAGE_SIZE = 12;

export default function Solutions() {
    const [pageIndex, setPageIndex] = useState(0);
    const [config] = useConfig();
    const {
        solutions,
        solutionsFound,
        isSolving,
        progress,
        onSolve,
        onStopSolve,
        onClearSolutions
    } = useSolver();

    const eventTracker = useEventTracker("Solutions");

    useEffect(() => {
        if (solutions.length === 0) {
            return;
        }
        onClearSolutions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config]);

    useEffect(() => setPageIndex(0), [isSolving]);

    return (
        <>
            <Flex justifyContent="center" alignItems="center" gap={2}>
                <HoverTooltip label="Calculate the cheapest SBC solution">
                    <Button
                        size="lg"
                        colorScheme="brand"
                        leftIcon={<Icon path={mdiCalculator} size={1} />}
                        loadingText={
                            "Calculating " + Math.floor(progress) + "%"
                        }
                        isDisabled={isSolving || !config.targetRating}
                        isLoading={isSolving}
                        onClick={() => onSolve(config)}>
                        Calculate
                    </Button>
                </HoverTooltip>
                <HoverTooltip label="Stop calculating">
                    <Button
                        size="lg"
                        colorScheme="red"
                        variant="outline"
                        leftIcon={<NotAllowedIcon />}
                        isDisabled={!isSolving}
                        onClick={onStopSolve}>
                        Stop
                    </Button>
                </HoverTooltip>
            </Flex>
            <Box mx={3} pt={10}>
                <Heading>Solutions</Heading>
                {progress === 0 && (
                    <Box mt={3}>
                        <MutedSmall>
                            Press calculate to generate solutions
                        </MutedSmall>
                    </Box>
                )}
                {progress > 0 && (
                    <Stat mt={6}>
                        <StatLabel>Total Found</StatLabel>
                        <StatNumber>
                            {NUMBER_FORMATTER.format(solutionsFound)}
                        </StatNumber>
                        <StatHelpText
                            visibility={
                                !isSolving && solutions.length > 0
                                    ? "visible"
                                    : "hidden"
                            }>
                            <span>
                                Cheapest{" "}
                                {NUMBER_FORMATTER.format(solutions[0]?.price)}{" "}
                                coins
                            </span>
                        </StatHelpText>
                    </Stat>
                )}
            </Box>

            {!isSolving && progress >= 100 && solutionsFound === 0 && (
                <Alert status="error">
                    <AlertIcon />
                    No possible solutions exist. Try again with a different
                    configuration.
                </Alert>
            )}

            <SimpleGrid minChildWidth="15.5rem" spacing={5}>
                {isSolving &&
                    range(0, 5).map((i) => (
                        <SolutionCard
                            key={"skeleton_" + i}
                            label={"Solution " + (i + 1)}
                        />
                    ))}
                {!isSolving &&
                    solutions
                        .slice(
                            pageIndex * PAGE_SIZE,
                            pageIndex * PAGE_SIZE + PAGE_SIZE
                        )
                        .map((solution, i) => (
                            <SolutionCard
                                key={"solution_" + i}
                                label={
                                    "Solution " +
                                    (pageIndex * PAGE_SIZE + (i + 1))
                                }
                                solution={solution}
                                isCheapest={
                                    solution.price === solutions[0].price
                                }
                            />
                        ))}
            </SimpleGrid>

            {!isSolving && solutionsFound > PAGE_SIZE && (
                <Flex justifyContent="center" alignItems="center" gap={10}>
                    <Button
                        isDisabled={pageIndex === 0}
                        colorScheme="gray"
                        onClick={() =>
                            setPageIndex((prev) => {
                                const next = prev - 1;
                                eventTracker("paginate=" + next, next.toString(), next);
                                return next;
                            })
                        }>
                        Prev
                    </Button>
                    <span>Page {pageIndex + 1}</span>
                    <Button
                        isDisabled={
                            pageIndex + 1 >=
                            Math.ceil(solutionsFound / PAGE_SIZE)
                        }
                        colorScheme="gray"
                        onClick={() =>
                            setPageIndex((prev) => {
                                const next = prev + 1;
                                eventTracker("paginate=" + next, next.toString(), next);
                                return next;
                            })
                        }>
                        Next
                    </Button>
                </Flex>
            )}

            {isSolving && (
                <Box position="absolute" top={0} left={0} right={0} p={0} m={0}>
                    <Progress
                        position="fixed"
                        top={0}
                        left={0}
                        right={0}
                        p={0}
                        m={0}
                        size="sm"
                        value={progress}
                        colorScheme="brand"
                    />
                </Box>
            )}
        </>
    );
}

const SolutionCard = ({
    solution,
    label,
    isCheapest
}: {
    solution?: Solution;
    label?: string;
    isCheapest?: boolean;
}) => {
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
                                {NUMBER_FORMATTER.format(solution?.price ?? 0)}{" "}
                                coins
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
                                        <Td textAlign="center">{rating}</Td>
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
};