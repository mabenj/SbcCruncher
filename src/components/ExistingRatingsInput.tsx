import React from "react";
import Form from "react-bootstrap/Form";
import IRatingOption from "../interfaces/RatingOption.interface";
import RatingSelect from "./RatingSelect";
import Config from "../Config";

interface IExistingRatingsInputProps {
	value: IRatingOption[];
	onChange: (newValues: IRatingOption[] | undefined) => void;
}

export default function ExistingRatingsInput({
	value,
	onChange
}: IExistingRatingsInputProps) {
	const handleChange = (newOptions: IRatingOption[]) => {
		const newSelectedOptions: IRatingOption[] = newOptions.map((opt) => ({
			...opt,
			value: Math.random()
		}));
		onChange(newSelectedOptions);
	};

	return (
		<Form.Group>
			<Form.Label>Existing Player Ratings</Form.Label>
			<RatingSelect
				placeholder="Select multiple..."
				value={value}
				onChange={handleChange}
				options={Config.ratingOptions}
				isMulti
				maxNumberOfValues={Config.playersInSquad - 1}
			/>
			<Form.Text muted>
				Specify the ratings of the players you already possess and plan to use
				in the SBC <em>(aka fodder)</em>
			</Form.Text>
		</Form.Group>
	);
}
