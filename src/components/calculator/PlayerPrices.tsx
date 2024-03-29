import { range, timeAgo } from "@/common/utilities";
import { useConfig } from "@/context/ConfigContext";
import usePlayerPrices from "@/hooks/usePlayerPrices";
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
import {
    mdiAutorenew,
    mdiControllerClassicOutline,
    mdiDesktopTowerMonitor
} from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect } from "react";
import HoverTooltip from "../ui/HoverTooltip";
import PriceInput from "../ui/PriceInput";

const PRICES_AGE_WARN_THRESHOLD_MS = 30 * 60 * 1000; // 30m

export default function PlayerPrices() {
    const [config, setConfig] = useConfig();
    const prices = usePlayerPrices();

    const splitBtnBorderColor = useColorModeValue("gray.200", "gray.600");

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
        <Flex direction="column" gap="3rem">
            <Flex justifyContent={["center", "flex-start"]}>
                <ButtonGroup colorScheme="gray" variant="solid">
                    <ButtonGroup isAttached>
                        <HoverTooltip
                            label={`Get prices from ${prices.externalSource.id} (${prices.externalSource.platform})`}>
                            <Button
                                isLoading={prices.isFetching}
                                loadingText="Fetching data"
                                onClick={prices.autofillExternalPrices}
                                leftIcon={
                                    <Icon path={mdiAutorenew} size={0.9} />
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
                                    isDisabled={prices.isFetching}
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
                                            <HoverTooltip
                                                label="Console market"
                                                placement="right">
                                                <Box color="gray.500">
                                                    <Icon
                                                        path={
                                                            mdiControllerClassicOutline
                                                        }
                                                        size={1}
                                                    />
                                                </Box>
                                            </HoverTooltip>
                                        </HStack>
                                    </MenuItemOption>
                                    <MenuItemOption
                                        value="PC"
                                        onClick={() =>
                                            prices.setExternalSource({
                                                ...prices.externalSource,
                                                platform: "PC"
                                            })
                                        }>
                                        <HStack justifyContent="space-between">
                                            <span>PC</span>
                                            <HoverTooltip
                                                label="PC market"
                                                placement="right">
                                                <Box color="gray.500">
                                                    <Icon
                                                        path={
                                                            mdiDesktopTowerMonitor
                                                        }
                                                        size={1}
                                                    />
                                                </Box>
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
                                        <span>Futwiz</span>
                                    </MenuItemOption>
                                    <MenuItemOption
                                        value="Futbin"
                                        onClick={() =>
                                            prices.setExternalSource({
                                                ...prices.externalSource,
                                                id: "Futbin"
                                            })
                                        }>
                                        <span>Futbin</span>
                                    </MenuItemOption>
                                </MenuOptionGroup>
                            </MenuList>
                        </Menu>
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
                <Box>
                    <Alert
                        status="error"
                        variant="left-accent"
                        display="flex"
                        flexDirection={["column", null, "row"]}>
                        <AlertIcon />
                        <AlertTitle>Price data missing!</AlertTitle>
                        <AlertDescription textAlign={["center", null, "left"]}>
                            Use Auto-fill or enter prices manually
                        </AlertDescription>
                    </Alert>
                </Box>
            </Collapse>
        </Flex>
    );
}
