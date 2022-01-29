import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Select, { MultiValue, ActionMeta } from "react-select";
import IRatingOption from "../interfaces/RatingOption.interface";

import Slider, { SliderTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import { range } from "../utils";
const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const { Handle } = Slider;

interface IRatingsRangeInputProps {
	ratingOptions: IRatingOption[];
	onChange: (newValues: IRatingOption[]) => void;
	defaultRange: IRatingOption[];
}

export default function RatingsRangeInput({
	ratingOptions,
	onChange,
	defaultRange
}: IRatingsRangeInputProps) {
	const [marks, setMarks] = useState<Record<number, React.ReactNode>>();

	useEffect(() => {
		setMarks(() => getMarks(ratingOptions));
	}, [ratingOptions]);

	const handleChange = (newRange: number[]) => {
		onChange(
			range(newRange[0], newRange[newRange.length - 1], 1).map((rating) => ({
				value: Math.random(),
				label: rating.toString(),
				ratingValue: rating
			}))
		);
	};

	return (
		<Form.Group>
			<Form.Label>Range of Ratings to Try</Form.Label>
			<div className="py-4">
				<Range
					step={1}
					defaultValue={[
						defaultRange[0].ratingValue,
						defaultRange[1].ratingValue
					]}
					onAfterChange={handleChange}
					min={Math.min(...ratingOptions.map((rating) => rating.ratingValue))}
					max={Math.max(...ratingOptions.map((rating) => rating.ratingValue))}
					marks={marks}
					handle={handle}
				/>
			</div>
			<Form.Text muted>
				Specify the minimum and maximum ratings to use when calculating the
				rating combinations.{" "}
				<strong className="text-danger">
					A large range will take a long time to calculate!
				</strong>
			</Form.Text>
		</Form.Group>
	);
}

const handle = (props: any) => {
	const { value, dragging, index, ...restProps } = props;
	return (
		<SliderTooltip
			prefixCls="rc-slider-tooltip"
			overlay={`${value} %`}
			visible={dragging}
			placement="top"
			key={index}>
			<Handle value={value} {...restProps} />
		</SliderTooltip>
	);
};

const getMarks = (
	ratingOptions: IRatingOption[]
): Record<number, React.ReactNode> => {
	const result: Record<number, React.ReactNode> = {};
	ratingOptions.forEach((rating) => {
		result[rating.ratingValue] = rating.ratingValue;
	});
	return result;
};
