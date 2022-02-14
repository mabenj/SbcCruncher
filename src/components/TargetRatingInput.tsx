import React from "react";
import Config from "../Config";
import { SingleRatingDropdown } from "./";

interface ITargetRatingInputProps {
	value: number | undefined;
	onChange: (newRating: number | undefined) => void;
}

export function TargetRatingInput({
	value,
	onChange
}: ITargetRatingInputProps) {
	return (
		<div className="p-field">
			<span className="p-float-label p-fluid">
				<SingleRatingDropdown
					ratings={Config.allRatings}
					value={value}
					onChange={onChange}
				/>
				<label htmlFor="targetRating">Squad Target Rating</label>
			</span>
			<small>Specify the desired squad rating</small>
		</div>
	);
}
