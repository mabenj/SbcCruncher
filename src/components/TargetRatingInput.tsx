import React from "react";
import Config from "../Config";
import { IRatingOption } from "../interfaces";
import { RatingSelect } from "./";

interface ITargetRatingInputProps {
	value: IRatingOption | undefined;
	onChange: (newRating: IRatingOption) => void;
}

export function TargetRatingInput({
	value,
	onChange
}: ITargetRatingInputProps) {
	return (
		<div className="p-field">
			<label htmlFor="targetRating">Squad Target Rating</label>
			<RatingSelect
				placeholder="Select..."
				value={value}
				onChange={(newVal) =>
					onChange({
						value: newVal?.value || -1,
						label: newVal?.label || "",
						ratingValue: newVal?.ratingValue || -1
					})
				}
				options={Config.ratingOptions}
			/>
			<small>Specify the desired squad rating</small>
		</div>
	);
}
