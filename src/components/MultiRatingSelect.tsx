import React, { useEffect, useState } from "react";
import {
	AutoComplete,
	AutoCompleteCompleteMethodParams,
	AutoCompleteChangeParams
} from "primereact/autocomplete";
import { MultiSelect, MultiSelectChangeParams } from "primereact/multiselect";
import { range } from "../util/utils";
import {
	InputNumber,
	InputNumberValueChangeParams
} from "primereact/inputnumber";

import "../styles/MultiRatingSelect.scss";
import Config from "../Config";

interface IMultiRatingSelectProps {
	value: number[] | undefined;
	onChange: (newValue: number[]) => void;
}

export const MultiRatingSelect = ({
	value,
	onChange
}: IMultiRatingSelectProps) => {
	const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>(
		{}
	);
	const [formattedValues, setFormattedValues] = useState<number[]>();

	useEffect(() => {
		if (!value) {
			return;
		}
		const counts: { [key: number]: number } = {};
		for (const rating of value) {
			counts[rating] = counts[rating] ? counts[rating] + 1 : 1;
		}
		setRatingCounts(counts);
		setFormattedValues(Object.keys(counts).map((rating) => Number(rating)));
	}, [value]);

	// const formattedValues: IOption[] | undefined =
	// 	value?.map((val, i) => ({ rating: val.toString(), index: i })) || [];

	// const searchOptions = (e: AutoCompleteCompleteMethodParams) => {
	// 	const filtered = RATINGS.filter((opt) => opt.rating.startsWith(e.query));
	// 	setOptions(filtered);
	// };

	// const handleSelect = (e: AutoCompleteChangeParams) => {
	// 	console.log("select", e);
	// 	onChange([...(value || []), Number(e.value.rating)]);
	// };

	// const handleUnselect = (e: AutoCompleteChangeParams) => {
	// 	const newValues = formattedValues.filter(
	// 		(val) => val.index !== e.value.index
	// 	);
	// 	console.log("unselect", { oldValues: formattedValues, newValues, e });
	// 	onChange(newValues.map((nv) => Number(nv.rating)));
	// };

	const handleChange = (newValue: number[] | null) => {
		if (newValue === null) {
			onChange([]);
		} else {
			const result: number[] = [];
			for (const value of newValue) {
				for (let i = 0; i < ratingCounts[value]; i++) {
					result.push(value);
				}
			}
		}
	};

	const itemTemplate = (opt: number) => {
		const handleValueChange = (e: InputNumberValueChangeParams) => {
			if (!e?.value) {
				setRatingCounts((prev) => {
					const copy = { ...prev };
					delete copy[opt];
					return copy;
				});
			} else {
				const newCount = e.value;
				setRatingCounts((prev) => ({ ...prev, [opt]: newCount }));
			}
		};
		const color = opt > 74 ? "golden" : opt > 64 ? "silver" : "bronze";
		return (
			<span>
				<span className={`card card-${color} p-mr-4`}>{opt}</span>
				<InputNumber
					value={ratingCounts[opt]}
					onValueChange={handleValueChange}
					showButtons
					buttonLayout="horizontal"
					decrementButtonClassName="p-button-secondary"
					incrementButtonClassName="p-button-secondary"
					incrementButtonIcon="pi pi-plus"
					decrementButtonIcon="pi pi-minus"
				/>
			</span>
		);
	};

	const selectedItemTemplate = (opt: number) => {
		if (!opt) {
			return <span>&nbsp;</span>;
		}
		const color = opt > 74 ? "golden" : opt > 64 ? "silver" : "bronze";
		return (
			<span className={`selected-item selected-item-${color}`}>
				{opt}&nbsp;x&nbsp;{ratingCounts[opt]}
			</span>
		);
	};

	const footerTemplate = (data: any) => {
		return <span>footer</span>;
	};

	return (
		<MultiSelect
			value={formattedValues}
			options={Config.allRatings}
			onChange={(e) => handleChange(e.value)}
			optionLabel="rating"
			itemTemplate={itemTemplate}
			selectedItemTemplate={selectedItemTemplate}
			panelFooterTemplate={footerTemplate}
			scrollHeight="400px"
			showClear
			showSelectAll={false}
		/>
		// <AutoComplete
		// 	multiple
		// 	forceSelection
		// 	dropdown
		// 	field="rating"
		// 	value={formattedValues.length > 0 ? formattedValues : undefined}
		// 	suggestions={options}
		// 	completeMethod={searchOptions}
		// 	onSelect={handleSelect}
		// 	onUnselect={handleUnselect}
		// 	scrollHeight="400px"
		// />
	);
};
