import Slider, { SliderTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useEffect, useState } from "react";
import Config from "../Config";
import { useIsMobile } from "../hooks/useIsMobile";
import InlineTextWarning from "./InlineTextWarning";
import SingleRatingSelect from "./SingleRatingSelect";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const { Handle } = Slider;

interface IRatingsRangeInputProps {
    value: [min: number, max: number];
    onChange: (newBoundaries: [min: number, max: number]) => void;
}

export function TryRatingsRangeInput({
    value,
    onChange
}: IRatingsRangeInputProps) {
    const [isMobile] = useIsMobile();
    const [marks, setMarks] = useState<Record<number, React.ReactNode>>();

    const options = Config.tryRatings.sort();

    useEffect(() => {
        setMarks(() => getMarks(Config.tryRatings));
    }, []);

    const handleRangeChange = (newRange: number[]) => {
        newRange.sort();
        const min =
            Config.tryRatings.find(
                (rating) => rating === Math.min(...newRange)
            ) || Math.min(...Config.tryRatings);
        const max =
            Config.tryRatings.find(
                (rating) => rating === Math.max(...newRange)
            ) || Math.max(...Config.tryRatings);
        onChange([min, max]);
    };

    const handleMinChange = (newValue: number) => {
        const currentMax = Math.max(...value);
        const range = [
            newValue,
            newValue > currentMax ? newValue + 1 : currentMax
        ];
        handleRangeChange(range);
    };

    const handleMaxChange = (newValue: number) => {
        const currentMin = Math.min(...value);
        const range = [
            newValue < currentMin ? newValue - 1 : currentMin,
            newValue
        ];
        handleRangeChange(range);
    };

    return (
        <div>
            <div>
                <div className="flex justify-content-center">
                    <table>
                        <thead>
                            <tr>
                                <th>From</th>
                                <th style={{ width: "6rem" }}></th>
                                <th>To</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <SingleRatingSelect
                                        value={value[0]}
                                        options={options}
                                        onChange={handleMinChange}
                                    />
                                </td>
                                <td className="text-center">
                                    <span className="pi pi-arrows-h"></span>
                                </td>
                                <td>
                                    <SingleRatingSelect
                                        value={value[1]}
                                        options={options}
                                        onChange={handleMaxChange}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {!isMobile && (
                    <div className="try-rating-slider py-4">
                        <Range
                            step={1}
                            defaultValue={[
                                Config.defaultTryMin,
                                Config.defaultTryMax
                            ]}
                            value={value}
                            onChange={handleRangeChange}
                            min={Math.min(...Config.tryRatings)}
                            max={Math.max(...Config.tryRatings)}
                            marks={marks}
                            handle={handle}
                        />
                    </div>
                )}
            </div>
            <div className="mt-5">
                <small>
                    Specify the minimum and maximum ratings to use when
                    calculating the possible rating combinations
                </small>
                <InlineTextWarning
                    show={
                        Math.abs(value[0] - value[1]) >
                        Config.tryRangeWarningThreshold
                    }>
                    <strong>Note!</strong> Large rating ranges might take a long
                    time to calculate
                </InlineTextWarning>
            </div>
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
        result[rating] = <span className="try-rating-mark">{rating}</span>;
    });
    return result;
};
