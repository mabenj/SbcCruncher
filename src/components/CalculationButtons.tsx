import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "./Spinner";

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
						<Spinner.Hourglass />
						<span className="m-2">&nbsp;Calculating...</span>
					</>
				) : (
					<>
						<i className="fas fa-calculator"></i>&nbsp;Calculate Solutions
					</>
				)}
			</Button>
			<Button
				className="m-2"
				variant="danger"
				title="Stop calculation"
				disabled={!isCalculating}
				onClick={handleStop}>
				<i className="fas fa-ban"></i>&nbsp;Stop
			</Button>
		</>
	);
}
