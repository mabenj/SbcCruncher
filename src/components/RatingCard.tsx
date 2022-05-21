import { Ripple } from "primereact/ripple";
import React from "react";
import "../styles/rating-card.scss";

const SILVER_HIGHEST = 74;
const BRONZE_HIGHEST = 64;

interface IRatingProps {
    rating: number;
    selected?: boolean;
}

export default function RatingCard({ rating, selected }: IRatingProps) {
    const color =
        rating > SILVER_HIGHEST
            ? "golden"
            : rating > BRONZE_HIGHEST
            ? "silver"
            : "bronze";
    return (
        <div
            className={`
            rating-card rating-card-${color} 
            ${selected && "rating-card-selected"}
            `}
            title={rating === 69 ? "nice" : ""}>
            <div>{rating}</div>
            <Ripple />
        </div>
    );
}
