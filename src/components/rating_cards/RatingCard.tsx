import React from "react";
import "../../styles/RatingCard.scss";

interface IRatingProps {
    rating: number;
    selected?: boolean;
}

export default function RatingCard({ rating, selected }: IRatingProps) {
    const color = rating > 74 ? "golden" : rating > 64 ? "silver" : "bronze";
    return (
        <div
            className={`shadow-3 rating-card rating-card-${color} ${
                selected && "rating-card-selected"
            }`}
            title={rating === 69 ? "nice" : ""}>
            {rating}
        </div>
    );
}
