import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import Config from "../Config";
import { IExistingRating } from "../interfaces";
import "../styles/ExistingRatingsInput.scss";
import RatingCard from "./rating_cards/RatingCard";

interface IExistingRatingsInputProps {
    value: IExistingRating[];
    onChange: (newValues: IExistingRating[] | undefined) => void;
}

export function ExistingRatingsInput({
    value,
    onChange
}: IExistingRatingsInputProps) {
    const [ratings, setRatings] = useState<IExistingRating[]>([]);

    useEffect(() => setRatings(value), [value]);

    const getCurrentRatingsCount = (exceptRating?: number) => {
        return ratings.reduce(
            (acc, curr) =>
                curr.rating === exceptRating ? acc : acc + curr.quantity,
            0
        );
    };

    const addRating = () => {
        setRatings((prev) => {
            const newRatings = [...prev, { rating: 75, quantity: 1 }];
            onChange(newRatings);
            return newRatings;
        });
    };

    const handleDelete = (index: number) => {
        setRatings((prev) => {
            prev.splice(index, 1);
            const newRatings = [...prev];
            onChange(newRatings.length > 0 ? newRatings : undefined);
            return newRatings;
        });
    };

    const handleChange = (
        index: number,
        newRating: number,
        newQuantity: number
    ) => {
        setRatings((prev) => {
            prev[index] = { rating: newRating, quantity: newQuantity };
            const newRatings = [...prev];
            onChange(newRatings);
            return newRatings;
        });
    };

    return (
        <>
            <table
                className="w-full existing-ratings-table"
                style={{ borderCollapse: "collapse" }}>
                <thead className="bg-primary">
                    <tr>
                        <th className="text-left">Rating</th>
                        <th className="text-center">Quantity</th>
                        <th style={{ width: "10%", minWidth: "8rem" }}></th>
                    </tr>
                </thead>
                <tbody>
                    {ratings.map((r, index) => (
                        <RatingRow
                            key={index}
                            rating={r.rating}
                            quantity={r.quantity}
                            onDelete={() => handleDelete(index)}
                            onChange={(newRating, newQuantity) =>
                                handleChange(index, newRating, newQuantity)
                            }
                            getRatingsCount={getCurrentRatingsCount}
                        />
                    ))}
                </tbody>
            </table>
            {ratings.length === 0 && (
                <div className="text-secondary-color my-3">
                    <em>No ratings specified</em>
                </div>
            )}
            <div className="my-5">
                <Button
                    type="button"
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-outlined"
                    label="Add a rating"
                    title="Add an existing player rating"
                    onClick={() => addRating()}
                    disabled={
                        getCurrentRatingsCount() >= Config.maxExistingRatings
                    }
                />
            </div>
            <div className="my-2">
                Specify the ratings of the players you already possess and plan
                to use in the SBC <em>(Fodder)</em>
            </div>
        </>
    );
}

interface IRatingRowProps {
    rating: number;
    quantity: number;
    onDelete: () => void;
    onChange: (newRating: number, newQuantity: number) => void;
    getRatingsCount: (exceptRating?: number) => number;
}

const RatingRow = ({
    rating,
    quantity,
    onDelete,
    onChange,
    getRatingsCount
}: IRatingRowProps) => {
    const getMaxQuantity = () => {
        const othersCount = getRatingsCount() - quantity;
        return Config.maxExistingRatings - othersCount;
    };

    return (
        <tr
            style={{
                height: "90px"
            }}>
            <td className="text-left">
                <RatingSelect
                    value={rating}
                    onChange={(newRating) => onChange(newRating, quantity)}
                />
            </td>
            <td className="text-center">
                <QuantitySelect
                    value={quantity}
                    onChange={(newQuantity) => onChange(rating, newQuantity)}
                    min={1}
                    max={getMaxQuantity()}
                />
            </td>
            <td>
                <Button
                    type="button"
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger p-button-text"
                    title="Delete"
                    onClick={() => onDelete()}
                />
            </td>
        </tr>
    );
};

const RatingSelect = ({
    value,
    onChange
}: {
    value: number;
    onChange: (newValue: number) => void;
}) => {
    const [showOptions, setShowOptions] = useState(false);

    const setRating = (rating: number) => {
        onChange(rating);
        setShowOptions(false);
    };

    return (
        <div tabIndex={0} onBlur={() => setShowOptions(false)}>
            <div onClick={() => setShowOptions((prev) => !prev)}>
                <RatingCard rating={value} />
            </div>
            <Card
                className="absolute mt-2 z-5 shadow-4"
                style={{
                    maxWidth: "40%",
                    display: showOptions ? "block" : "none"
                }}>
                <div className="flex flex-wrap gap-3">
                    {Config.allRatings.map((rating, index) => {
                        return (
                            <div key={index}>
                                <span onClick={() => setRating(rating)}>
                                    <RatingCard
                                        rating={rating}
                                        selected={value === rating}
                                    />
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

const QuantitySelect = ({
    value,
    onChange,
    min,
    max
}: {
    value: number;
    onChange: (newValue: number) => void;
    min: number;
    max: number;
}) => {
    const increment = () => {
        if (value >= max) {
            return;
        }
        onChange(value + 1);
    };

    const decrement = () => {
        if (value <= min) {
            return;
        }
        onChange(value - 1);
    };

    return (
        <div className="flex justify-content-center align-items-center">
            <Button
                type="button"
                icon="pi pi-minus"
                className="p-button-rounded p-button-text"
                title="Remove one"
                onClick={() => decrement()}
                disabled={min === value}
            />
            <span className="mx-3">{value}</span>
            <Button
                type="button"
                icon="pi pi-plus"
                className="p-button-rounded p-button-text"
                title="Add one"
                onClick={() => increment()}
                disabled={max === value}
            />
        </div>
    );
};
