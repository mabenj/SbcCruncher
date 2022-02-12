import React, { useState } from "react";
import {
	AutoComplete,
	AutoCompleteCompleteMethodParams
} from "primereact/autocomplete";

interface ISingleRatingSelectProps {
	ratings: number[];
	value: number | undefined;
	onChange: (newValue: number) => void;
}

export const SingleRatingSelect = ({
	ratings,
	value,
	onChange
}: ISingleRatingSelectProps) => {
	const [originalRatings] = useState(ratings.map((r) => r.toString()));
	const [options, setOptions] = useState(originalRatings);

	const searchOptions = (e: AutoCompleteCompleteMethodParams) => {
		const filtered = originalRatings.filter((opt) => opt.startsWith(e.query));
		setOptions(filtered);
	};

	return (
		<AutoComplete
			forceSelection
			dropdown
			value={value?.toString()}
			suggestions={options}
			completeMethod={searchOptions}
			onChange={(e) => e.value && onChange(e.value)}
			scrollHeight="400px"
		/>
	);
};
