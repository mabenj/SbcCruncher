import { useConfig } from "@/context/ConfigContext";
import usePlayerPrices from "@/hooks/usePlayerPrices";
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
    Flex,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    SimpleGrid,
    useColorModeValue
} from "@chakra-ui/react";
import { mdiClose, mdiDesktopTowerMonitor, mdiGamepadVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect } from "react";
import HoverTooltip from "../ui/HoverTooltip";
import PriceInput from "../ui/PriceInput";

const PRICES_AGE_WARN_THRESHOLD_MS = 30 * 60 * 1000; // 30m

export default function PlayerPrices() {
    const [config, setConfig] = useConfig();
    const prices = usePlayerPrices();

    const splitBtnBorderColor = useColorModeValue("gray.300", "gray.500");

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

    return (
        <>
            <SimpleGrid minChildWidth="15rem" spacing={[2, 2, 3, null, 5]}>
                {ratingRange.map((rating) => (
                    <PriceInput
                        key={rating}
                        rating={rating}
                        value={config.ratingPriceMap[rating]}
                        onChange={(price) => prices.setPrice(rating, price)}
                    />
                ))}
            </SimpleGrid>

            {prices.lastModified > 0 &&
                Date.now() - prices.lastModified >
                    PRICES_AGE_WARN_THRESHOLD_MS && (
                    <Box mt={5}>
                        <Alert status="info" variant="left-accent">
                            <AlertIcon />
                            Prices last updated{" "}
                            {timeAgo(new Date(prices.lastModified))}
                        </Alert>
                    </Box>
                )}

            <Flex justifyContent={["center", null, "flex-start"]}>
                <ButtonGroup colorScheme="gray" variant="solid" mt={10}>
                    <ButtonGroup isAttached>
                        <HoverTooltip
                            label={`Fetch ${prices.externalSource.platform} market prices from ${prices.externalSource.id}`}>
                            <Button
                                isLoading={prices.isFetching}
                                loadingText="Fetching data"
                                onClick={prices.autofillExternalPrices}
                                leftIcon={
                                    prices.externalSource.platform ===
                                    "console" ? (
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
                                    borderLeft="1px solid"
                                    borderColor={splitBtnBorderColor}
                                />
                            </HoverTooltip>

                            <MenuList>
                                <MenuOptionGroup
                                    type="radio"
                                    value={prices.externalSource.platform}>
                                    <MenuItemOption
                                        value="console"
                                        onClick={() =>
                                            prices.setExternalSource({
                                                ...prices.externalSource,
                                                platform: "console"
                                            })
                                        }>
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
                                        value="PC"
                                        isDisabled={
                                            prices.externalSource.id ===
                                            "Futbin"
                                        }
                                        onClick={() =>
                                            prices.setExternalSource({
                                                ...prices.externalSource,
                                                platform: "PC"
                                            })
                                        }>
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
                                    value={prices.externalSource.id}>
                                    <MenuItemOption
                                        value="Futwiz"
                                        onClick={() =>
                                            prices.setExternalSource({
                                                ...prices.externalSource,
                                                id: "Futwiz"
                                            })
                                        }>
                                        <Flex justifyContent="space-between">
                                            <span>Futwiz</span>
                                            <HoverTooltip label="Available ratings">
                                                <span>82 - 98</span>
                                            </HoverTooltip>
                                        </Flex>
                                    </MenuItemOption>
                                    <MenuItemOption
                                        value="Futbin"
                                        isDisabled={
                                            prices.externalSource.platform ===
                                            "PC"
                                        }
                                        onClick={() =>
                                            prices.setExternalSource({
                                                ...prices.externalSource,
                                                id: "Futbin"
                                            })
                                        }>
                                        <Flex justifyContent="space-between">
                                            <span>Futbin</span>
                                            <HoverTooltip label="Available ratings">
                                                <span>81 - 98</span>
                                            </HoverTooltip>
                                        </Flex>
                                    </MenuItemOption>
                                </MenuOptionGroup>
                            </MenuList>
                        </Menu>
                    </ButtonGroup>

                    <HoverTooltip label="Set all prices to 0">
                        <Button
                            leftIcon={<Icon path={mdiClose} size={0.8} />}
                            onClick={prices.clearAll}>
                            Reset
                        </Button>
                    </HoverTooltip>
                </ButtonGroup>
            </Flex>

            {allZeroes && (
                <Box mt="3rem">
                    <Alert
                        status="warning"
                        variant="left-accent"
                        display="flex"
                        flexDirection={["column", null, "row"]}>
                        <AlertIcon />
                        <AlertTitle>No prices specified!</AlertTitle>
                        <AlertDescription textAlign={["center", null, "left"]}>
                            Use Auto-fill or specify them manually.
                        </AlertDescription>
                    </Alert>
                </Box>
            )}
        </>
    );
}
