import MutedSmall from "@/components/ui/MutedSmall";
import { Solution } from "@/types/solution.interface";
import { range } from "@/utilities";
import { Fade, SimpleGrid } from "@chakra-ui/react";
import SolutionCard from "./SolutionCard";

export default function GridSolutions({
    solutions,
    loading,
    pageIndex,
    pageSize,
    showPrices
}: {
    solutions: Solution[];
    loading: boolean;
    pageIndex: number;
    pageSize: number;
    showPrices: boolean;
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
                            showPrice={showPrices}
                            isCheapest={
                                showPrices &&
                                solution.price === solutions[0].price
                            }
                        />
                    ))}
            </SimpleGrid>
        </>
    );
}
