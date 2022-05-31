import { Image } from "primereact/image";
import { InputSwitch, InputSwitchChangeParams } from "primereact/inputswitch";
import React, { useEffect } from "react";
import Config from "../Config";
import { useAnalytics } from "../hooks/useAnalytics";
import useLocalStorage from "../hooks/useLocalStorage";
import { Link } from "./Link";
import NoPrerender from "./NoPrerender";
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
            <div className="header-options my-3">
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

    const handleThemeToggle = (e: InputSwitchChangeParams) => {
        setIsDark(e.value);
        event({
            category: "APP_THEME",
            action: "TOGGLE_THEME",
            details: { theme: e.value ? "dark" : "light" }
        });
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
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
};
