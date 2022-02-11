import React from "react";
import { Image } from "primereact/image";
import { Link } from "./";

import "../styles/Header.scss";

export function Header() {
	return (
		<>
			<Brand />
			<small className="p-m-1">
				A tool for calculating the most optimal player ratings and prices for
				FIFA Ultimate Team SBCs
			</small>
		</>
	);
}

const Brand = () => {
	return (
		<div className="header">
			<Link
				href="/"
				className="p-text-normal text-decoration-none"
				openInSameTab>
				<Image src="/logo.png" alt="SBC Cruncher logo" width="50px" />
			</Link>
			<Link
				href="/"
				className="p-text-normal text-decoration-none"
				openInSameTab>
				<h1 className="p-m-2">SBC Cruncher</h1>
			</Link>
		</div>
	);
};
