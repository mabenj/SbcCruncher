import { Image } from "primereact/image";
import { InputSwitch, InputSwitchChangeParams } from "primereact/inputswitch";
import React, { useEffect, useState } from "react";
import Config from "../Config";
import LocalStorage from "../services/LocalStorage.service";
import { Link } from "./Link";
import NoPrerender from "./NoPrerender";
import { Sidebar } from "./Sidebar";

export function Header() {
    return (
        <div className="header-container my-4">
            <header>
                <Brand />
                <small className="m-1">
                    A tool for calculating the most optimal player ratings and
                    prices for FIFA Ultimate Team SBCs
                </small>
            </header>
            <div className="header-options">
                <NoPrerender>
                    <ThemeToggle />
                </NoPrerender>
                <Sidebar />
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
                {/* <div className="logo">S</div> */}
            </Link>
            <Link href="/" className="no-style-a" openInSameTab>
                <h1 className="m-2">SBC CRUNCHER</h1>
            </Link>
        </div>
    );
};

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(getIsDarkInitial());

    useEffect(() => {
        let themeLink = document.getElementById("app-theme") as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = `themes/${
                isDark ? Config.darkThemeName : Config.lightThemeName
            }/theme.css`;
        }
        LocalStorage.setItem(Config.isDarkThemeStorageKey, isDark);
    }, [isDark]);

    const handleThemeToggle = (e: InputSwitchChangeParams) => {
        setIsDark(e.value);
    };

    return (
        <span className="header-theme-toggle">
            <i className="pi pi-moon"></i>
            <InputSwitch
                checked={isDark}
                onChange={handleThemeToggle}
                tooltip={`Switch to ${isDark ? "light" : "dark"} theme`}
                tooltipOptions={{ position: "bottom" }}
            />
        </span>
    );
};

const getIsDarkInitial = () => {
    const storedIsDark = LocalStorage.getItemOrNull<boolean>(
        Config.isDarkThemeStorageKey
    );
    if (storedIsDark === null) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return storedIsDark;
};
