import PrimeReact from "primereact/api";
import { ScrollTop } from "primereact/scrolltop";
import React, { useEffect, useState } from "react";
import Config from "../Config";
import { useAnalytics } from "../hooks/useAnalytics";
import { useSolver } from "../hooks/useSolver";
import { range } from "../util/utils";
import ConfigurationForm from "./ConfigurationForm";
import { Container } from "./Container";
import { Footer } from "./Footer";
import { Header } from "./Header";
import ProgressBar from "./ProgressBar";
import { Solutions } from "./Solutions";
PrimeReact.ripple = true;

function App() {
    const { pageView } = useAnalytics();

    const [solverState, calculate, stopSolver, fetchSolutions, resetState] =
        useSolver();

    const [solutionColumns, setSolutionColumns] = useState<number[]>(
        range(Config.defaultTryMin, Config.defaultTryMax)
    );

    useEffect(() => {
        pageView(window.location.pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const configChanged = () => {
        resetState();
    };

    return (
        <>
            <Container>
                <Header />

                <ConfigurationForm
                    calculate={calculate}
                    configChanged={configChanged}
                    stopPressed={() => stopSolver()}
                    tryBoundsChanged={(newBounds) =>
                        setSolutionColumns(range(newBounds[0], newBounds[1]))
                    }
                    isCalculating={solverState.isCalculating}
                />

                <Solutions
                    displaySolutions={solverState.solutions}
                    columnDefinitions={solutionColumns}
                    totalSolutionsCount={solverState.solutionsCount}
                    fetchMoreSolutions={fetchSolutions}
                    isCalculating={solverState.isCalculating}
                />

                <Footer />
            </Container>

            <ScrollTop threshold={Config.scrollToTopThreshold} />
            <ProgressBar
                percent={solverState.progressPercent}
                hidden={!solverState.isCalculating}
            />
        </>
    );
}

export default App;
