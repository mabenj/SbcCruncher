import React from "react";
import { useAnalytics } from "../hooks/useAnalytics";

interface ILinkProps {
    href?: string;
    children: React.ReactNode;
    className?: string;
    openInSameTab?: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export function Link({
    href,
    children,
    className,
    openInSameTab = false,
    style,
    onClick
}: ILinkProps) {
    const { event } = useAnalytics();

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
        event({ action: "LINK_CLICK", details: { href } });
    };

    return (
        <a
            href={href}
            target={openInSameTab ? "_self" : "_blank"}
            rel="noreferrer"
            className={className}
            style={style}
            onClick={handleClick}>
            {children}
        </a>
    );
}
