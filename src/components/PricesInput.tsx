import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import Config from "../Config";
import { useAnalytics } from "../hooks/useAnalytics";
import useLocalStorage from "../hooks/useLocalStorage";
import { usePrices } from "../hooks/usePrices";
import useUpdateEffect from "../hooks/useUpdateEffect";
import { IPriceInfo } from "../interfaces/PriceInfo.interface";
import { hoursSince, timeSince } from "../util/utils";
import InlineTextWarning from "./InlineTextWarning";
import NoPrerender from "./NoPrerender";

interface IPricesInputProps {
    ratings: number[];
    prices: IPriceInfo;
    onChange: (newPrices: IPriceInfo) => void;
}

export function PricesInput({ ratings, prices, onChange }: IPricesInputProps) {
    const { fetchPrices, isFetching, fetchError } = usePrices();
    const [lastUpdated, setLastUpdated] = useLocalStorage(
        Config.pricesLastUpdatedStorageKey,
        Date.now()
    );
    const [showWarning, setShowWarning] = useState(false);
    const errorToast = useRef<Toast>(null);
    const { event } = useAnalytics();

    useUpdateEffect(() => {
        setLastUpdated(Date.now());
        setShowWarning(true);
    }, [prices]);

    useEffect(() => {
        if (!fetchError) {
            return;
        }
        errorToast.current !== null &&
            errorToast.current.show({
                severity: "error",
                summary: "Could not fetch price data from FUTBIN",
                detail: fetchError,
                life: 3000
            });
    }, [fetchError]);

    const handlePriceChange = (rating: number, price: number) => {
        const clonedPrices = { ...prices };
        clonedPrices[rating] = price;
        onChange(clonedPrices);
    };

    const handleFetchPrices = async () => {
        const prices = await fetchPrices();
        prices && onChange(prices);
    };

    const clearPrices = () => {
        onChange({});
        event({ category: "PRICES", action: "CLEAR_ALL_PRICES" });
    };

    return (
        <>
            <div>
                <div className="grid">
                    {ratings.map((rating) => (
                        <div
                            key={"price_" + rating}
                            className="col-12 lg:col-4 md:col-6">
                            <div className="p-inputgroup">
                                <span
                                    className={`p-inputgroup-addon ${
                                        showWarning && !prices[rating]
                                            ? "text-yellow-500"
                                            : ""
                                    }`}>
                                    {rating}
                                </span>
                                <InputNumber
                                    placeholder=""
                                    value={prices[rating] || 0}
                                    onChange={(e) =>
                                        handlePriceChange(rating, e.value || 0)
                                    }
                                    showButtons
                                    min={0}
                                    step={500}
                                    useGrouping={false}
                                    onFocus={(event) => event.target.select()}
                                    tooltip={
                                        showWarning && !prices[rating]
                                            ? "Are you sure the price is 0 ?"
                                            : undefined
                                    }
                                    tooltipOptions={{
                                        position: "top"
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <span>
                    <NoPrerender>
                        <InlineTextWarning
                            show={
                                hoursSince(new Date(lastUpdated)) >
                                Config.oldPricesWarningThreshold
                            }>
                            Prices last updated{" "}
                            {timeSince(new Date(lastUpdated))} ago
                        </InlineTextWarning>
                    </NoPrerender>
                    <div className="mt-3 p-buttonset">
                        <Button
                            type="button"
                            label={isFetching ? "Fetching..." : "Fetch FUTBIN"}
                            className="p-button-rounded p-button-outlined w-7 md:w-auto"
                            onClick={handleFetchPrices}
                            icon={<span className="pi pi-sync mr-2"></span>}
                            loading={isFetching}
                            tooltip="Fetch prices from FUTBIN"
                            tooltipOptions={{
                                position: "top",
                                showDelay: 500
                            }}
                        />
                        <Button
                            type="button"
                            label="Clear All"
                            icon="pi pi-times"
                            className="p-button-rounded p-button-outlined w-5 md:w-auto"
                            disabled={isFetching}
                            onClick={() => clearPrices()}
                            tooltip="Set all prices to 0"
                            tooltipOptions={{
                                position: "top",
                                showDelay: 500
                            }}
                        />
                    </div>
                </span>
            </div>
            <div className="mt-4">
                <small>Specify the price for each rating</small>
                <br />
                <small>
                    <strong>Note!</strong> Only the prices for ratings 81 - 98
                    are available from FUTBIN
                </small>
            </div>
            <Toast ref={errorToast} />
        </>
    );
}
