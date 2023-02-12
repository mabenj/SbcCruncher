import { EMPTY_PRICES } from "@/constants";
import { useConfig } from "@/context/ConfigContext";
import { useEventTracker } from "@/hooks/useEventTracker";
import { getErrorMessage, range, sleep, timeAgo } from "@/utilities";
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    ButtonGroup,
    Flex,
    Input,
    InputGroup,
    InputLeftAddon,
    SimpleGrid,
    useToast
} from "@chakra-ui/react";
import { mdiClose, mdiRefresh } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import HoverTooltip from "../ui/HoverTooltip";

const PRICE_STORAGE_KEY = "SBCCRUNCHER.PRICEMAP";
const PRICES_STALE_WARN_THRESHOLD_MS = 300_000;
const MAX_PRICE_FETCH_ATTEMPTS = 10;
const PRICE_FETCH_COOLDOWN_MS = 1000;
const FUTBIN_URL = "https://www.futbin.com/stc/cheapest";

interface StoredPrices {
    priceMap: Record<number, number>;
    timestamp: number;
}

export default function PlayerPrices() {
    const [config, setConfig] = useConfig();
    const [pricesLastModified, setPricesLastModified] = useState(-1);
    const [isFetchingPrices, setIsFetchingPrices] = useState(false);
    const toast = useToast();

    const eventTracker = useEventTracker("Prices");

    const ratingRange = range(
        Math.min(...config.tryRatingMinMax),
        Math.max(...config.tryRatingMinMax)
    );

    useEffect(() => {
        const storedPricesJson = localStorage.getItem(PRICE_STORAGE_KEY);
        if (storedPricesJson) {
            const storedPrices = JSON.parse(storedPricesJson) as StoredPrices;
            setAllPrices(storedPrices.priceMap, storedPrices.timestamp);
            setPricesLastModified(storedPrices.timestamp);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setSinglePrice = (rating: number, price: string) => {
        let priceNum = +price;
        priceNum =
            isNaN(priceNum) || typeof priceNum !== "number" ? 0 : priceNum;
        config.ratingPriceMap[rating] = priceNum;
        setAllPrices(config.ratingPriceMap, Date.now());
    };

    const setAllPrices = (
        prices: Record<number, number>,
        timestamp: number
    ) => {
        setPricesLastModified(timestamp);
        setConfig((prev) => {
            const prevPrices = prev.ratingPriceMap;
            const newPrices = { ...prevPrices, ...prices };
            const storedPrices: StoredPrices = {
                priceMap: newPrices,
                timestamp
            };
            localStorage.setItem(
                PRICE_STORAGE_KEY,
                JSON.stringify(storedPrices)
            );
            return { ...prev, ratingPriceMap: newPrices };
        });
    };

    const fetchPrices = async () => {
        setIsFetchingPrices(true);
        const [prices, errorMessage] = await fetchFutbinPrices();
        setIsFetchingPrices(false);

        if (errorMessage) {
            toast({
                status: "error",
                title: "Price fetch failed",
                description: "Try again after a while"
            });
            eventTracker("price_fetch_fail", errorMessage);
        } else {
            toast({
                status: "success",
                description: "Price fetch success"
            });
            setAllPrices(prices, Date.now());
            eventTracker("price_fetch_ok");
        }
    };

    const clearAllPrices = () => {
        setAllPrices({ ...EMPTY_PRICES }, Date.now());
        eventTracker("price_clear_all");
    };

    return (
        <>
            <SimpleGrid minChildWidth="9rem" spacing={[2, 2, 3, null, 5]}>
                {ratingRange.map((rating) => (
                    <InputGroup key={rating}>
                        <InputLeftAddon p={2}>
                            <HoverTooltip
                                label={`Price for ${rating} rated players`}>
                                <span>{rating}</span>
                            </HoverTooltip>
                        </InputLeftAddon>
                        <Input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]"
                            value={config.ratingPriceMap[rating] || ""}
                            onChange={(e) =>
                                setSinglePrice(rating, e.target.value)
                            }
                            placeholder="0"
                        />
                    </InputGroup>
                ))}
            </SimpleGrid>

            {pricesLastModified > 0 &&
                Date.now() - pricesLastModified >
                    PRICES_STALE_WARN_THRESHOLD_MS && (
                    <Box mt={5}>
                        <Alert status="info">
                            <AlertIcon />
                            <small>
                                Prices last updated{" "}
                                {timeAgo(new Date(pricesLastModified))}
                            </small>
                        </Alert>
                    </Box>
                )}

            <Flex justifyContent={["center", null, "flex-start"]}>
                <ButtonGroup colorScheme="gray" variant="solid" mt={10}>
                    <HoverTooltip label="Fetch prices from FUTBIN">
                        <Button
                            leftIcon={<Icon path={mdiRefresh} size={0.8} />}
                            onClick={fetchPrices}
                            loadingText="Fetching"
                            isLoading={isFetchingPrices}>
                            Fetch FUTBIN
                        </Button>
                    </HoverTooltip>
                    <HoverTooltip label="Set all prices to 0">
                        <Button
                            leftIcon={<Icon path={mdiClose} size={0.8} />}
                            onClick={clearAllPrices}>
                            Reset
                        </Button>
                    </HoverTooltip>
                </ButtonGroup>
            </Flex>
        </>
    );
}

async function fetchFutbinPrices() {
    let prices: Record<number, number> = {};
    let errorMessage = "";
    let attempts = 0;

    while (attempts++ < MAX_PRICE_FETCH_ATTEMPTS) {
        try {
            const html = await (await fetch(FUTBIN_URL)).text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const ratingGroups = doc.querySelectorAll(".top-stc-players-col");

            for (let i = 0; i < ratingGroups.length; i++) {
                const rating = parseInt(
                    ratingGroups[i]
                        .querySelector(".top-players-stc-title>span>span")
                        ?.innerHTML.trim() ?? "-1"
                );
                const playerPrices: number[] = Array.from(
                    ratingGroups[i].querySelectorAll(".price-holder-row>span")
                ).map((span) => parsePrice(span.textContent?.trim()));

                if (!isNaN(rating) && rating > 0) {
                    prices[rating] = Math.min(...playerPrices);
                }
            }

            break;
        } catch (error) {
            prices = {};
            console.error("Could not fetch player prices: ", error);
            errorMessage = getErrorMessage(error);
            await sleep(PRICE_FETCH_COOLDOWN_MS);
        }
    }

    return [prices, errorMessage] as const;
}

function parsePrice(text: string | undefined) {
    if (!text) {
        return 0;
    }
    const isThousand = text.endsWith("K");
    const isMillion = text.endsWith("M");
    const num = parseFloat(text);
    return isThousand ? 1000 * num : isMillion ? 1000000 * num : num;
}
