import React, { useState, useRef, useEffect } from "react";
import {
	AutoComplete,
	AutoCompleteCompleteMethodParams
} from "primereact/autocomplete";
import { useIsMobile } from "../hooks";

import "../styles/SingleRatingSelect.scss";

interface ISingleRatingSelectProps {
	ratings: number[];
	value: number | undefined;
	onChange: (newValue: number | undefined) => void;
}

export const SingleRatingDropdown = ({
	ratings,
	value,
	onChange
}: ISingleRatingSelectProps) => {
	const autoCompleteRef = useRef<AutoComplete>(null);
	const [originalRatings] = useState(ratings.map((r) => r.toString()));
	const [options, setOptions] = useState(originalRatings);
	const [currentValue, setCurrentValue] = useState(value);
	const [isMobile] = useIsMobile();

	useEffect(() => setCurrentValue(value), [value]);

	const searchOptions = (e: AutoCompleteCompleteMethodParams) => {
		const filtered = originalRatings.filter((opt) => opt.startsWith(e.query));
		setOptions(filtered);
	};

	const itemTemplate = (data: number) => {
		const color = data > 74 ? "golden" : data > 64 ? "silver" : "bronze";
		return <span className={`card card-${color}`}>{data}</span>;
	};

	const selectedItemTemplate = (data: any) => {
		return <p>asd</p>;
	};

	return (
		<AutoComplete
			ref={autoCompleteRef}
			forceSelection
			dropdown
			dropdownMode="blank"
			value={currentValue}
			suggestions={options}
			completeMethod={searchOptions}
			onChange={(e) => setCurrentValue(e.value)}
			onSelect={(e) => onChange(e.value)}
			onBlur={() => {
				if (!originalRatings.find((r) => r === currentValue?.toString())) {
					setCurrentValue(value);
				}
			}}
			scrollHeight="400px"
			readOnly={isMobile}
			itemTemplate={itemTemplate}
			selectedItemTemplate={selectedItemTemplate}
			// @ts-ignore
			onClick={(e) => autoCompleteRef.current?.onDropdownClick(e, "")}
		/>
	);
};
