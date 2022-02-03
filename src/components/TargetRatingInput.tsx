import React from "react";
import Form from "react-bootstrap/Form";
import Config from "../Config";
import IRatingOption from "../interfaces/RatingOption.interface";
import RatingSelect from "./RatingSelect";

interface ITargetRatingInputProps {
	value: IRatingOption | undefined;
	onChange: (newRating: IRatingOption) => void;
}

export default function TargetRatingInput({
	value,
	onChange
}: ITargetRatingInputProps) {
	return (
		<Form.Group>
			<Form.Label>Squad Target Rating</Form.Label>
			<RatingSelect
				placeholder="Select..."
				value={value}
				onChange={(newVal) =>
					onChange({
						label: newVal?.label || "",
						ratingValue: newVal?.ratingValue || -1
					})
				}
				options={Config.ratingOptions}
			/>
			<Form.Text muted>Specify the desired squad rating</Form.Text>
		</Form.Group>
	);
}
