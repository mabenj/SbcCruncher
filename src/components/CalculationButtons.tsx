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
				className="p-button-raised"
				title="Calculate"
				disabled={disabled}
				loading={isCalculating}>
				{isCalculating ? (
					<>
						<Spinner.Hourglass />
						&nbsp;
					</>
				) : (
					<>
						<i className="fas fa-calculator"></i>&nbsp;
					</>
				)}
			</Button>
			<Button
				label="stop"
				className="p-m-2 p-button-danger p-button-raised"
				title="Stop calculation"
				disabled={!isCalculating}
				onClick={handleStop}>
				<i className="fas fa-ban"></i>&nbsp;
			</Button>
		</>
	);
}
