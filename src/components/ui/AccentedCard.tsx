import { Card } from "@chakra-ui/react";
import React from "react";
import styles from "./AccentedCard.module.scss";

export default function AccentedCard({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.card}>
            <Card borderTopRadius={0}>
                {children}
            </Card>
        </div>
    );
}
