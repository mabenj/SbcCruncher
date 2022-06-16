import { OverlayPanel } from "primereact/overlaypanel";
import React, { useRef } from "react";
import { inBetween } from "../../utils/utils";
import MobileScrollPanel from "./../MobileScrollPanel";
import RatingCard from "./../RatingCard";
import styles from "./RatingSelect.module.scss";

interface IRatingSelectProps {
    value: number;
    otherValue?: number;
    options: number[];
    onChange: (newValue: number) => void;
}

export default function RatingSelect({
    value,
    otherValue,
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
                className={styles["rating-select-overlay-panel"]}>
                <MobileScrollPanel>
                    <div className={styles["rating-select-overlay-content"]}>
                        {options.map((rating, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex justify-content-center align-items-center">
                                    <span onClick={() => setRating(rating)}>
                                        <RatingCard
                                            rating={rating}
                                            selected={rating === value}
                                            dimmed={
                                                otherValue
                                                    ? inBetween(
                                                          rating,
                                                          value,
                                                          otherValue
                                                      ) || otherValue === rating
                                                    : false
                                            }
                                        />
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </MobileScrollPanel>
            </OverlayPanel>
        </div>
    );
}
