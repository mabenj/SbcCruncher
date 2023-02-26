import { useConfig } from "@/context/ConfigContext";
import { prettyNumber, range } from "@/utilities";
import { Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";
import { useMemo } from "react";

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
            <StatLabel>Total Found</StatLabel>
            <StatNumber>{prettyNumber(found)}</StatNumber>
            <StatHelpText
                visibility={
                    !loading && cheapestPrice != null
                        ? "visible"
                        : "hidden"
                }>
                <span>Cheapest {prettyNumber(cheapestPrice)} coins</span>
            </StatHelpText>
        </Stat>
    );
}
