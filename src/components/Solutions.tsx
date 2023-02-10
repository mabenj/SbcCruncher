import {
    Box,
    Card,
    CardBody,
    Heading,
    SimpleGrid,
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
import AccentedCard from "./ui/AccentedCard";

const NUMBER_FORMATTER = new Intl.NumberFormat();

const SOLUTIONS = [
    {
        price: 42000,
        ratings: [
            { rating: 83, count: 3 },
            { rating: 86, count: 2 },
            { rating: 89, count: 1 }
        ]
    },
    {
        price: 55100,
        ratings: [
            { rating: 81, count: 5 },
            { rating: 89, count: 1 }
        ]
    },
    {
        price: 55500,
        ratings: [
            { rating: 80, count: 1 },
            { rating: 86, count: 4 },
            { rating: 87, count: 3 }
        ]
    },
    {
        price: 69000,
        ratings: [
            { rating: 84, count: 3 },
            { rating: 85, count: 2 },
            { rating: 89, count: 1 }
        ]
    },
    {
        price: 71800,
        ratings: [
            { rating: 80, count: 3 },
            { rating: 81, count: 2 },
            { rating: 83, count: 1 },
            { rating: 84, count: 1 },
            { rating: 86, count: 1 },
            { rating: 87, count: 1 },
            { rating: 92, count: 1 }
        ]
    },
    {
        price: 180200,
        ratings: [
            { rating: 82, count: 3 },
            { rating: 84, count: 2 },
            { rating: 85, count: 1 }
        ]
    },
    {
        price: 2200500,
        ratings: [
            { rating: 85, count: 3 },
            { rating: 86, count: 2 },
            { rating: 89, count: 1 }
        ]
    }
];

export default function Solutions() {
    const solutionsCount = 189883;
    const solutions = SOLUTIONS.sort((a, b) => a.price - b.price);

    return (
        <>
            <Box mx={3}>
                <Heading>Solutions</Heading>
                <Stat mt={6}>
                    <StatLabel>Total Found</StatLabel>
                    <StatNumber>
                        {NUMBER_FORMATTER.format(solutionsCount)}
                    </StatNumber>
                    <StatHelpText>
                        Cheapest{" "}
                        {NUMBER_FORMATTER.format(solutions.at(0)?.price || 0)}{" "}
                        coins
                    </StatHelpText>
                </Stat>
            </Box>
            <SimpleGrid minChildWidth="15.5rem" spacing={5} mt={10}>
                {solutions.map((solution, i) => (
                    <Card key={i}>
                        <CardBody>
                            <Heading size="sm">Solution {i + 1}</Heading>
                            <Box>
                                {NUMBER_FORMATTER.format(solution.price)} coins
                            </Box>
                            <TableContainer mt={4}>
                                <Table size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th textAlign="center">Rating</Th>
                                            <Th textAlign="center">Quantity</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {solution.ratings.map(
                                            ({ rating, count }) => (
                                                <Tr key={rating}>
                                                    <Td textAlign="center">
                                                        {rating}
                                                    </Td>
                                                    <Td textAlign="center">
                                                        {count}
                                                    </Td>
                                                </Tr>
                                            )
                                        )}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>
        </>
    );
}
