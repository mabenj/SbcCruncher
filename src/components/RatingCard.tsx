import React from "react";
import "../styles/rating-card.scss";

interface IRatingProps {
    rating: number;
    selected?: boolean;
}

export default function RatingCard({ rating, selected }: IRatingProps) {
    const color = rating > 74 ? "golden" : rating > 64 ? "silver" : "bronze";
    return (
        <div
            className={`
            rating-card rating-card-${color} 
            ${selected && "rating-card-selected"}
            `}
            title={rating === 69 ? "nice" : ""}>
            <div>{rating}</div>
        </div>
    );
}
