import React, { useState, useRef } from "react";
import {
	AutoComplete,
	AutoCompleteChangeParams
} from "primereact/autocomplete";

import "../styles/MultiRatingSelect.scss";
import Config from "../Config";
import { useIsMobile } from "../hooks";

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
	const autoCompleteRef = useRef<AutoComplete>(null);
	const [originalOptions] = useState<IOption[]>(
		Config.allRatings.map((r, i) => ({ rating: r.toString(), index: i }))
	);
	const [suggestions, setSuggestions] = useState(originalOptions);
	const [isMobile] = useIsMobile();

	const formattedValues: IOption[] | undefined =
		value?.map((val, i) => ({ rating: val.toString(), index: i })) || [];

	const searchOptions = (query: string) => {
		const filtered = originalOptions.filter((opt) =>
			opt.rating.startsWith(query)
		);
		setSuggestions(filtered);
	};

	const handleSelect = (e: AutoCompleteChangeParams) => {
		if ((value?.length || 0) >= Config.playersInSquad) {
			return;
		}
		onChange([...(value || []), Number(e.value.rating)]);
	};

	const handleUnselect = (e: AutoCompleteChangeParams) => {
		const newValues = formattedValues.filter(
			(val) => val.index !== e.value.index
		);
		onChange(newValues.map((nv) => Number(nv.rating)));
	};

	return (
		<AutoComplete
			ref={autoCompleteRef}
			multiple
			forceSelection
			dropdown
			field="rating"
			value={formattedValues.length > 0 ? formattedValues : undefined}
			suggestions={
				(value?.length || 0) >= Config.playersInSquad ? undefined : suggestions
			}
			completeMethod={(e) => searchOptions(e.query)}
			onSelect={handleSelect}
			onUnselect={handleUnselect}
			scrollHeight="400px"
			// @ts-ignore
			onClick={(e) => autoCompleteRef.current?.onDropdownClick(e, "")}
			readOnly={isMobile}
		/>
	);
};
