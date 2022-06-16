import { Ripple } from "primereact/ripple";
import React from "react";
import styles from "./RatingCard.module.scss";

const SILVER_HIGHEST = 74;
const BRONZE_HIGHEST = 64;

interface IRatingProps {
    rating: number;
    selected?: boolean;
    dimmed?: boolean;
}

export default function RatingCard({ rating, selected, dimmed }: IRatingProps) {
    const color =
        rating > SILVER_HIGHEST
            ? "rating-card-golden"
            : rating > BRONZE_HIGHEST
            ? "rating-card-silver"
            : "rating-card-bronze";
    return (
        <div
            className={`
                ${styles["rating-card"]} ${styles[color]} 
                ${selected && styles["rating-card-selected"]}
                ${dimmed && styles["rating-card-dimmed"]}
            `}
            title={rating === 69 ? "nice" : ""}>
            <div>{rating}</div>
            <Ripple />
        </div>
    );
}
