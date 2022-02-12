import React from "react";
import Spinner from "./Spinner";
import { Button } from "primereact/button";

interface ICalculationButtonsProps {
	disabled: boolean;
	isCalculating: boolean;
	onStopPressed: () => void;
}

export function CalculationButtons({
	disabled,
	isCalculating,
	onStopPressed
}: ICalculationButtonsProps) {
	const handleStop = (e: React.MouseEvent) => {
		e.preventDefault();
		onStopPressed();
	};

	return (
		<>
			<Button
				type="submit"
				label={isCalculating ? "Calculating..." : "Calculate"}
				className="p-mx-1 p-button-raised"
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
				className="p-mx-1 p-button-danger p-button-raised"
				disabled={!isCalculating}
				onClick={handleStop}
				icon={
					<>
						<i className="fas fa-ban"></i>&nbsp;
					</>
				}
				tooltip={"Stop calculation"}
				tooltipOptions={{ position: "top" }}></Button>
		</>
	);
}
