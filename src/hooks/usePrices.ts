import axios from "axios";
import { useCallback, useState } from "react";
import Config from "../Config";
import { IPriceInfo } from "../interfaces/PriceInfo.interface";
import { sleep } from "../util/utils";
import { useAnalytics } from "./useAnalytics";

const FUTBIN_URL = "https://www.futbin.com/stc/cheapest";

export const usePrices = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const { event } = useAnalytics();

    const fetchPrices = useCallback(async (): Promise<IPriceInfo> => {
        setIsFetching(true);
        const [prices, errorMessage] = await fetchFutbinPrices();
        setFetchError(errorMessage);
        setIsFetching(false);
        event({
            action: "FUTBIN_FETCH",
            details: errorMessage
                ? `FUTBIN_ERROR=${errorMessage}`
                : "FUTBIN_SUCCESS"
        });
        return prices && errorMessage ? {} : prices;
    }, [event]);

    return {
        fetchPrices,
        fetchError,
        isFetching
    };
};

async function fetchFutbinPrices(): Promise<[IPriceInfo, string]> {
    const prices: IPriceInfo = {};
    let errorMessage = "";
    let attempts = 0;
    while (attempts < Config.maxPriceFetchAttempts) {
        try {
            const html = (await axios.get<string>(FUTBIN_URL)).data;
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const ratingGroups = doc.querySelectorAll(".top-stc-players-col");

            for (let i = 0; i < ratingGroups.length; i++) {
                const rating = Number(
                    ratingGroups[i]
                        .querySelector(".top-players-stc-title>span>span")
                        ?.innerHTML.trim()
                );
                const playerPrices: number[] = Array.from(
                    ratingGroups[i].querySelectorAll(".price-holder-row>span")
                ).map((span) => parsePrice(span.textContent?.trim()));

                if (rating) {
                    prices[rating] = Math.min(...playerPrices);
                }
            }
            errorMessage = "";
            break;
        } catch (error: unknown) {
            console.warn("Could not fetch player prices: ", error);
            if (typeof error === "string") {
                errorMessage = error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = "Unknown error";
            }
            attempts++;
            await sleep(Config.priceFetchCooldownMs);
        }
    }
    return [prices, errorMessage];
}

function parsePrice(text: string | undefined): number {
    if (!text) return 0;
    const isThousand = text.endsWith("K");
    const isMillion = text.endsWith("M");
    const num = parseFloat(text);
    return isThousand ? 1000 * num : isMillion ? 1000000 * num : num;
}
