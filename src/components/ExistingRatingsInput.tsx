import React from "react";
import { IRatingOption } from "../interfaces";
import { RatingSelect } from "./";
import Config from "../Config";

interface IExistingRatingsInputProps {
	value: IRatingOption[];
	onChange: (newValues: IRatingOption[] | undefined) => void;
}

export function ExistingRatingsInput({
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
		<div className="p-field">
			<label htmlFor="existingRatings">Existing Player Ratings</label>
			<RatingSelect
				placeholder="Select multiple..."
				value={value}
				onChange={handleChange}
				options={Config.ratingOptions}
				isMulti
				maxNumberOfValues={Config.playersInSquad - 1}
			/>
			<small>
				Specify the ratings of the players you already possess and plan to use
				in the SBC <em>(aka fodder)</em>
			</small>
		</div>
	);
}
