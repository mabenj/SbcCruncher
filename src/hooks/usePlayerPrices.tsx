import { EMPTY_PRICES } from "@/constants";
import { getErrorMessage, sleep } from "@/utilities";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useEventTracker } from "./useEventTracker";
import useLocalStorage from "./useLocalStorage";

const PRICE_FETCH_MAX_ATTEMPTS = 3;
const PRICE_FETCH_COOLDOWN_MS = 2000;
const TRACKER_DEBOUNCE_MS = 3000;
const DUMMY_DELAY_MS = 500;
const CACHE_MAX_AGE_MS = 3_600_000; // 1h

const URLS = {
    Futbin: "https://www.futbin.com/stc/cheapest",
    Futwiz: "/api/futwiz-cheapest"
};

const STORAGE_KEYS = {
    externalPlatform: "prices.platform",
    externalSource: "prices.dataSource",
    priceMap: "prices.current",
    cache: "prices.cache"
};

const PARSERS = {
    Futbin: parseFutbin,
    Futwiz: parseFutwiz
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
        { id: "Futwiz", platform: "console" }
    );
    const [isFetching, setIsFetching] = useState(false);

    const eventTracker = useEventTracker("Prices", TRACKER_DEBOUNCE_MS);
    const toast = useToast();

    const autofillExternalPrices = async () => {
        setIsFetching(true);
        try {
            const { priceMap, localCache, remoteCache } =
                await fetchExternalPrices(externalSource);
            const priceCount = Object.keys(priceMap).length;
            setAllPrices(priceMap);
            toast({
                status: "success",
                description: `Fetched prices for ${priceCount} ratings`
            });
            eventTracker(
                `price_fetch_ok=${externalSource.id}-${externalSource.platform}-L_${localCache}-R_${remoteCache}`
            );
        } catch (error) {
            toast({
                status: "error",
                title: "Could not fetch price data",
                description: "Wait for a few minutes and try again"
            });
            eventTracker(
                `price_fetch_error=${externalSource.id}-${externalSource.platform}`,
                getErrorMessage(error)
            );
        } finally {
            setIsFetching(false);
        }
    };

    const clearAll = () => {
        setAllPrices(EMPTY_PRICES);
        eventTracker("price_clear_all");
    };

    const setPrice = (rating: number, price: string) => {
        let priceNum = +price;
        priceNum =
            isNaN(priceNum) || typeof priceNum !== "number" ? 0 : priceNum;
        storedPrices.priceMap[rating] = priceNum;
        setAllPrices(storedPrices.priceMap);
        eventTracker("price_set=" + rating + "-" + price);
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

    const baseUrl = URLS[priceProvider.id];
    const query = new URLSearchParams();
    if (priceProvider.id !== "Futbin") {
        query.append("platform", priceProvider.platform.toLowerCase());
    }
    const url = baseUrl + "?" + query;

    const cacheHit = !!cache[url];
    const cacheFresh =
        cacheHit && Date.now() - cache[url].lastModified < CACHE_MAX_AGE_MS;
    const localCache =
        cacheHit && cacheFresh ? "HIT" : cacheHit ? "EXPIRED" : "MISS";
    let remoteCache = "MISS";
    if (cacheHit && cacheFresh) {
        await sleep(DUMMY_DELAY_MS);
        return {
            priceMap: cache[url].priceMap,
            localCache,
            remoteCache
        };
    }

    const htmlParser = PARSERS[priceProvider.id];
    let cheapestByRating: Record<number, number> = {};
    let errorMessage = "";
    let attempts = 0;

    while (attempts++ < PRICE_FETCH_MAX_ATTEMPTS) {
        try {
            const res = await fetch(url);
            remoteCache = res.headers.get("X-Function-Cache") || "MISS";
            const html = await res.text();
            const domParser = new DOMParser();
            const doc = domParser.parseFromString(html, "text/html");
            cheapestByRating = htmlParser(doc);

            if (Object.keys(cheapestByRating).length === 0) {
                throw new Error("No prices could be parsed");
            }

            errorMessage = "";
            break;
        } catch (error) {
            cheapestByRating = {};
            console.warn("Could not fetch player prices: ", error);
            errorMessage = getErrorMessage(error) || "";
            await sleep(PRICE_FETCH_COOLDOWN_MS);
        }
    }

    if (errorMessage) {
        return Promise.reject(errorMessage);
    }

    if (priceProvider.id !== "Futbin") {
        // don't cache futbin
        cache[url] = {
            lastModified: Date.now(),
            priceMap: cheapestByRating
        };
    }
    localStorage.setItem(STORAGE_KEYS.cache, JSON.stringify(cache));

    return { priceMap: cheapestByRating, localCache, remoteCache };
}

function parseFutbin(htmlDoc: Document) {
    const cheapestByRating: Record<number, number> = {};

    const ratingGroups = htmlDoc.querySelectorAll(".top-stc-players-col");
    ratingGroups.forEach((group) => {
        const rating = parseInt(
            group
                .querySelector(".top-players-stc-title>span>span")
                ?.innerHTML.trim() ?? "-1"
        );
        if (isNaN(rating) || rating === -1) {
            return;
        }
        const spans = group.querySelectorAll(".price-holder-row>span");
        const playerPrices = Array.from(spans).map((span) =>
            parsePrice(span.textContent?.trim())
        );
        if (playerPrices.length === 0) {
            return;
        }

        cheapestByRating[rating] = Math.min(...playerPrices);
    });

    return cheapestByRating;
}

function parseFutwiz(htmlDoc: Document) {
    const cheapestByRating: Record<number, number> = {};

    const ratingColumns = htmlDoc.querySelectorAll(
        ".col-4[style='padding-right:0px;']"
    );
    ratingColumns.forEach((column) => {
        const rating = parseInt(
            column.querySelector(".title")?.innerHTML.trim() ?? "-1"
        );
        if (isNaN(rating) || rating === -1) {
            return;
        }
        const playersBins = column.querySelectorAll(".bin");
        const playerPrices = Array.from(playersBins).map((bin) =>
            parsePrice(bin.textContent?.trim())
        );
        if (playerPrices.length === 0) {
            return;
        }

        cheapestByRating[rating] = Math.min(...playerPrices);
    });

    return cheapestByRating;
}

function parsePrice(text: string | undefined) {
    if (!text) {
        return 0;
    }
    const isThousand = text.endsWith("K");
    const isMillion = text.endsWith("M");
    const num = parseFloat(text);
    const result = isThousand ? 1000 * num : isMillion ? 1_000_000 * num : num;
    if (
        isNaN(result) ||
        result === Number.POSITIVE_INFINITY ||
        result === Number.NEGATIVE_INFINITY
    ) {
        throw new Error("Error parsing price '" + text + "'");
    }
    return result;
}
