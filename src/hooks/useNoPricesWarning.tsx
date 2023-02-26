import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

export default function useNoPricesWarning() {
    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useLocalStorage(
        "dontShowNoPricesWarning",
        false
    );

    const onWarningOpen = () => {
        setIsWarningOpen(true);
    };

    const onWarningClose = (dontShowAgain: boolean) => {
        setDontShowAgain(dontShowAgain);
        setIsWarningOpen(false);
    };

    return {
        isWarningOpen,
        shouldDisplayWarning: !dontShowAgain,
        onWarningOpen,
        onWarningClose
    };
}
