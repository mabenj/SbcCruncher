import { Button } from "primereact/button";
import { Message } from "primereact/message";
import React from "react";
import { useAnalytics } from "../hooks/useAnalytics";
import Spinner from "./Spinner";

interface ICalculationButtonsProps {
    disabled: boolean;
    isCalculating: boolean;
    onStopPressed: () => void;
    className?: string;
    errorMessage?: string;
}

export function CalculationButtons({
    disabled,
    isCalculating,
    onStopPressed,
    className,
    errorMessage
}: ICalculationButtonsProps) {
    const { event } = useAnalytics();

    const handleStop = (e: React.MouseEvent) => {
        e.preventDefault();
        onStopPressed();
        event({ category: "SOLVER", action: "STOP" });
    };

    return (
        <div className="px-3">
            <div className={`flex flex-wrap gap-3 ${className}`}>
                <Button
                    type="submit"
                    label={isCalculating ? "Calculating" : "Calculate"}
                    className="mr-2 p-button-raised text-xl w-full md:w-auto mx-2 md:mx-0"
                    disabled={disabled}
                    icon={
                        <div className="mr-2">
                            <i className="fas fa-calculator"></i>
                        </div>
                    }
                    loading={isCalculating}
                    loadingIcon={
                        <div className="mr-3">
                            <Spinner.Hourglass />
                        </div>
                    }
                    tooltip={isCalculating ? undefined : "Start calculation"}
                    tooltipOptions={{
                        position: "top",
                        showDelay: 500
                    }}></Button>
                <Button
                    label="Stop"
                    className="p-button-danger p-button-raised text-xl w-full md:w-auto mx-2 md:mx-0"
                    disabled={!isCalculating}
                    onClick={handleStop}
                    icon={
                        <div className="mr-2">
                            <i className="pi pi-ban"></i>
                        </div>
                    }
                    tooltip={"Stop calculation"}
                    tooltipOptions={{
                        position: "top",
                        showDelay: 500
                    }}></Button>
            </div>
            <div
                className="my-4 flex justify-content-center md:block"
                style={{ visibility: errorMessage ? "visible" : "hidden" }}>
                <Message
                    severity="warn"
                    text={errorMessage}
                    className="p-3"></Message>
            </div>
        </div>
    );
}
