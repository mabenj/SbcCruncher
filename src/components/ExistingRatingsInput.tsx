import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Select, { MultiValue, ActionMeta } from "react-select";
import IRatingOption from "../interfaces/RatingOption.interface";

interface IExistingRatingsInputProps {
	ratingOptions: IRatingOption[];
	onChange: (newValues: IRatingOption[]) => void;
}

export default function ExistingRatingsInput({
	ratingOptions,
	onChange
}: IExistingRatingsInputProps) {
	const [allRatings, setAllRatings] = useState<IRatingOption[]>(ratingOptions);
	const [existingRatings, setExistingRatings] = useState<IRatingOption[]>([]);

	useEffect(() => {
		onChange(existingRatings);
	}, [existingRatings, onChange]);

	const handleExistingRatingsChange = (
		newValues: MultiValue<IRatingOption>,
		actionMeta: ActionMeta<IRatingOption>
	) => {
		switch (actionMeta.action) {
			case "select-option":
				const added: IRatingOption = {
					value: actionMeta.option?.value || -1,
					label: actionMeta.option?.label || "",
					ratingValue: actionMeta.option?.ratingValue || -1
				};
				setExistingRatings((prev) => [...prev, added]);
				setAllRatings((prev) => [
					...prev,
					{
						...added,
						value: Math.random()
					}
				]);
				break;
			case "remove-value":
				const removed: IRatingOption = {
					value: actionMeta.removedValue?.value || -1,
					label: actionMeta.removedValue?.label || "",
					ratingValue: actionMeta.removedValue?.ratingValue || -1
				};
				setExistingRatings((prev) =>
					prev.filter((prevOption) => prevOption.value !== removed.value)
				);
				setAllRatings((prev) =>
					prev.filter((prevOption) => prevOption.value !== removed.value)
				);
				break;
			case "clear":
				setExistingRatings([]);
				setAllRatings(ratingOptions);
				break;
			default:
				break;
		}
	};

	return (
		<Form.Group>
			<Form.Label>Existing Player Ratings</Form.Label>
			<Select
				placeholder="86 86 84 83 ..."
				value={existingRatings}
				onChange={handleExistingRatingsChange}
				options={allRatings.sort((a, b) => a.ratingValue - b.ratingValue)}
				isMulti
			/>
			<Form.Text muted>
				Specify the ratings of the players you already posess and wish to use in
				the SBC
			</Form.Text>
		</Form.Group>
	);
}
