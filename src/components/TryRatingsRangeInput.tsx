import React, { useState, useEffect } from "react";
import Slider, { SliderTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import { useIsMobile } from "../hooks";
import Config from "../Config";
import { SingleRatingDropdown } from "./";

import "../styles/TryRatingsRangeInput.scss";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const { Handle } = Slider;

interface IRatingsRangeInputProps {
	valueOfMin: number;
	valueOfMax: number;
	onChange: (min: number, max: number) => void;
}

export function TryRatingsRangeInput({
	valueOfMin,
	valueOfMax,
	onChange
}: IRatingsRangeInputProps) {
	const [isMobile] = useIsMobile();
	const [marks, setMarks] = useState<Record<number, React.ReactNode>>();

	useEffect(() => {
		setMarks(() => getMarks(Config.tryRatings));
	}, []);

	const handleRangeChange = (newRange: number[]) => {
		newRange.sort();
		const min =
			Config.tryRatings.find((rating) => rating === Math.min(...newRange)) ||
			Math.min(...Config.tryRatings);
		const max =
			Config.tryRatings.find((rating) => rating === Math.max(...newRange)) ||
			Math.max(...Config.tryRatings);
		onChange(min, max);
	};

	const handleMinChange = (newValue: number | undefined) => {
		newValue = newValue === undefined ? valueOfMin : newValue;
		const range = [newValue, newValue > valueOfMax ? newValue + 1 : valueOfMax];
		handleRangeChange(range);
	};

	const handleMaxChange = (newValue: number | undefined) => {
		newValue = newValue === undefined ? valueOfMax : newValue;
		const range = [newValue < valueOfMin ? newValue - 1 : valueOfMin, newValue];
		handleRangeChange(range);
	};

	return (
		<div className="p-field">
			<label htmlFor="ratingsToTry">Range of Ratings to Try</label>
			<div className="p-py-3">
				<div className="p-grid">
					<div className="p-lg-2 p-md-6 p-sm-12">
						<div className="p-inputgroup p-mb-3">
							<span className="p-inputgroup-addon">Min</span>
							<SingleRatingDropdown
								ratings={Config.tryRatings}
								value={valueOfMin}
								onChange={handleMinChange}
							/>
						</div>
					</div>

					<div className="p-lg-2 p-md-6 p-sm-12">
						<div className="p-inputgroup p-mb-3">
							<span className="p-inputgroup-addon">Max</span>
							<SingleRatingDropdown
								ratings={Config.tryRatings}
								value={valueOfMax}
								onChange={handleMaxChange}
							/>
						</div>
					</div>
				</div>
				{!isMobile && (
					<div className="slider p-py-4">
						<Range
							step={1}
							defaultValue={[Config.defaultTryMin, Config.defaultTryMax]}
							value={[valueOfMin, valueOfMax]}
							onChange={handleRangeChange}
							min={Math.min(...Config.tryRatings)}
							max={Math.max(...Config.tryRatings)}
							marks={marks}
							handle={handle}
						/>
					</div>
				)}
			</div>
			<small>
				Specify the minimum and maximum ratings to use when calculating the
				possible rating combinations
			</small>
		</div>
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

const getMarks = (ratingOptions: number[]): Record<number, React.ReactNode> => {
	const result: Record<number, React.ReactNode> = {};
	ratingOptions.forEach((rating) => {
		result[rating] = <span className="mark">{rating}</span>;
	});
	return result;
};
