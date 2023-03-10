import { EMPTY_PRICES } from "@/constants";
import { PricesDto } from "@/types/prices-dto.interface";
import { getErrorMessage, getRandomInt, sleep } from "@/utilities";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useEventTracker } from "./useEventTracker";
import useLocalStorage from "./useLocalStorage";

const CACHE_MAX_AGE_MS = 15 * 60 * 1000; // 15min
const DUMMY_DELAY_MS = 500;

const BASE_API_URL = "/api/prices";

const STORAGE_KEYS = {
    externalSource: "prices.dataSource",
    priceMap: "prices.current",
    cache: "prices.cache"
};

interface StoredPrices {
    priceMap: { [rating: number]: number };
    lastModified: number;
}

interface PriceProvider {
    id: "Futbin" | "Futwiz";
    platform: "console" | "PC";
}

function usePlayerPrices() {
    const [storedPrices, setStoredPrices] = useLocalStorage<StoredPrices>(
        STORAGE_KEYS.priceMap,
        {
            priceMap: {},
            lastModified: -1
        }
    );
    const [externalSource, setExternalSource] = useLocalStorage<PriceProvider>(
        STORAGE_KEYS.externalSource,
        { id: "Futbin", platform: "console" }
    );
    const [isFetching, setIsFetching] = useState(false);

    const toast = useToast();

    const autoFillEventTracker = useEventTracker("Autofill");
    const pricesEventTracker = useEventTracker("Prices");

    const autofillExternalPrices = async () => {
        setIsFetching(true);
        try {
            const [priceMap, cacheStatus] = await fetchExternalPrices(
                externalSource
            );
            setAllPrices(priceMap);
            toast({
                status: "success",
                description: `Prices from ${externalSource.id} filled automatically`
            });
            autoFillEventTracker(
                `autofill_ok_${externalSource.id}_${externalSource.platform}`,
                `localCache=${cacheStatus}`,
                cacheStatus === "HIT" ? 1 : -1
            );
        } catch (error) {
            toast({
                status: "error",
                title: `Could not fetch price data from ${externalSource.id} (${externalSource.platform})`,
                description: "Wait for a few minutes and try again"
            });
            autoFillEventTracker(
                `autofill_error_${externalSource.id}_${externalSource.platform}`,
                getErrorMessage(error) || "unknown_error"
            );
        } finally {
            setIsFetching(false);
        }
    };

    const clearAll = () => {
        setAllPrices(EMPTY_PRICES);
        pricesEventTracker("prices_clear_all", "clear_all");
    };

    const setPrice = (rating: number, price: number) => {
        storedPrices.priceMap[rating] = price;
        setAllPrices(storedPrices.priceMap);
    };

    const setAllPrices = (priceMap: Record<number, number>) => {
        setStoredPrices({
            lastModified: Date.now(),
            priceMap: { ...EMPTY_PRICES, ...priceMap }
        });
    };

    return {
        priceMap: storedPrices.priceMap,
        lastModified: storedPrices.lastModified,
        externalSource: externalSource,
        isFetching: isFetching,
        setPrice: setPrice,
        clearAll: clearAll,
        setExternalSource: setExternalSource,
        autofillExternalPrices: autofillExternalPrices
    };
}

export default usePlayerPrices;

async function fetchExternalPrices(priceProvider: PriceProvider) {
    const cacheJson = localStorage.getItem(STORAGE_KEYS.cache);
    const cache = (cacheJson ? JSON.parse(cacheJson) : {}) as {
        [url: string]: StoredPrices;
    };

    const query = new URLSearchParams({
        platform: priceProvider.platform.toLowerCase(),
        datasource: priceProvider.id.toLowerCase()
    });
    const url = BASE_API_URL + "?" + query;

    const cacheHit = !!cache[url];
    const cacheFresh =
        cacheHit && Date.now() - cache[url].lastModified < CACHE_MAX_AGE_MS;
    const cacheStatus =
        cacheHit && cacheFresh ? "HIT" : cacheHit ? "EXPIRED" : "MISS";
    if (cacheHit && cacheFresh) {
        await sleep(getRandomInt(DUMMY_DELAY_MS, 4 * DUMMY_DELAY_MS));
        return [cache[url].priceMap, cacheStatus] as const;
    }

    const responseJson = (await (await fetch(url)).json()) as PricesDto;
    if (responseJson.status === "error") {
        throw new Error("Error fetching price data");
    }

    const cheapestByRating = responseJson.prices.reduce((acc, curr) => {
        acc[curr.rating] = curr.price;
        return acc;
    }, {} as Record<number, number>);
    cache[url] = {
        lastModified: Date.now(),
        priceMap: cheapestByRating
    };
    localStorage.setItem(STORAGE_KEYS.cache, JSON.stringify(cache));

    return [cheapestByRating, cacheStatus] as const;
}
