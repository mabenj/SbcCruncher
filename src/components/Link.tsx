import React from "react";

interface ILinkProps {
    href?: string;
    children: React.ReactNode;
    className?: string;
    openInSameTab?: boolean;
    style?: React.CSSProperties;
    clicked?: () => void;
}

export function Link({
    href,
    children,
    className,
    openInSameTab = false,
    style,
    clicked
}: ILinkProps) {
    const handleClick = (e: React.MouseEvent) => {
        if (clicked) {
            e.preventDefault();
            clicked();
        }
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
