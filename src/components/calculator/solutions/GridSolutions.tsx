import { range } from "@/common/utilities";
import MutedSmall from "@/components/ui/MutedSmall";
import { Solution } from "@/types/solution.interface";
import { Fade, SimpleGrid } from "@chakra-ui/react";
import SolutionCard from "./SolutionCard";

export default function GridSolutions({
    solutions,
    loading,
    pageIndex,
    pageSize,
    noPriceData,
    cheapestPrice
}: {
    solutions: Solution[];
    loading: boolean;
    pageIndex: number;
    pageSize: number;
    noPriceData: boolean;
    cheapestPrice?: number;
}) {
    return (
        <>
            <Fade in={!loading}>
                <MutedSmall>
                    Each solution shows you how many players of each rating you
                    need to acquire to reach the target rating
                </MutedSmall>
            </Fade>

            <SimpleGrid minChildWidth="15.5rem" spacing={5}>
                {loading &&
                    range(0, 11).map((i) => (
                        <SolutionCard
                            key={"skeleton_" + i}
                            label={"Solution " + (i + 1)}
                        />
                    ))}
                {!loading &&
                    solutions.map((solution, i) => (
                        <SolutionCard
                            key={"solution_" + i}
                            label={
                                "Solution " + (pageIndex * pageSize + (i + 1))
                            }
                            solution={solution}
                            noPriceData={noPriceData}
                            isCheapest={
                                noPriceData && solution.price === cheapestPrice
                            }
                        />
                    ))}
            </SimpleGrid>
        </>
    );
}
