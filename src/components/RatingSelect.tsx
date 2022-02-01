import React from "react";
import ReactSelect, {
	ActionMeta as RCActionMeta,
	MultiValue,
	SingleValue
} from "react-select";
import useIsMobile from "../hooks/useIsMobile";
import IRatingOption from "../interfaces/RatingOption.interface";

export type ActionMeta<T extends IRatingOption | IRatingOption[] | null> =
	RCActionMeta<T>;

interface IRatingSelectProps<T extends IRatingOption | IRatingOption[]> {
	options: IRatingOption[];
	placeholder?: string;
	value?: T;
	onChange?: (
		newValue: IRatingOption,
		action: ActionMeta<IRatingOption>
	) => void;
	isOptionDisabled?: (option: IRatingOption) => boolean;
	isMulti?: boolean;
	maxNumberOfValues?: number;
}

export default function RatingSelect<
	T extends IRatingOption | IRatingOption[]
>({
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
		newValue: MultiValue<IRatingOption> | SingleValue<IRatingOption>,
		actionMeta: RCActionMeta<IRatingOption>
	) => {
		if (!onChange) {
			return;
		}
		onChange(Array.isArray(newValue) ? newValue[0] : newValue, actionMeta);
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
		/>
	);
}
