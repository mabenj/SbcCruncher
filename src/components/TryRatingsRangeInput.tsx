import Slider, { SliderTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useEffect, useMemo, useState } from "react";
import Config from "../Config";
import { useAnalytics } from "../hooks/useAnalytics";
import useDebounce from "../hooks/useDebounce";
import { useIsMobile } from "../hooks/useIsMobile";
import useUpdateEffect from "../hooks/useUpdateEffect";
import InlineTextWarning from "./InlineTextWarning";
import RatingSelect from "./RatingSelect";

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
    const [marks, setMarks] = useState<Record<number, React.ReactNode>>();
    const debouncedBounds = useDebounce(value, Config.analyticsDebounceMs);
    const isMobile = useIsMobile();
    const { event } = useAnalytics();

    const options = useMemo(() => Config.tryRatings.sort(), []);

    useEffect(() => {
        setMarks(() => getMarks(Config.tryRatings));
    }, []);

    useUpdateEffect(() => {
        event({
            category: "TRY_RATINGS",
            action: "SET_TRY_RATINGS",
            details: {
                try_min: Math.min(...value),
                try_max: Math.max(...value)
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedBounds]);

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
        handleRangeChange([newValue, currentMax]);
        event({
            category: "TRY_RATINGS",
            action: "SET_TRY_MIN",
            details: { try_min: newValue }
        });
    };

    const handleMaxChange = (newValue: number) => {
        const currentMin = Math.min(...value);
        handleRangeChange([currentMin, newValue]);
        event({
            category: "TRY_RATINGS",
            action: "SET_TRY_MAX",
            details: { try_max: newValue }
        });
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
                                    <RatingSelect
                                        value={value[0]}
                                        otherValue={value[1]}
                                        options={options}
                                        onChange={handleMinChange}
                                    />
                                </td>
                                <td className="text-center">
                                    <span className="pi pi-arrows-h"></span>
                                </td>
                                <td>
                                    <RatingSelect
                                        value={value[1]}
                                        otherValue={value[0]}
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
