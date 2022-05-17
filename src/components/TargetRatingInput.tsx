import React from "react";
import Config from "../Config";
import RatingCard from "./RatingCard";

interface ITargetRatingInputProps {
    value: number | undefined;
    onChange: (newRating: number | undefined) => void;
}

export function TargetRatingInput({
    value,
    onChange
}: ITargetRatingInputProps) {
    return (
        <div>
            <div className="my-4">
                <strong className="mr-2">Selected</strong>
                <span>{value || <em>none</em>}</span>
            </div>
            <div className="flex flex-wrap gap-3">
                {Config.allRatings.map((rating, index) => {
                    return (
                        <div key={index}>
                            <span onClick={() => onChange(rating)}>
                                <RatingCard
                                    rating={rating}
                                    selected={value === rating}
                                />
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4">
                <small>Select the desired squad rating</small>
            </div>
        </div>
    );
}
