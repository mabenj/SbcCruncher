import { prettyNumber } from "@/common/utilities";
import { Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";

export default function SolutionsStats({
    found,
    loading,
    cheapestPrice
}: {
    found: number;
    loading: boolean;
    cheapestPrice?: number;
}) {
    return (
        <Stat mt={6}>
            <StatLabel px={2}>Total Found</StatLabel>
            <StatNumber borderLeft="3px solid" borderColor="brand.500" px={1}>
                {prettyNumber(found)}
            </StatNumber>
            <StatHelpText
                px={2}
                visibility={
                    !loading && cheapestPrice != null ? "visible" : "hidden"
                }>
                <span>Cheapest {prettyNumber(cheapestPrice)} coins</span>
            </StatHelpText>
        </Stat>
    );
}
