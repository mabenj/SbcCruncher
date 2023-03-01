import { useConfig } from "@/context/ConfigContext";
import usePlayerPrices from "@/hooks/usePlayerPrices";
import { PriceProvider } from "@/types/price-provider.interface";
import { range, timeAgo } from "@/utilities";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    ButtonGroup,
    Collapse,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    SimpleGrid,
    useColorModeValue
} from "@chakra-ui/react";
import { mdiControllerClassicOutline, mdiDesktopTowerMonitor } from "@mdi/js";
import Icon from "@mdi/react";
import { LegacyRef, useEffect, useRef } from "react";
import HoverTooltip from "../ui/HoverTooltip";
import PriceInput from "../ui/PriceInput";

const PRICES_AGE_WARN_THRESHOLD_MS = 30 * 60 * 1000; // 30m
const CONSOLE_SOURCES: PriceProvider[] = [
    {
        id: "Futbin",
        platform: "console"
    },
    {
        id: "Futwiz",
        platform: "console"
    }
];

const PC_SOURCES: PriceProvider[] = [
    {
        id: "Futwiz",
        platform: "PC"
    }
];

export default function PlayerPrices() {
    const [config, setConfig] = useConfig();
    const prices = usePlayerPrices();

    const ratingRange = range(
        Math.min(...config.tryRatingMinMax),
        Math.max(...config.tryRatingMinMax)
    );

    const allZeroes = ratingRange.every((r) => !config.ratingPriceMap[r]);

    useEffect(
        () =>
            setConfig((prev) => ({ ...prev, ratingPriceMap: prices.priceMap })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [prices.priceMap]
    );

    const setAutoFillSource = (provider: PriceProvider) => {
        prices.setExternalSource(provider);
        prices.autofillExternalPrices(provider);
    };

    return (
        <>
            <SimpleGrid minChildWidth="15rem" spacing={[2, 2, 3, null, 5]}>
                {ratingRange.map((rating) => (
                    <PriceInput
                        key={rating}
                        rating={rating}
                        value={config.ratingPriceMap[rating]}
                        onChange={(price) => prices.setPrice(rating, price)}
                        loading={prices.isFetching}
                    />
                ))}
            </SimpleGrid>

            <Box mt="2rem">
                <Collapse
                    in={
                        prices.lastModified > 0 &&
                        Date.now() - prices.lastModified >
                            PRICES_AGE_WARN_THRESHOLD_MS
                    }
                    animateOpacity>
                    <Box>
                        <Alert status="info" variant="left-accent">
                            <AlertIcon />
                            Prices last updated{" "}
                            {timeAgo(new Date(prices.lastModified))}
                        </Alert>
                    </Box>
                </Collapse>

                <Collapse in={allZeroes} animateOpacity>
                    <Box mt="1rem">
                        <Alert
                            status="warning"
                            variant="left-accent"
                            display="flex"
                            flexDirection={["column", null, "row"]}>
                            <AlertIcon />
                            <AlertTitle>No prices specified!</AlertTitle>
                            <AlertDescription
                                textAlign={["center", null, "left"]}>
                                Use Auto-fill or specify them manually.
                            </AlertDescription>
                        </Alert>
                    </Box>
                </Collapse>
            </Box>

            <Flex justifyContent={["center", null, "flex-start"]}>
                <ButtonGroup colorScheme="gray" variant="solid" mt={10}>
                    <ButtonGroup isAttached>
                        <HoverTooltip
                            label={`Auto-fill from ${prices.externalSource.id} (${prices.externalSource.platform})`}>
                            <Button
                                isLoading={prices.isFetching}
                                loadingText="Fetching data"
                                onClick={() => prices.autofillExternalPrices()}
                                leftIcon={
                                    prices.externalSource.platform ===
                                    "console" ? (
                                        <Icon
                                            path={mdiControllerClassicOutline}
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

                        <AutoFillMenu
                            disabled={prices.isFetching}
                            onItemSelected={setAutoFillSource}
                            activeItem={prices.externalSource}
                        />
                    </ButtonGroup>

                    <HoverTooltip label="Set all prices to 0">
                        <Button
                            variant="ghost"
                            onClick={prices.clearAll}
                            isDisabled={prices.isFetching}>
                            Reset
                        </Button>
                    </HoverTooltip>
                </ButtonGroup>
            </Flex>
        </>
    );
}

const AutoFillMenu = ({
    onItemSelected,
    disabled,
    activeItem
}: {
    onItemSelected: (item: PriceProvider) => void;
    disabled: boolean;
    activeItem: PriceProvider;
}) => {
    const initialFocusRef = useRef(null);
    const splitBtnBorderColor = useColorModeValue("gray.200", "gray.600");

    return (
        <Menu initialFocusRef={initialFocusRef}>
            <IconButton
                as={MenuButton}
                aria-label="Auto-fill options"
                icon={<ChevronDownIcon />}
                borderLeft="1px solid"
                borderColor={splitBtnBorderColor}
                isDisabled={disabled}
            />

            <MenuList>
                <MenuGroup title="Console">
                    {CONSOLE_SOURCES.map((source, i) => (
                        <AutoFillMenuItem
                            key={i}
                            priceSource={source}
                            onClick={() => onItemSelected(source)}
                            initialFocusRef={
                                activeItem.id === source.id &&
                                activeItem.platform == source.platform
                                    ? initialFocusRef
                                    : undefined
                            }
                        />
                    ))}
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title="PC">
                    {PC_SOURCES.map((source, i) => (
                        <AutoFillMenuItem
                            key={i}
                            priceSource={source}
                            onClick={() => onItemSelected(source)}
                            initialFocusRef={
                                activeItem.id === source.id &&
                                activeItem.platform == source.platform
                                    ? initialFocusRef
                                    : undefined
                            }
                        />
                    ))}
                </MenuGroup>
            </MenuList>
        </Menu>
    );
};

const AutoFillMenuItem = ({
    priceSource,
    onClick,
    initialFocusRef
}: {
    priceSource: PriceProvider;
    onClick: () => void;
    initialFocusRef?: LegacyRef<HTMLButtonElement>;
}) => {
    return (
        <MenuItem ref={initialFocusRef} onClick={onClick}>
            <Flex
                w="100%"
                justifyContent="space-between"
                alignItems="center"
                minH="2rem">
                <Flex alignItems="center" gap={2}>
                    <Box color="gray.500">
                        <Icon
                            path={
                                priceSource.platform === "console"
                                    ? mdiControllerClassicOutline
                                    : mdiDesktopTowerMonitor
                            }
                            size={0.8}
                        />
                    </Box>
                    <Box>{priceSource.id}</Box>
                </Flex>
                <HoverTooltip label="Available ratings" placement="right">
                    <Box color="gray.500">
                        {priceSource.id === "Futbin" && <span>81 - 98</span>}
                        {priceSource.id === "Futwiz" && <span>82 - 98</span>}
                    </Box>
                </HoverTooltip>
            </Flex>
        </MenuItem>
    );
};
