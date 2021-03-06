import { Button } from "primereact/button";
import { Image } from "primereact/image";
import React, { useEffect } from "react";
import Config from "../Config";
import { useAnalytics } from "../hooks/useAnalytics";
import useLocalStorage from "../hooks/useLocalStorage";
import BMCButton from "./BMCButton";
import { Link } from "./Link";
import { Sidebar } from "./Sidebar";

export function Header() {
    return (
        <div className="header-container">
            <header className="">
                <Brand />
                <small className="m-1 mb-3">
                    A tool for calculating the most optimal player ratings and
                    prices for FIFA Ultimate Team SBCs
                </small>
            </header>
            <div className="my-3 w-full md:w-auto">
                <div className="flex justify-content-between align-items-center gap-4 mb-3">
                    <BMCButton width={150} btnLocation="toolbar" />
                    <div className="flex gap-2">
                        <ThemeToggle />
                        <Sidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}

const Brand = () => {
    return (
        <div className="header-brand mb-4">
            <Link href="/" className="no-style-a" openInSameTab>
                <Image
                    src="/logo.png"
                    alt="SBC Cruncher logo"
                    width="65px"
                    className="logo"
                />
            </Link>
            <Link href="/" className="no-style-a" openInSameTab>
                <h1 className="m-2">SBC CRUNCHER</h1>
            </Link>
        </div>
    );
};

const ThemeToggle = () => {
    const [isDark, setIsDark] = useLocalStorage(
        Config.isDarkThemeStorageKey,
        getIsDarkInitial()
    );
    const { event } = useAnalytics();

    useEffect(() => {
        let themeLink = document.getElementById("app-theme") as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = `themes/${
                isDark ? Config.darkThemeName : Config.lightThemeName
            }/theme.css`;
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark((prev) => {
            const newVal = !prev;
            event({
                category: "APP_THEME",
                action: "TOGGLE_THEME",
                details: { theme: newVal ? "dark" : "light" }
            });
            return newVal;
        });
    };

    return (
        <Button
            icon={`pi pi-${isDark ? "sun" : "moon"}`}
            className="p-button-rounded p-button-text p-button-plain"
            onClick={() => toggleTheme()}
            tooltip={`Switch to ${isDark ? "light" : "dark"} theme`}
            tooltipOptions={{ position: "bottom" }}
        />
    );
};

const getIsDarkInitial = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
};
