import { ScrollPanel } from "primereact/scrollpanel";
import React from "react";

export const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <ScrollPanel style={{ width: "100vw", height: "100vh" }} className="custom-scroll-panel">
            <main className="main-container">
                <div className="children">{children}</div>
            </main>
        </ScrollPanel>
    );
};
