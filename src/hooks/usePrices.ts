import { useCallback, useEffect, useState } from "react";
import Config from "../Config";
import { IPriceInfo } from "../interfaces/PriceInfo.interface";
import { fetchFutbinPrices } from "../services/FutbinPrices.service";
import { getItemOrNull, setItem } from "../services/LocalStorage.service";
import { useAnalytics } from "./useAnalytics";

export const usePrices = (mergeNewWithOld: boolean = true) => {
    const { event } = useAnalytics();
    const [prices, setPrices] = useState<IPriceInfo>(
        getItemOrNull<IPriceInfo>(Config.priceDataStorageKey) || {}
    );
    const [lastUpdated, setLastUpdated] = useState<number | null>(
        getItemOrNull<number>(Config.pricesLastUpdatedStorageKey)
    );
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState("");

    useEffect(() => {
        if (prices) {
            setItem(Config.priceDataStorageKey, prices);
        }
    }, [prices]);

    const updateLastUpdatedAt = () => {
        const updateTime = Date.now();
        setLastUpdated(updateTime);
        setItem(Config.pricesLastUpdatedStorageKey, updateTime);
    };

    const getPrice = (rating: number) => {
        return prices[rating];
    };

    const setPrice = (rating: number, newPrice: number | null) => {
        if (newPrice === null) {
            setPrices((prev) => {
                const clone = { ...prev };
                delete clone[rating];
                return clone;
            });
        } else {
            setPrices((prev) => ({ ...prev, [rating]: newPrice }));
        }
        updateLastUpdatedAt();
    };

    const fetchPrices = useCallback(async () => {
        setIsFetching(true);
        const [prices, errorMessage] = await fetchFutbinPrices();
        setFetchError(errorMessage);
        if (prices && !errorMessage) {
            setPrices(
                mergeNewWithOld ? (prev) => ({ ...prev, ...prices }) : prices
            );
            updateLastUpdatedAt();
        }
        setIsFetching(false);
        event({
            action: "FUTBIN_FETCH",
            details: errorMessage
                ? `FUTBIN_ERROR=${errorMessage}`
                : "FUTBIN_SUCCESS"
        });
    }, [event, mergeNewWithOld]);

    const clearPrices = () => {
        setPrices({});
        updateLastUpdatedAt();
    };

    const pricesState = {
        allPrices: { ...prices },
        lastUpdated: lastUpdated ? new Date(lastUpdated) : new Date(),
        isFetching,
        fetchError
    };

    return [pricesState, getPrice, setPrice, fetchPrices, clearPrices] as const;
};
