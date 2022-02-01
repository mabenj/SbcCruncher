import React from "react";
import Form from "react-bootstrap/Form";
import IRatingOption from "../interfaces/RatingOption.interface";
import RatingSelect from "./RatingSelect";

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
			<RatingSelect
				onChange={(newVal) =>
					onChange({
						value: newVal?.value || -1,
						label: newVal?.label || "",
						ratingValue: newVal?.ratingValue || -1
					})
				}
				options={ratingOptions}
			/>
			<Form.Text muted>Specify the desired squad rating</Form.Text>
		</Form.Group>
	);
}
