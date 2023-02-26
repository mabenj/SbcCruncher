import { MAX_SOLUTIONS_TO_TAKE } from "@/constants";
import { useConfig } from "@/context/ConfigContext";
import { useEventTracker } from "@/hooks/useEventTracker";
import useLocalStorage from "@/hooks/useLocalStorage";
import useNoPricesWarning from "@/hooks/useNoPricesWarning";
import { useSolver } from "@/hooks/useSolver";
import { range } from "@/utilities";
import { NotAllowedIcon } from "@chakra-ui/icons";
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Flex,
    Heading,
    ScaleFade,
    useToast
} from "@chakra-ui/react";
import { mdiCalculator } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useMemo, useState } from "react";
import HoverTooltip from "../../ui/HoverTooltip";
import MutedSmall from "../../ui/MutedSmall";
import GridSolutions from "./GridSolutions";
import NoPricesDialog from "./NoPricesDialog";
import Pagination from "./Pagination";
import ProgressBar from "./ProgressBar";
import SolutionsStats from "./SolutionStats";
import TableGridToggle from "./TableGridToggle";
import TableSolutions from "./TableSolutions";

const PAGE_SIZE = 12;
const TABLE_VIEW_STORAGE_KEY = "solutions.tableView";

export default function Solutions() {
    const [tableView, setTableView] = useLocalStorage(
        TABLE_VIEW_STORAGE_KEY,
        false
    );
    const [pageIndex, setPageIndex] = useState(0);
    const [config] = useConfig();
    const noPrices = useMemo(() => {
        const ratingRange = range(
            config.tryRatingMinMax[0],
            config.tryRatingMinMax[1]
        );
        return ratingRange.every((rating) => !config.ratingPriceMap[rating]);
    }, [config.tryRatingMinMax, config.ratingPriceMap]);

    const {
        solutions,
        solutionsFound,
        isSolving,
        progress,
        onSolve,
        onStopSolve,
        onClearSolutions
    } = useSolver();

    const {
        isWarningOpen,
        shouldDisplayWarning,
        onWarningOpen,
        onWarningClose
    } = useNoPricesWarning();

    const eventTracker = useEventTracker("Solutions");
    const toast = useToast();

    const lastPage = Math.ceil(solutions.length / PAGE_SIZE);

    useEffect(() => {
        if (isSolving) {
            onStopSolve();
            toast({
                status: "error",
                title: "Calculation stopped",
                description: "Configuration changed"
            });
        }
        if (solutionsFound > 0) {
            onClearSolutions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config]);

    useEffect(() => setPageIndex(0), [isSolving]);

    const prevPage = () => {
        setPageIndex((prev) => {
            const next = prev - 1;
            eventTracker("paginate=" + next, next.toString(), next);
            return next;
        });
    };

    const nextPage = () => {
        setPageIndex((prev) => {
            const next = prev + 1;
            eventTracker("paginate=" + next, next.toString(), next);
            return next;
        });
    };

    const calculate = () => {
        const ratingRange = range(
            config.tryRatingMinMax[0],
            config.tryRatingMinMax[1]
        );
        if (
            shouldDisplayWarning &&
            ratingRange.every((rating) => !config.ratingPriceMap[rating])
        ) {
            onWarningOpen();
        } else {
            onSolve(config);
        }
    };

    const noPricesWarningClose = (
        shouldContinue: boolean,
        dontShowAgain: boolean
    ) => {
        eventTracker(
            "dismiss_noprices_dialog",
            `continue=${shouldContinue}|dontShowAgain=${dontShowAgain}`
        );
        onWarningClose(dontShowAgain);
        if (shouldContinue) {
            onSolve(config);
        }
    };

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
                        onClick={calculate}>
                        Calculate
                    </Button>
                </HoverTooltip>
                <HoverTooltip label="Stop calculating">
                    <Button
                        size="lg"
                        colorScheme="red"
                        variant="ghost"
                        leftIcon={<NotAllowedIcon />}
                        isDisabled={!isSolving}
                        onClick={onStopSolve}>
                        Stop
                    </Button>
                </HoverTooltip>
            </Flex>
            <Box mx={3} pt={10}>
                <Heading>Solutions</Heading>

                <ScaleFade in={progress === 0}>
                    <Box mt={3}>
                        <MutedSmall>
                            Step 5 - press Calculate to generate solutions
                        </MutedSmall>
                    </Box>
                </ScaleFade>

                <Flex justifyContent="space-between" alignItems="flex-end">
                    <ScaleFade in={progress > 0}>
                        <SolutionsStats
                            cheapestPrice={
                                noPrices ? undefined : solutions[0]?.price
                            }
                            found={solutionsFound}
                            loading={isSolving}
                        />
                    </ScaleFade>

                    <ScaleFade in={!isSolving && solutionsFound > 0}>
                        <TableGridToggle
                            isTableView={tableView}
                            onSetTableView={() => {
                                setTableView(true);
                                eventTracker("set_table_view=on");
                            }}
                            onSetGridView={() => {
                                setTableView(false);
                                eventTracker("set_table_view=off");
                            }}
                        />
                    </ScaleFade>
                </Flex>
            </Box>

            {!isSolving && progress >= 100 && solutionsFound === 0 && (
                <Alert status="error">
                    <AlertIcon />
                    No possible solutions exist. Try again with a different
                    configuration.
                </Alert>
            )}

            {tableView && (isSolving || (!isSolving && solutionsFound > 0)) && (
                <TableSolutions
                    loading={isSolving}
                    solutions={solutions.slice(
                        pageIndex * PAGE_SIZE,
                        pageIndex * PAGE_SIZE + PAGE_SIZE
                    )}
                    showPriceColumn={!noPrices}
                />
            )}

            {!tableView &&
                (isSolving || (!isSolving && solutionsFound > 0)) && (
                    <GridSolutions
                        loading={isSolving}
                        pageIndex={pageIndex}
                        pageSize={PAGE_SIZE}
                        solutions={solutions.slice(
                            pageIndex * PAGE_SIZE,
                            pageIndex * PAGE_SIZE + PAGE_SIZE
                        )}
                        showPrices={!noPrices}
                    />
                )}

            {!isSolving && solutionsFound > PAGE_SIZE && (
                <Pagination
                    page={pageIndex + 1}
                    lastPage={lastPage}
                    onPrev={prevPage}
                    onNext={nextPage}
                />
            )}

            {!isSolving &&
                pageIndex + 1 >= lastPage &&
                solutionsFound > MAX_SOLUTIONS_TO_TAKE && (
                    <Alert status="warning">
                        <AlertIcon />
                        Only the first {MAX_SOLUTIONS_TO_TAKE} solutions are
                        shown!
                    </Alert>
                )}

            {isSolving && <ProgressBar percent={progress} />}

            <NoPricesDialog
                isOpen={isWarningOpen}
                onClose={noPricesWarningClose}
            />
        </>
    );
}