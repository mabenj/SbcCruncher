import { useEventTracker } from "@/hooks/useEventTracker";
import useLocalStorage from "@/hooks/useLocalStorage";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Collapse,
    Flex,
    Heading,
    Popover,
    PopoverAnchor,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    Switch,
    Text
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import styles from "./AccentedCard.module.scss";

interface AccentedCardProps {
    header: string;
    infoParagraphs: string[];
    children: React.ReactNode;
    step: number;
    expandSwitch?: boolean;
    onExpandChange?: (isChecked: boolean) => void;
}

export default function AccentedCard({
    header,
    infoParagraphs,
    children,
    step,
    expandSwitch,
    onExpandChange
}: AccentedCardProps) {
    const [expanded, setExpanded] = useLocalStorage(
        `cardExpanded.${step}`,
        true
    );

    return (
        <div className={styles.card}>
            <Card borderTopRadius={0}>
                <CardHeader
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start">
                    <Flex alignItems="center" gap={3}>
                        <Heading size="md">{header}</Heading>
                        {expandSwitch && (
                            <Switch
                                colorScheme="brand"
                                isChecked={expanded}
                                onChange={(e) => {
                                    setExpanded(e.target.checked);
                                    onExpandChange &&
                                        onExpandChange(e.target.checked);
                                }}
                            />
                        )}
                    </Flex>
                    <HelpBtn step={step}>
                        {infoParagraphs.map((text, i) => (
                            <Text key={i} py={1}>
                                {text}
                            </Text>
                        ))}
                    </HelpBtn>
                </CardHeader>
                <Collapse in={expanded}>
                    <CardBody>
                        <Box pb={8}>{children}</Box>
                    </CardBody>
                </Collapse>
            </Card>
        </div>
    );
}

const HelpBtn = ({
    step,
    children
}: {
    step: number;
    children: React.ReactNode;
}) => {
    const initRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    const eventTracker = useEventTracker("Step help");

    return (
        <Popover
            isOpen={isHovering}
            onClose={() => setIsHovering(false)}
            initialFocusRef={initRef}
            closeOnBlur
            placement="bottom-end">
            <PopoverAnchor>
                <Button
                    size="sm"
                    variant="ghost"
                    cursor="help"
                    color="gray.500"
                    rightIcon={<QuestionOutlineIcon mb={0.5} />}
                    onMouseOver={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={(e) => {
                        e.stopPropagation();
                        eventTracker("click_step_help", step, step);
                    }}>
                    Step {step}
                </Button>
            </PopoverAnchor>
            <PopoverContent
                w="auto"
                maxW="min(30rem, 90vw)"
                onMouseOver={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}>
                <PopoverArrow />
                <PopoverBody ref={initRef}>{children}</PopoverBody>
            </PopoverContent>
        </Popover>
    );
};
