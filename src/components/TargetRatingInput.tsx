import React from "react";
import Config from "../Config";
import RatingCard from "./rating_cards/RatingCard";

interface ITargetRatingInputProps {
    value: number | undefined;
    onChange: (newRating: number | undefined) => void;
}

export function TargetRatingInput({
    value,
    onChange
}: ITargetRatingInputProps) {
    return (
        <>
            <div className="my-4">
                <strong className="mr-2">Selected</strong>
                <span>{value}</span>
            </div>
            <div className="flex flex-wrap">
                {Config.allRatings.map((rating, index) => {
                    return (
                        <div key={index} className="my-2 mr-3 cursor-pointer">
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
            <div className="my-2">
                <small>Select the desired squad rating by clicking it</small>
            </div>
        </>
    );
}
