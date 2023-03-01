import { Tooltip } from "@chakra-ui/react";
import React from "react";
import styles from "./HoverTooltip.module.scss";

interface HoverTooltipProps {
    children: React.ReactNode;
    label?: string;
    hasArrow?: boolean;
    placement?: "top" | "bottom" | "left" | "right";
}

export default function HoverTooltip(props: HoverTooltipProps) {
    return (
        <Tooltip
            hasArrow={props.hasArrow ?? true}
            label={props.label}
            aria-label={props.label}
            placement={props.placement ?? "top"}
            className={styles.tooltip}>
            {props.children}
        </Tooltip>
    );
}
