import { useConfig } from "@/context/ConfigContext";
import { range } from "@/utilities";
import { useMemo, useState } from "react";
import useLocalStorage from "./useLocalStorage";

export default function useNoPricesWarning() {
    const [config] = useConfig();
    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useLocalStorage(
        "dontShowNoPricesWarning",
        false
    );
    const [warningShown, setWarningShown] = useState(false);

    const allZeroes = useMemo(() => {
        const ratingRange = range(
            config.tryRatingMinMax[0],
            config.tryRatingMinMax[1]
        );
        return ratingRange.every((rating) => !config.ratingPriceMap[rating]);
    }, [config.tryRatingMinMax, config.ratingPriceMap]);

    const onWarningOpen = () => {
        setIsWarningOpen(true);
    };

    const onWarningClose = (
        shouldContinue: boolean,
        dontShowAgain: boolean
    ) => {
        setDontShowAgain(dontShowAgain);
        setIsWarningOpen(false);
        if (shouldContinue) {
            setWarningShown(true);
        }
    };

    return {
        isWarningOpen,
        shouldDisplayWarning: allZeroes &&
            !dontShowAgain && !warningShown && !config.pricesDisabled,
        onWarningOpen,
        onWarningClose
    };
}
