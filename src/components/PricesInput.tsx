import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef } from "react";
import Config from "../Config";
import { usePrices } from "../hooks/usePrices";
import {
    hoursToMilliseconds,
    millisecondsSince,
    timeSince
} from "../util/utils";
import InlineTextWarning from "./InlineTextWarning";

interface IPricesInputProps {
    ratings: number[];
}

export function PricesInput({ ratings }: IPricesInputProps) {
    const [pricesState, getPrice, setPrice, fetchPrices, clearPrices] =
        usePrices(Config.shouldMergeOldPrices);
    const errorToast = useRef<Toast>(null);

    useEffect(() => {
        if (!pricesState.fetchError) {
            return;
        }
        errorToast.current !== null &&
            errorToast.current.show({
                severity: "error",
                summary: "Could not fetch price data from FUTBIN",
                detail: pricesState.fetchError,
                life: 3000
            });
    }, [pricesState.fetchError]);

    return (
        <>
            <div>
                <div className="grid">
                    {ratings.map((rating) => (
                        <div
                            key={"price_" + rating}
                            className="col-12 lg:col-4 md:col-6">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    {rating}
                                </span>
                                <InputNumber
                                    placeholder=""
                                    value={getPrice(rating) || 0}
                                    onChange={(e) => setPrice(rating, e.value)}
                                    showButtons
                                    min={0}
                                    step={500}
                                    useGrouping={false}
                                    onFocus={(event) => event.target.select()}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <span>
                    <InlineTextWarning
                        show={
                            millisecondsSince(pricesState.lastUpdated) >
                            hoursToMilliseconds(
                                Config.oldPricesWarningThreshold
                            )
                        }>
                        Prices last updated {timeSince(pricesState.lastUpdated)}{" "}
                        ago
                    </InlineTextWarning>

                    <div className="mt-3 p-buttonset">
                        <Button
                            type="button"
                            label={
                                pricesState.isFetching
                                    ? "Fetching..."
                                    : "Fetch FUTBIN"
                            }
                            className="p-button-rounded p-button-outlined w-7 md:w-auto"
                            onClick={() => fetchPrices()}
                            icon={<span className="pi pi-sync mr-2"></span>}
                            loading={pricesState.isFetching}
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
                            disabled={pricesState.isFetching}
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
