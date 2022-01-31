import React from "react";
import Button from "react-bootstrap/Button";

interface ICalculationButtonsProps {
	disabled: boolean;
	isCalculating: boolean;
	onStopPressed: () => void;
}

export default function CalculationButtons({
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
				variant="primary"
				title="Calculate"
				disabled={disabled}>
				{isCalculating ? (
					<>
						<div className="lds-hourglass"></div>
						<span className="m-2"> Calculating...</span>
					</>
				) : (
					"Calculate Ratings"
				)}
			</Button>
			<Button
				className="m-2"
				variant="danger"
				title="Stop calculation"
				disabled={!isCalculating}
				onClick={handleStop}>
				Stop
			</Button>
		</>
	);
}
