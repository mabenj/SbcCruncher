import { ScrollPanel } from "primereact/scrollpanel";
import React from "react";
import { useIsMobile } from "../hooks/useIsMobile";

export default function MobileScrollPanel({
    children
}: {
    children: React.ReactNode;
}) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <ScrollPanel
                style={{ width: "100%", height: "300px" }}
                className="custom-scroll-panel">
                <div className="px-3">{children}</div>
            </ScrollPanel>
        );
    }

    return <>{children}</>;
}
