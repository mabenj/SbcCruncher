import React, { useEffect, useState } from "react";
import { Image } from "primereact/image";
import { Link, Sidebar } from "./";
import { InputSwitch, InputSwitchChangeParams } from "primereact/inputswitch";
import LocalStorage from "../services/LocalStorage.service";

import "../styles/Header.scss";
import Config from "../Config";

export function Header() {
	return (
		<div className="header-container">
			<div>
				<Brand />
				<small className="p-m-1">
					A tool for calculating the most optimal player ratings and prices for
					FIFA Ultimate Team SBCs
				</small>
			</div>
			<div className="options">
				<ThemeToggle />
				<Sidebar />
			</div>
		</div>
	);
}

const Brand = () => {
	return (
		<div className="brand">
			<Link href="/" className="" openInSameTab>
				<Image src="/logo.png" alt="SBC Cruncher logo" width="50px" />
			</Link>
			<Link href="/" className="no-style-a" openInSameTab>
				<h1 className="p-m-2">SBC CRUNCHER</h1>
			</Link>
		</div>
	);
};

const ThemeToggle = () => {
	const [isDark, setIsDark] = useState(
		LocalStorage.getItemOrNull(Config.isDarkThemeStorageKey) || false
	);

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
		<span className="theme-toggle">
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
