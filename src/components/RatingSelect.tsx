import { OverlayPanel } from "primereact/overlaypanel";
import React, { useRef } from "react";
import RatingCard from "./RatingCard";

interface IRatingSelectProps {
    value: number;
    options: number[];
    onChange: (newValue: number) => void;
}

export default function RatingSelect({
    value,
    options,
    onChange
}: IRatingSelectProps) {
    const op = useRef<OverlayPanel>(null);

    const setRating = (rating: number) => {
        onChange(rating);
        op.current?.hide();
    };

    const toggleOverlay = (e: React.MouseEvent) => {
        op.current?.toggle(e);
    };

    return (
        <div>
            <div onClick={toggleOverlay}>
                <RatingCard rating={value} />
            </div>
            <OverlayPanel
                ref={op}
                breakpoints={{ "960px": "75vw", "640px": "100vw" }}
                style={{ width: "450px" }}>
                <div className="rating-select-overlay-content">
                    {options.map((rating, index) => {
                        return (
                            <div
                                key={index}
                                className="flex justify-content-center align-items-center">
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
            </OverlayPanel>
        </div>
    );
}
