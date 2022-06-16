import { ScrollPanel } from "primereact/scrollpanel";
import React from "react";
import styles from "./Container.module.scss";

export const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <ScrollPanel className="custom-scroll-panel">
            <main className={styles["main-container"]}>
                <div className={styles["children"]}>{children}</div>
            </main>
        </ScrollPanel>
    );
};
