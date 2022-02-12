import React, { useState } from "react";
import {
	AutoComplete,
	AutoCompleteCompleteMethodParams,
	AutoCompleteChangeParams
} from "primereact/autocomplete";

import "../styles/MultiRatingSelect.scss";
import Config from "../Config";

interface IOption {
	rating: string;
	index: number;
}

interface IMultiRatingSelectProps {
	value: number[] | undefined;
	onChange: (newValue: number[]) => void;
}

export const MultiRatingSelect = ({
	value,
	onChange
}: IMultiRatingSelectProps) => {
	const [originalOptions] = useState<IOption[]>(
		Config.allRatings.map((r, i) => ({ rating: r.toString(), index: i }))
	);
	const [suggestions, setSuggestions] = useState(originalOptions);

	const formattedValues: IOption[] | undefined =
		value?.map((val, i) => ({ rating: val.toString(), index: i })) || [];

	const searchOptions = (e: AutoCompleteCompleteMethodParams) => {
		const filtered = originalOptions.filter((opt) =>
			opt.rating.startsWith(e.query)
		);
		setSuggestions(filtered);
	};

	const handleSelect = (e: AutoCompleteChangeParams) => {
		if ((value?.length || 0) >= Config.playersInSquad) {
			return;
		}
		console.log("select", e);
		onChange([...(value || []), Number(e.value.rating)]);
	};

	const handleUnselect = (e: AutoCompleteChangeParams) => {
		const newValues = formattedValues.filter(
			(val) => val.index !== e.value.index
		);
		console.log("unselect", { oldValues: formattedValues, newValues, e });
		onChange(newValues.map((nv) => Number(nv.rating)));
	};

	return (
		<AutoComplete
			multiple
			forceSelection
			dropdown
			dropdownMode="current"
			field="rating"
			value={formattedValues.length > 0 ? formattedValues : undefined}
			suggestions={
				(value?.length || 0) >= Config.playersInSquad ? undefined : suggestions
			}
			completeMethod={searchOptions}
			onSelect={handleSelect}
			onUnselect={handleUnselect}
			scrollHeight="400px"
		/>
	);
};
