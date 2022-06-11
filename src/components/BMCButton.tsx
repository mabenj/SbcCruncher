import { Button } from "primereact/button";
import React from "react";
import { useAnalytics } from "../hooks/useAnalytics";

interface IBMCButtonProps {
    width: number;
    btnLocation?: string;
}

export default function BMCButton({ width, btnLocation }: IBMCButtonProps) {
    const { event } = useAnalytics();
    return (
        <Button
            className="p-0 p-button-text bmc-btn"
            tooltip="Support SBC Cruncher"
            tooltipOptions={{ position: "bottom" }}
            onClick={() => {
                event({
                    category: "BMC",
                    action: "CLICK_BMC",
                    details: { location: btnLocation }
                });
                window.open("https://www.buymeacoffee.com/mabenj", "_blank");
            }}>
            <div className="flex justify-content-center">
                <img
                    src="/BMC-btn-yellow.png"
                    alt="Buy me a coffee"
                    width={width}
                />
            </div>
        </Button>
    );
}
