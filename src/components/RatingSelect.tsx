import React from "react";
import ReactSelect, { MultiValue, SingleValue } from "react-select";
import { useIsMobile } from "../hooks";
import { IRatingOption } from "../interfaces";

interface IRatingSelectProps<T extends IRatingOption | IRatingOption[]> {
	options: IRatingOption[];
	placeholder?: string;
	value?: T;
	onChange?: (newValue: T) => void;
	isOptionDisabled?: (option: IRatingOption) => boolean;
	isMulti?: boolean;
	maxNumberOfValues?: number;
}

export function RatingSelect<T extends IRatingOption | IRatingOption[]>({
	placeholder,
	value,
	onChange,
	isOptionDisabled,
	options,
	isMulti = false,
	maxNumberOfValues = 99
}: IRatingSelectProps<T>) {
	const [isMobile] = useIsMobile();
	const isTooLong = Array.isArray(value) && value?.length >= maxNumberOfValues;

	const handleChange = (
		newValue: MultiValue<IRatingOption> | SingleValue<IRatingOption>
	) => {
		if (!onChange) {
			return;
		}
		onChange(newValue as T);
	};

	const handleIsOptionSelected = (opt: IRatingOption): boolean => {
		if (isMulti) {
			return false;
		}
		if (Array.isArray(value)) {
			return !!value.find((v) => v.ratingValue === opt.ratingValue);
		}
		return value?.ratingValue === opt.ratingValue;
	};

	return (
		<ReactSelect
			isSearchable={!isMobile}
			placeholder={placeholder}
			value={value}
			onChange={handleChange}
			options={
				isTooLong
					? undefined
					: options.sort((a, b) => a.ratingValue - b.ratingValue)
			}
			isMulti={isMulti}
			isOptionDisabled={(opt) =>
				isOptionDisabled ? isOptionDisabled(opt) : false
			}
			isOptionSelected={handleIsOptionSelected}
			noOptionsMessage={() =>
				isTooLong
					? "Maximum number of player ratings reached"
					: "No options available"
			}
		/>
	);
}
