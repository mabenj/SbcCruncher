import React from "react";
import Image from "react-bootstrap/Image";
import Link from "./Link";

export default function Header() {
	return (
		<>
			<Brand />
			<small className="text-muted m-1">
				A tool for calculating the most optimal player ratings and prices for
				FIFA Ultimate Team SBCs
			</small>
		</>
	);
}

const Brand = () => {
	const style: React.CSSProperties = {
		display: "flex",
		alignItems: "center"
	};
	return (
		<div style={style}>
			<Link href="/" className="text-reset text-decoration-none" openInSameTab>
				<Image src="/logo.png" alt="SBC Cruncher logo" width="50px" />
			</Link>
			<Link href="/" className="text-reset text-decoration-none" openInSameTab>
				<h1 className="m-2">SBC Cruncher</h1>
			</Link>
		</div>
	);
};
