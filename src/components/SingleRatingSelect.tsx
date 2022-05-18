import { Card } from "primereact/card";
import React, { useState } from "react";
import RatingCard from "./RatingCard";

interface ISingleRatingSelectProps {
    value: number;
    options: number[];
    onChange: (newValue: number) => void;
}

export default function SingleRatingSelect({
    value,
    options,
    onChange
}: ISingleRatingSelectProps) {
    const [showOptions, setShowOptions] = useState(false);

    const setRating = (rating: number) => {
        onChange(rating);
        setShowOptions(false);
    };

    return (
        <div
            tabIndex={0}
            onBlur={() => setShowOptions(false)}
            className="rating-select-container">
            <div onClick={() => setShowOptions((prev) => !prev)}>
                <RatingCard rating={value} />
            </div>
            <Card
                className="dropdown-panel shadow-4"
                style={{
                    display: showOptions ? "block" : "none"
                }}>
                <div className="flex flex-wrap gap-3">
                    {options.map((rating, index) => {
                        return (
                            <div key={index}>
                                <span onClick={() => setRating(rating)}>
                                    <RatingCard
                                        rating={rating}
                                        selected={rating === value}
                                    />
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}
