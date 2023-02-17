import { EMPTY_PRICES } from "@/constants";
import { useConfig } from "@/context/ConfigContext";
import { FutbinParser } from "@/external-prices/FutbinParser";
import { FutwizParser } from "@/external-prices/FutwizParser";
import { useEventTracker } from "@/hooks/useEventTracker";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
    capitalize,
    getErrorMessage,
    range,
    sleep,
    timeAgo
} from "@/utilities";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    SimpleGrid,
    useToast
} from "@chakra-ui/react";
import { mdiClose, mdiDesktopTowerMonitor, mdiGamepadVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import HoverTooltip from "../ui/HoverTooltip";

const PRICE_FETCH_MAX_ATTEMPTS = 3;
const PRICE_FETCH_COOLDOWN_MS = 2_000;
const EVENT_DEBOUNCE_MS = 3000;
const PRICE_MAP_OLD_THRESHOLD_MS = 300_000;

const URLS = {
    futbin: "https://www.futbin.com/stc/cheapest",
    futwiz: "/api/futwiz-cheapest"
};

const STORAGE_KEYS = {
    platform: "prices.platform",
    dataSource: "prices.dataSource",
    priceMap: "prices.current",
    cache: "prices.cache"
};

const PARSERS = {
    futbin: FutbinParser.fromHtml,
    futwiz: FutwizParser.fromHtml
};

type DataSource = "futbin" | "futwiz";
type Platform = "console" | "pc";

interface StoredPrices {
    priceMap: Record<number, number>;
    timestamp: number;
}

export default function PlayerPrices() {
    const [config, setConfig] = useConfig();
    const [pricesLastModified, setPricesLastModified] = useState(-1);
    const [isFetchingPrices, setIsFetchingPrices] = useState(false);
    const [dataSource, setDataSource] = useLocalStorage(
        STORAGE_KEYS.dataSource,
        "futwiz" as DataSource
    );
    const [platform, setPlatform] = useLocalStorage(
        STORAGE_KEYS.platform,
        "console" as Platform
    );

    const toast = useToast();

    const eventTracker = useEventTracker("Prices", EVENT_DEBOUNCE_MS);

    const ratingRange = range(
        Math.min(...config.tryRatingMinMax),
        Math.max(...config.tryRatingMinMax)
    );

    useEffect(() => {
        const storedPricesJson = localStorage.getItem(STORAGE_KEYS.priceMap);
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
        eventTracker("price_set_single=" + rating + "x" + price);
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
                STORAGE_KEYS.priceMap,
                JSON.stringify(storedPrices)
            );
            return { ...prev, ratingPriceMap: newPrices };
        });
    };

    const fetchPrices = async () => {
        setIsFetchingPrices(true);
        try {
            const prices = await fetchExternalPrices(dataSource, platform);
            const priceCount = Object.keys(prices).length;
            setAllPrices({ ...EMPTY_PRICES, ...prices }, Date.now());
            toast({
                status: "success",
                description: `Fetched prices for ${priceCount} ratings`
            });
            eventTracker(
                `price_fetch_ok=${dataSource}-${platform}x${priceCount}`
            );
        } catch (error) {
            toast({
                status: "error",
                title: "Could not fetch price data",
                description: "Wait for a few minutes and try again"
            });
            eventTracker(
                `price_fetch_error=${dataSource}-${platform}`,
                getErrorMessage(error)
            );
        } finally {
            setIsFetchingPrices(false);
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
                    PRICE_MAP_OLD_THRESHOLD_MS && (
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
                    <ButtonGroup isAttached>
                        <HoverTooltip
                            label={`Fetch ${platform} market prices from ${capitalize(
                                dataSource
                            )}`}>
                            <Button
                                isLoading={isFetchingPrices}
                                loadingText="Fetching data"
                                onClick={fetchPrices}
                                leftIcon={
                                    platform === "console" ? (
                                        <Icon
                                            path={mdiGamepadVariant}
                                            size={1}
                                        />
                                    ) : (
                                        <Icon
                                            path={mdiDesktopTowerMonitor}
                                            size={1}
                                        />
                                    )
                                }>
                                Auto-fill
                            </Button>
                        </HoverTooltip>

                        <Menu closeOnSelect={false}>
                            <HoverTooltip label="Auto-fill options">
                                <IconButton
                                    as={MenuButton}
                                    aria-label="Auto-fill options"
                                    icon={<ChevronDownIcon />}
                                />
                            </HoverTooltip>

                            <MenuList>
                                <MenuOptionGroup type="radio" value={platform}>
                                    <MenuItemOption
                                        value="console"
                                        onClick={() => setPlatform("console")}>
                                        <HStack justifyContent="space-between">
                                            <span>Console</span>
                                            <HoverTooltip label="Console market">
                                                <Icon
                                                    path={mdiGamepadVariant}
                                                    size={0.7}
                                                />
                                            </HoverTooltip>
                                        </HStack>
                                    </MenuItemOption>
                                    <MenuItemOption
                                        value="pc"
                                        isDisabled={dataSource === "futbin"}
                                        onClick={() => setPlatform("pc")}>
                                        <HStack justifyContent="space-between">
                                            <span>PC</span>
                                            <HoverTooltip label="PC market">
                                                <Icon
                                                    path={
                                                        mdiDesktopTowerMonitor
                                                    }
                                                    size={0.7}
                                                />
                                            </HoverTooltip>
                                        </HStack>
                                    </MenuItemOption>
                                </MenuOptionGroup>
                                <MenuDivider />
                                <MenuOptionGroup
                                    type="radio"
                                    value={dataSource}>
                                    <MenuItemOption
                                        value="futwiz"
                                        onClick={() => setDataSource("futwiz")}>
                                        Futwiz
                                    </MenuItemOption>
                                    <MenuItemOption
                                        value="futbin"
                                        isDisabled={platform === "pc"}
                                        onClick={() => setDataSource("futbin")}>
                                        Futbin
                                    </MenuItemOption>
                                </MenuOptionGroup>
                            </MenuList>
                        </Menu>
                    </ButtonGroup>

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

async function fetchExternalPrices(dataSource: DataSource, platform: Platform) {
    const PRICE_MAX_AGE_MS = 3_600_000; // 1h
    const GIMMICK_MS = 500; // 1h

    const cacheJson = localStorage.getItem(STORAGE_KEYS.cache);
    const cache = cacheJson
        ? (JSON.parse(cacheJson) as {
              [url: string]: {
                  timestamp: number;
                  priceMap: Record<number, number>;
              };
          })
        : {};

    const baseUrl = URLS[dataSource];
    const query = new URLSearchParams();
    if (dataSource !== "futbin") {
        query.append("platform", platform);
    }
    const url = baseUrl + "?" + query;
    if (Date.now() - cache[url]?.timestamp < PRICE_MAX_AGE_MS) {
        await sleep(GIMMICK_MS);
        return cache[url].priceMap;
    }

    const htmlParser = PARSERS[dataSource];
    let cheapestByRating: Record<number, number> = {};
    let errorMessage = "";
    let attempts = 0;

    while (attempts++ < PRICE_FETCH_MAX_ATTEMPTS) {
        try {
            const res = await fetch(url);
            const html = await res.text();
            cheapestByRating = htmlParser(html);

            if (Object.keys(cheapestByRating).length === 0) {
                throw new Error("No prices could be parsed");
            }

            errorMessage = "";
            break;
        } catch (error) {
            cheapestByRating = {};
            console.error("Could not fetch player prices: ", error);
            errorMessage = getErrorMessage(error) || "";
            await sleep(PRICE_FETCH_COOLDOWN_MS);
        }
    }

    if (errorMessage) {
        return Promise.reject(errorMessage);
    }

    if (dataSource !== "futbin") {
        // don't cache futbin
        cache[url] = {
            timestamp: Date.now(),
            priceMap: cheapestByRating
        };
    }
    localStorage.setItem(STORAGE_KEYS.cache, JSON.stringify(cache));
    return cheapestByRating;
}
