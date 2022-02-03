import React from "react";
import Form from "react-bootstrap/Form";
import IRatingOption from "../interfaces/RatingOption.interface";
import RatingSelect, { ActionMeta } from "./RatingSelect";
import Config from "../Config";

interface IExistingRatingsInputProps {
	value: IRatingOption[];
	onChange: (newValues: IRatingOption[] | undefined) => void;
}

export default function ExistingRatingsInput({
	value,
	onChange
}: IExistingRatingsInputProps) {
	const handleExistingRatingsChange = (
		newValue: IRatingOption,
		actionMeta: ActionMeta<IRatingOption>
	) => {
		console.log({ newValue, actionMeta });
		let newSelections: IRatingOption[] = [];
		switch (actionMeta.action) {
			case "select-option":
				const added: IRatingOption = {
					label: actionMeta.option?.label || "",
					ratingValue: actionMeta.option?.ratingValue || -1
				};
				newSelections = [...value, added];
				break;
			case "remove-value":
				newSelections = [...value];
				const index = newSelections.findIndex(
					(rating) =>
						rating.ratingValue === actionMeta.removedValue?.ratingValue
				);
				newSelections.splice(index, 1);
				break;
			case "clear":
				break;
			default:
				break;
		}
		onChange(newSelections.length === 0 ? undefined : newSelections);
	};

	return (
		<Form.Group>
			<Form.Label>Existing Player Ratings</Form.Label>
			<RatingSelect
				placeholder="Select multiple..."
				value={value}
				onChange={handleExistingRatingsChange}
				options={Config.ratingOptions}
				isMulti
				maxNumberOfValues={Config.playersInSquad - 1}
			/>
			<Form.Text muted>
				Specify the ratings of the <abbr title="fodder">players</abbr> you
				already possess and plan to use in the SBC
			</Form.Text>
		</Form.Group>
	);
}
