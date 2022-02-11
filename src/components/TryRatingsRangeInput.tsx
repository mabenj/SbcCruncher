import React, { useState, useEffect } from "react";
import { IRatingOption } from "../interfaces";
import Slider, { SliderTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import { getMaxRatingOption, getMinRatingOption } from "../util/utils";
import { useIsMobile } from "../hooks";
import Config from "../Config";
import { RatingSelect } from "./";

import "../styles/TryRatingsRangeInput.scss";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const { Handle } = Slider;

interface IRatingsRangeInputProps {
	valueOfMin: IRatingOption | undefined;
	valueOfMax: IRatingOption | undefined;
	onChange: (min: IRatingOption, max: IRatingOption) => void;
}

export function TryRatingsRangeInput({
	valueOfMin,
	valueOfMax,
	onChange
}: IRatingsRangeInputProps) {
	const [isMobile] = useIsMobile();
	const [marks, setMarks] = useState<Record<number, React.ReactNode>>();

	useEffect(() => {
		setMarks(() => getMarks(Config.ratingOptions));
	}, []);

	const handleRangeChange = (newRange: number[]) => {
		newRange.sort();
		const min =
			Config.ratingOptions.find(
				(rating) => rating.ratingValue === Math.min(...newRange)
			) || getMinRatingOption(Config.ratingOptions);
		const max =
			Config.ratingOptions.find(
				(rating) => rating.ratingValue === Math.max(...newRange)
			) || getMaxRatingOption(Config.ratingOptions);
		onChange(min, max);
	};

	const handleMinChange = (newValue: IRatingOption) => {
		valueOfMax = valueOfMax || newValue;
		const range = [
			newValue.ratingValue,
			newValue.ratingValue > valueOfMax.ratingValue
				? newValue.ratingValue + 1
				: valueOfMax.ratingValue
		];
		handleRangeChange(range);
	};

	const handleMaxChange = (newValue: IRatingOption) => {
		valueOfMin = valueOfMin || newValue;
		const range = [
			newValue.ratingValue < valueOfMin.ratingValue
				? newValue.ratingValue - 1
				: valueOfMin.ratingValue,
			newValue.ratingValue
		];
		handleRangeChange(range);
	};

	return (
		<div className="p-field">
			<label htmlFor="ratingsToTry">Range of Ratings to Try</label>
			<div className="p-py-3">
				<div className="p-grid">
					<div className="p-lg-2">
						<div className="p-inputgroup p-mb-3">
							<span className="p-inputgroup-addon">Min</span>
							<div className="select">
								<RatingSelect
									value={valueOfMin}
									options={Config.ratingOptions}
									onChange={handleMinChange}
								/>
							</div>
						</div>
					</div>

					<div className="p-lg-2">
						<div className="p-inputgroup p-mb-3">
							<span className="p-inputgroup-addon">Max</span>
							<div className="select">
								<RatingSelect
									value={valueOfMax}
									options={Config.ratingOptions}
									onChange={handleMaxChange}
								/>
							</div>
						</div>
					</div>
				</div>
				{!isMobile && (
					<div className="slider p-py-4">
						<Range
							step={1}
							defaultValue={[
								Config.defaultTryMin.ratingValue,
								Config.defaultTryMax.ratingValue
							]}
							value={[
								valueOfMin?.ratingValue || Config.defaultTryMin.ratingValue,
								valueOfMax?.ratingValue || Config.defaultTryMax.ratingValue
							]}
							onChange={handleRangeChange}
							min={Math.min(
								...Config.ratingOptions.map((rating) => rating.ratingValue)
							)}
							max={Math.max(
								...Config.ratingOptions.map((rating) => rating.ratingValue)
							)}
							marks={marks}
							handle={handle}
							trackStyle={[{ backgroundColor: "#007bff" }]}
							handleStyle={[{ borderColor: "#007bff" }]}
							activeDotStyle={{ borderColor: "#007bff" }}
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

const getMarks = (
	ratingOptions: IRatingOption[]
): Record<number, React.ReactNode> => {
	const result: Record<number, React.ReactNode> = {};
	ratingOptions.forEach((rating) => {
		result[rating.ratingValue] = rating.ratingValue;
	});
	return result;
};
