import { ProgressBar as PrimeProgressBar } from "primereact/progressbar";
import React from "react";

export default function ProgressBar({
    percent,
    hidden
}: {
    percent: number;
    hidden: boolean;
}) {
    return (
        <PrimeProgressBar
            value={percent}
            showValue={false}
            className="fixed top-0 w-full"
            style={{
                height: "4px",
                backgroundColor: "transparent",
                visibility: hidden ? "hidden" : "visible",
                zIndex: 99999
            }}
        />
    );
}
