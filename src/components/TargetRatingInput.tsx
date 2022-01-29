import React from "react";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import IRatingOption from "../interfaces/RatingOption.interface";

interface ITargetRatingInputProps {
	ratingOptions: IRatingOption[];
	onChange: (newRating: IRatingOption) => void;
}

export default function TargetRatingInput({
	ratingOptions,
	onChange
}: ITargetRatingInputProps) {
	return (
		<Form.Group>
			<Form.Label>Squad Target Rating</Form.Label>
			<Select
				placeholder="86"
				onChange={(newVal) =>
					onChange({
						value: newVal?.value || -1,
						label: newVal?.label || "",
						ratingValue: newVal?.ratingValue || -1
					})
				}
				options={ratingOptions}
			/>
		</Form.Group>
	);
}
