import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import IRatingOption from "../interfaces/RatingOption.interface";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Slider, { SliderTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import { getMaxRatingOption, getMinRatingOption } from "../util/utils";
import useIsMobile from "../hooks/useIsMobile";
import Config from "../Config";
import RatingSelect from "./RatingSelect";
const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const { Handle } = Slider;

const selectStyle: React.CSSProperties = {
	flexGrow: "1"
};

const sliderStyle: React.CSSProperties = {
	width: "95%",
	margin: "10px"
};

interface IRatingsRangeInputProps {
	valueOfMin: IRatingOption | undefined;
	valueOfMax: IRatingOption | undefined;
	onChange: (min: IRatingOption, max: IRatingOption) => void;
}

export default function TryRatingsRangeInput({
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
		<Form.Group>
			<Form.Label>Range of Ratings to Try</Form.Label>
			<div className="py-3">
				<Row>
					<Col lg={2}>
						<InputGroup className="mb-3">
							<InputGroup.Text>Min</InputGroup.Text>
							<div style={selectStyle}>
								<RatingSelect
									value={valueOfMin}
									options={Config.ratingOptions}
									onChange={handleMinChange}
								/>
							</div>
						</InputGroup>
					</Col>

					<Col lg={2}>
						<InputGroup className="mb-3">
							<InputGroup.Text>Max</InputGroup.Text>
							<div style={selectStyle}>
								<RatingSelect
									value={valueOfMax}
									options={Config.ratingOptions}
									onChange={handleMaxChange}
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
