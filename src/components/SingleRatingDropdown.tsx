import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";

import "../styles/SingleRatingSelect.scss";

interface IOption {
	ratingValue: string | undefined;
	ratingLabel: string | undefined;
}

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
	const [currentValue, setCurrentValue] = useState<IOption>();
	const [options] = useState<IOption[]>(
		ratings.map((r) => ({
			ratingLabel: r.toString(),
			ratingValue: r.toString()
		}))
	);

	useEffect(() => {
		if (!value && value !== 0) {
			return;
		}
		setCurrentValue({
			ratingLabel: value?.toString(),
			ratingValue: value?.toString()
		});
	}, [value]);

	const itemTemplate = (opt: IOption) => {
		if (!opt) {
			return <span>empty</span>;
		}
		const value = Number(opt.ratingValue);
		const color = value > 74 ? "golden" : value > 64 ? "silver" : "bronze";
		return <span className={`card card-${color}`}>{value}</span>;
	};

	const handleChange = (newValue: IOption) => {
		const num = Number(newValue.ratingValue);
		if (ratings.indexOf(num) > -1) {
			console.log("onchange", { num });
			onChange(num);
		}
	};

	return (
		<Dropdown
			value={currentValue}
			options={options}
			optionLabel="ratingLabel"
			scrollHeight="300px"
			emptyMessage="No ratings available"
			emptyFilterMessage="No ratings found"
			resetFilterOnHide
			filter
			filterMatchMode="startsWith"
			required
			itemTemplate={itemTemplate}
			valueTemplate={itemTemplate}
			onChange={(e) => handleChange(e.value)}
		/>
	);
};
