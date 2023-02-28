import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

export default function useNoPricesWarning() {
    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useLocalStorage(
        "dontShowNoPricesWarning",
        false
    );
    const [warningShown, setWarningShown] = useState(false);

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
        shouldDisplayWarning: !dontShowAgain && !warningShown,
        onWarningOpen,
        onWarningClose
    };
}
