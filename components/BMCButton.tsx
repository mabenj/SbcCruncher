import Image from "next/image";
import { Button } from "primereact/button";
import React from "react";
import { useAnalytics } from "../hooks/useAnalytics";
import bmcLogo from "../public/assets/images/BMC-btn-yellow.png";
import styles from "./BMCButton.module.scss";

interface IBMCButtonProps {
    width: number;
    btnLocation?: string;
}

export default function BMCButton({ width, btnLocation }: IBMCButtonProps) {
    const { event } = useAnalytics();
    return (
        <Button
            className={`p-0 p-button-text ${styles["bmc-btn"]}`}
            tooltip="Support SBC Cruncher"
            tooltipOptions={{ position: "bottom" }}
            onClick={() => {
                event({
                    category: "BMC",
                    action: "CLICK_BMC",
                    details: { location: btnLocation }
                });
                window.open("https://www.buymeacoffee.com/mabenj", "_blank");
            }}>
            <div
                style={{ width: width }}
                className="flex justify-content-center">
                <Image
                    src={bmcLogo}
                    alt={"Buy me a coffee"}
                    placeholder="blur"
                />
            </div>
        </Button>
    );
}
