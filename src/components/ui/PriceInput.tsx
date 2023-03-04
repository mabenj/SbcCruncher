import { useEventTracker } from "@/hooks/useEventTracker";
import { prettyNumber } from "@/utilities";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
    Flex,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    useColorModeValue
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import HoverTooltip from "./HoverTooltip";

const PRICE_TIERS = [
    { min: 100_000, step: 1000 },
    { min: 50_000, step: 500 },
    { min: 10_000, step: 250 },
    { min: 1000, step: 100 },
    { min: 150, step: 50 },
    { min: 0, step: 150 }
];

const MAX_VALUE = 15_000_000;

export default function PriceInput({
    value,
    rating,
    onChange,
    loading
}: {
    value: number | undefined;
    rating: number;
    onChange: (value: number) => void;
    loading: boolean;
}) {
    const [inputValue, setInputValue] = useState<number | undefined>();
    const [isEditing, setIsEditing] = useState(false);

    const stepBgColor = useColorModeValue("gray.200", "whiteAlpha.200");

    const inputRef = useRef<HTMLInputElement | null>(null);

    const eventTracker = useEventTracker("Prices");

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const startEdit = () => {
        setIsEditing(true);
        setTimeout(() => inputRef.current?.select());
    };

    const endEdit = () => {
        let newValue = inputValue || 0;
        const step =
            PRICE_TIERS.find((tier) => tier.min <= newValue)?.step ?? 0;
        newValue = roundToNearestStep(newValue, step);
        setInputValue(newValue);

        setIsEditing(false);
        if (newValue !== value) {
            onChange(newValue);
            eventTracker(`set_price_${rating}`, `input=${rating}-${newValue}`, newValue);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            setInputValue(undefined);
            return;
        }
        let num: number | undefined = +e.target.value;
        if (isNaN(num) || typeof num !== "number") {
            num = undefined;
        }
        setInputValue(num ? Math.min(MAX_VALUE, num) : num);
    };

    const handleIncrement = () => {
        const increment =
            PRICE_TIERS.find((tier) => tier.min <= (value ?? 0))?.step ?? 0;
        const newValue = (value ?? 0) + increment;
        onChange(newValue);
        eventTracker(`set_price_${rating}`, `increment=${rating}-${newValue}`, newValue);
    };

    const handleDecrement = () => {
        const decrement =
            PRICE_TIERS.find((tier) => tier.min < (value ?? 0))?.step ?? 0;
        const newValue = Math.max(0, (value ?? 0) - decrement);
        onChange(newValue);
        eventTracker(`set_price_${rating}`, `decrement=${rating}-${newValue}`, newValue);
    };

    return (
        <InputGroup>
            <InputLeftAddon p={3}>
                <HoverTooltip label={`Price of ${rating} rated players`}>
                    <span>{rating}</span>
                </HoverTooltip>
            </InputLeftAddon>
            <Input
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]"
                value={
                    loading
                        ? 0
                        : (isEditing
                              ? inputValue
                              : prettyNumber(value || undefined)) || ""
                }
                onChange={handleInputChange}
                placeholder="0"
                onFocus={startEdit}
                onBlur={endEdit}
                title=""
                isDisabled={loading}
            />
            <InputRightAddon p={0}>
                <Flex mx={0} gap={0}>
                    <IconButton
                        size="md"
                        variant="ghost"
                        icon={<MinusIcon fontSize="2xs" />}
                        aria-label="Decrement"
                        onClick={handleDecrement}
                        isDisabled={loading || !value || value <= 0}
                        _hover={{ backgroundColor: stepBgColor }}
                    />
                    <IconButton
                        size="md"
                        variant="ghost"
                        icon={<AddIcon fontSize="2xs" />}
                        aria-label="Increment"
                        onClick={handleIncrement}
                        isDisabled={loading || (!!value && value >= MAX_VALUE)}
                        _hover={{ backgroundColor: stepBgColor }}
                    />
                </Flex>
            </InputRightAddon>
        </InputGroup>
    );
}

function roundToNearestStep(num: number, step: number) {
    return Math.round(num / step) * step;
}
