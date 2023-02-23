import { Button } from "@chakra-ui/react";
import React from "react";

interface ExternalLinkProps {
    href: string;
    small?: boolean;
    children: React.ReactNode;
}

export default function ExternalLink(props: ExternalLinkProps) {
    return (
        <Button
            as="a"
            href={props.href}
            variant="link"
            target="_blank"
            referrerPolicy="no-referrer"
            colorScheme="brand"
            size={props.small ? "sm" : undefined}>
            {props.children}
        </Button>
    );
}
