import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
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
    const [editIndex, setEditIndex] = useState(-1);

    useEffect(() => {
        setRatings(() => {
            let count = 0;
            const accepted: IExistingRating[] = [];
            value.forEach((v) => {
                count += v.quantity;
                if (count > Config.maxExistingRatings) {
                    return;
                }
                accepted.push(v);
            });
            return accepted;
        });
    }, [value]);

    const getCurrentRatingsCount = (exceptRating?: number) => {
        return ratings.reduce(
            (acc, curr) =>
                curr.rating === exceptRating ? acc : acc + curr.quantity,
            0
        );
    };

    const addRating = () => {
        setEditIndex(ratings.length);
        setRatings((prev) => [...prev, { rating: 75, quantity: 1 }]);
    };

    const handleDelete = (index: number) => {
        setRatings((prev) => {
            prev.splice(index, 1);
            const newRatings = [...prev];
            onChange(newRatings.length > 0 ? newRatings : undefined);
            return newRatings;
        });
    };

    const handleModification = (
        newRating: number,
        newQuantity: number,
        index: number
    ) => {
        setRatings((prev) => {
            prev[index] = {
                ...prev[index],
                rating: newRating,
                quantity: newQuantity
            };
            const newRatings = [...prev];
            onChange(newRatings.length > 0 ? newRatings : undefined);
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
                            isEditing={editIndex === index}
                            onEditStart={() => setEditIndex(index)}
                            onEditEnd={() => setEditIndex(-1)}
                            onDelete={() => handleDelete(index)}
                            onModify={(newRating, newQuantity) =>
                                handleModification(
                                    newRating,
                                    newQuantity,
                                    index
                                )
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
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-outlined"
                    label="Add a rating"
                    onClick={() => addRating()}
                    disabled={
                        getCurrentRatingsCount() >= Config.maxExistingRatings ||
                        editIndex !== -1
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
    isEditing: boolean;
    onEditStart: () => void;
    onEditEnd: () => void;
    onDelete: () => void;
    onModify: (newRating: number, newQuantity: number) => void;
    getRatingsCount: (exceptRating?: number) => number;
}

const RatingRow = ({
    rating,
    quantity,
    isEditing,
    onEditStart,
    onEditEnd,
    onDelete,
    onModify,
    getRatingsCount
}: IRatingRowProps) => {
    const [editedRating, setEditedRating] = useState(rating);
    const [editedQuantity, setEditedQuantity] = useState(quantity);
    const [isInitialEdit, setIsInitialEdit] = useState(true);

    const handleSave = () => {
        onModify(editedRating, editedQuantity);
        isInitialEdit && setIsInitialEdit(false);
        onEditEnd();
    };

    const handleCancel = () => {
        if (isInitialEdit) {
            onDelete();
        } else {
            setEditedRating(rating);
            setEditedQuantity(quantity);
        }
        onEditEnd();
    };

    const getMaxQuantity = () => {
        const othersCount = getRatingsCount() - quantity;
        return Config.maxExistingRatings - othersCount;
    };

    return (
        <tr
            style={{
                height: "90px"
            }}
            className={
                isEditing
                    ? "border-2 border-double surface-border surface-hover"
                    : ""
            }>
            <td className="text-left">
                {isEditing ? (
                    <Dropdown
                        value={editedRating}
                        options={Config.allRatings}
                        onChange={(e) => setEditedRating(Number(e.value))}
                        placeholder="Select a rating"
                        itemTemplate={(option) => (
                            <RatingCard rating={option} />
                        )}
                        valueTemplate={(option) => (
                            <RatingCard rating={option} />
                        )}
                        scrollHeight="300px"
                    />
                ) : (
                    <span className="pointer-events-none">
                        <RatingCard rating={rating} />
                    </span>
                )}
            </td>
            <td className="text-center">
                {isEditing ? (
                    <InputNumber
                        value={editedQuantity}
                        showButtons
                        buttonLayout="horizontal"
                        incrementButtonIcon="pi pi-plus"
                        decrementButtonIcon="pi pi-minus"
                        onChange={(e) =>
                            setEditedQuantity((prev) => e.value || prev)
                        }
                        min={1}
                        max={getMaxQuantity()}
                        allowEmpty={false}
                        inputStyle={{ width: "50px" }}
                        inputClassName="text-center"
                    />
                ) : (
                    quantity
                )}
            </td>
            <td>
                {isEditing ? (
                    <>
                        <Button
                            icon="pi pi-check"
                            className="p-button-rounded p-button-success p-button-text mr-2"
                            title="Save"
                            onClick={() => handleSave()}
                        />{" "}
                        <Button
                            icon="pi pi-times"
                            className="p-button-rounded p-button-danger p-button-text"
                            title="Cancel"
                            onClick={() => handleCancel()}
                        />
                    </>
                ) : (
                    <>
                        <Button
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-secondary p-button-text mr-2"
                            title="Edit"
                            onClick={() => onEditStart()}
                        />{" "}
                        <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-danger p-button-text"
                            title="Delete"
                            onClick={() => onDelete()}
                        />
                    </>
                )}
            </td>
        </tr>
    );
};
