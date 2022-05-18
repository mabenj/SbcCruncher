import { Button } from "primereact/button";
import React from "react";
import Spinner from "./Spinner";

interface ICalculationButtonsProps {
    disabled: boolean;
    isCalculating: boolean;
    onStopPressed: () => void;
    className?: string;
}

export function CalculationButtons({
    disabled,
    isCalculating,
    onStopPressed,
    className
}: ICalculationButtonsProps) {
    const handleStop = (e: React.MouseEvent) => {
        e.preventDefault();
        onStopPressed();
    };

    return (
        <span className={className}>
            <Button
                type="submit"
                label={isCalculating ? "Calculating..." : "Calculate"}
                className="mr-2 p-button-raised text-xl"
                disabled={disabled}
                icon={
                    <div className="mr-2">
                        <i className="fas fa-calculator"></i>
                    </div>
                }
                loading={isCalculating}
                loadingIcon={
                    <div className="mr-2">
                        <Spinner.Hourglass />
                    </div>
                }
                tooltip={isCalculating ? undefined : "Start calculation"}
                tooltipOptions={{ position: "top", showDelay: 500 }}></Button>
            <Button
                label="Stop"
                className="p-button-danger p-button-raised text-xl"
                disabled={!isCalculating}
                onClick={handleStop}
                icon={
                    <div className="mr-2">
                        <i className="pi pi-ban"></i>
                    </div>
                }
                tooltip={"Stop calculation"}
                tooltipOptions={{ position: "top", showDelay: 500 }}></Button>
        </span>
    );
}
