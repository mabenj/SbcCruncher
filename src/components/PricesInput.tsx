import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactGA from "react-ga";
import Config from "../Config";
import { IPriceInfo } from "../interfaces";
import { fetchFutbinPrices } from "../services/FutbinPrices.service";
import { getItemOrNull, setItem } from "../services/LocalStorage.service";

const SHOULD_MERGE_PRICES = true; // TODO: get as user input

interface IPricesInputProps {
    ratings: number[];
    onChange: (priceInfo: IPriceInfo) => void;
}

export function PricesInput({ ratings, onChange }: IPricesInputProps) {
    const errorToast = useRef<Toast>(null);
    const [prices, setPrices] = useState<IPriceInfo>(
        getItemOrNull<IPriceInfo>(Config.priceDataStorageKey) || {}
    );
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (prices) {
            setItem(Config.priceDataStorageKey, prices);
            onChange(prices);
        }
    }, [onChange, prices]);

    const handlePriceChange = (rating: number, newPrice: number | null) => {
        if (newPrice === null) {
            setPrices((prev) => {
                const clone = { ...prev };
                delete clone[rating];
                return clone;
            });
        } else {
            setPrices((prev) => ({ ...prev, [rating]: newPrice }));
        }
    };

    const handleFetchFutbin = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsFetching(true);
        const [prices, errorMessage] = await fetchFutbinPrices();
        if (errorMessage && errorToast.current !== null) {
            errorToast.current.show({
                severity: "error",
                summary: "Could not fetch price data from FUTBIN",
                detail: errorMessage,
                life: 3000
            });
        }
        if (prices && !errorMessage) {
            console.log({ prices });
            setPrices(
                SHOULD_MERGE_PRICES
                    ? (prev) => ({ ...prev, ...prices })
                    : prices
            );
        }
        setIsFetching(false);
        ReactGA.event({
            category: "FUTBIN",
            action: "FUTBIN_FETCH",
            label: errorMessage
                ? `FUTBIN_ERROR=${errorMessage}`
                : "FUTBIN_SUCCESS"
        });
    }, []);

    return (
        <>
            <Toast ref={errorToast} />
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
                                    value={prices[rating] || 0}
                                    onChange={(e) =>
                                        handlePriceChange(rating, e.value)
                                    }
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
                    <div className="mt-3 p-buttonset">
                        <Button
                            type="button"
                            label={isFetching ? "Fetching..." : "Fetch FUTBIN"}
                            className="p-button-rounded p-button-outlined w-8 md:w-auto"
                            onClick={handleFetchFutbin}
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
                            label="Clear"
                            icon="pi pi-times"
                            className="p-button-rounded p-button-outlined w-4 md:w-auto"
                            onClick={() => setPrices({})}
                            tooltip="Set prices to 0"
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
        </>
    );
}
