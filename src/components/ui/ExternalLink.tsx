import { Box, Link } from "@chakra-ui/react";
import { mdiLinkVariant } from "@mdi/js";
import { Icon } from "@mdi/react";
import React from "react";
import styles from "./ExternalLink.module.scss";

interface ExternalLinkProps {
    href: string;
    useIcon?: boolean;
    children: React.ReactNode;
}

export default function ExternalLink(props: ExternalLinkProps) {
    return (
        <Link href={props.href} isExternal _hover={{ textDecoration: "none" }}>
            <Box display="inline-flex" alignItems="center" gap={1}>
                <Box display="inline" color="brand.400" className={styles.link}>
                    {props.children}
                </Box>
                {props.useIcon && <Icon path={mdiLinkVariant} size={0.5} />}
            </Box>
        </Link>
    );
}
