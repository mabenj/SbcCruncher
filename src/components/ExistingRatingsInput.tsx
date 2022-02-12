import React from "react";
import { MultiRatingSelect } from "./";

interface IExistingRatingsInputProps {
	value: number[];
	onChange: (newValues: number[] | undefined) => void;
}

export function ExistingRatingsInput({
	value,
	onChange
}: IExistingRatingsInputProps) {
	return (
		<div className="p-field">
			<span className="p-float-label p-fluid">
				<MultiRatingSelect
					value={value.length > 0 ? value : undefined}
					onChange={onChange}
				/>
				<label htmlFor="existingRatings">Existing Player Ratings</label>
			</span>
			<small>
				Specify the ratings of the players you already possess and plan to use
				in the SBC <em>(aka fodder)</em>
			</small>
		</div>
	);
}
