import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Select, { SingleValue } from "react-select";
import IRatingOption from "../interfaces/RatingOption.interface";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";

import Slider, { SliderTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import { getMaxRatingOption, getMinRatingOption, range } from "../util/utils";
import useIsMobile from "../hooks/useIsMobile";
const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const { Handle } = Slider;

interface IRatingsRangeInputProps {
	ratingOptions: IRatingOption[];
	onChange: (newValues: IRatingOption[]) => void;
	defaultRange: IRatingOption[];
}

const selectStyle: React.CSSProperties = {
	flexGrow: "1"
};

const sliderStyle: React.CSSProperties = {
	width: "95%",
	margin: "10px"
};

export default function RatingsRangeInput({
	ratingOptions,
	onChange,
	defaultRange
}: IRatingsRangeInputProps) {
	const [isMobile] = useIsMobile();
	const [marks, setMarks] = useState<Record<number, React.ReactNode>>();
	const [min, setMin] = useState<IRatingOption>(
		getMinRatingOption(defaultRange)
	);
	const [max, setMax] = useState<IRatingOption>(
		getMaxRatingOption(defaultRange)
	);

	useEffect(() => {
		setMarks(() => getMarks(ratingOptions));
	}, [ratingOptions]);

	const handleRangeChange = (newRange: number[]) => {
		newRange.sort();
		const min =
			ratingOptions.find(
				(rating) => rating.ratingValue === Math.min(...newRange)
			) || getMinRatingOption(ratingOptions);
		const max =
			ratingOptions.find(
				(rating) => rating.ratingValue === Math.max(...newRange)
			) || getMaxRatingOption(ratingOptions);
		setMin(min);
		setMax(max);
		onChange(
			range(newRange[0], newRange[newRange.length - 1], 1).map((rating) => ({
				value: Math.random(),
				label: rating.toString(),
				ratingValue: rating
			}))
		);
	};

	const handleMinChange = (newValue: SingleValue<IRatingOption>) => {
		const range = [newValue?.ratingValue || -1, max.ratingValue];
		handleRangeChange(range);
	};

	const handleMaxChange = (newValue: SingleValue<IRatingOption>) => {
		const range = [min.ratingValue, newValue?.ratingValue || -1];
		handleRangeChange(range);
	};

	return (
		<Form.Group>
			<Form.Label>Range of Ratings to Try</Form.Label>
			<div className="py-3">
				<Row>
					<Col lg={2}>
						<InputGroup className="mb-3">
							<InputGroup.Text>Min</InputGroup.Text>
							<div style={selectStyle}>
								<Select
									value={min}
									options={ratingOptions}
									onChange={handleMinChange}
									filterOption={(opt) => opt.data.ratingValue < max.ratingValue}
								/>
							</div>
						</InputGroup>
					</Col>

					<Col lg={2}>
						<InputGroup className="mb-3">
							<InputGroup.Text>Max</InputGroup.Text>
							<div style={selectStyle}>
								<Select
									value={max}
									options={ratingOptions}
									onChange={handleMaxChange}
									filterOption={(opt) => opt.data.ratingValue > min.ratingValue}
								/>
							</div>
						</InputGroup>
					</Col>
				</Row>
				{!isMobile && (
					<Row className="py-4">
						<div style={sliderStyle}>
							<Range
								step={1}
								defaultValue={[
									defaultRange[0].ratingValue,
									defaultRange[1].ratingValue
								]}
								value={[min.ratingValue, max.ratingValue]}
								onChange={handleRangeChange}
								min={Math.min(
									...ratingOptions.map((rating) => rating.ratingValue)
								)}
								max={Math.max(
									...ratingOptions.map((rating) => rating.ratingValue)
								)}
								marks={marks}
								handle={handle}
							/>
						</div>
					</Row>
				)}
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
