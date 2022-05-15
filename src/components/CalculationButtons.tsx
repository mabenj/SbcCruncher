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
                className="mx-1 p-button-raised"
                disabled={disabled}
                icon={
                    <>
                        <i className="fas fa-calculator"></i>&nbsp;
                    </>
                }
                loading={isCalculating}
                loadingIcon={
                    <>
                        <Spinner.Hourglass />
                        &nbsp; &nbsp;
                    </>
                }
                tooltip={isCalculating ? undefined : "Start calculation"}
                tooltipOptions={{ position: "top" }}></Button>
            <Button
                label="Stop"
                className="mx-1 p-button-danger p-button-raised"
                disabled={!isCalculating}
                onClick={handleStop}
                icon={
                    <>
                        <i className="fas fa-ban"></i>&nbsp;
                    </>
                }
                tooltip={"Stop calculation"}
                tooltipOptions={{ position: "top" }}></Button>
        </span>
    );
}
