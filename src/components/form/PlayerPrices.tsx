import { useConfig } from "@/context/ConfigContext";
import usePlayerPrices from "@/hooks/usePlayerPrices";
import { range, timeAgo } from "@/utilities";
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
    SimpleGrid
} from "@chakra-ui/react";
import { mdiClose, mdiDesktopTowerMonitor, mdiGamepadVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect } from "react";
import HoverTooltip from "../ui/HoverTooltip";

const PRICES_AGE_WARN_THRESHOLD_MS = 300_000; // 5m

export default function PlayerPrices() {
    const [config, setConfig] = useConfig();
    const prices = usePlayerPrices();

    const ratingRange = range(
        Math.min(...config.tryRatingMinMax),
        Math.max(...config.tryRatingMinMax)
    );

    useEffect(
        () =>
            setConfig((prev) => ({ ...prev, ratingPriceMap: prices.priceMap })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [prices.priceMap]
    );

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
                                prices.setPrice(rating, e.target.value)
                            }
                            placeholder="0"
                        />
                    </InputGroup>
                ))}
            </SimpleGrid>

            {prices.lastModified > 0 &&
                Date.now() - prices.lastModified >
                    PRICES_AGE_WARN_THRESHOLD_MS && (
                    <Box mt={5}>
                        <Alert status="info">
                            <AlertIcon />
                            <small>
                                Prices last updated{" "}
                                {timeAgo(new Date(prices.lastModified))}
                            </small>
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
                                        Futwiz
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
                                        Futbin
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
        </>
    );
}
