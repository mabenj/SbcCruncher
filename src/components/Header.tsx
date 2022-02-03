import React from "react";
import Image from "react-bootstrap/Image";
import Link from "./Link";

export default function Header() {
	return (
		<>
			<Brand />
			<small className="text-muted m-1">
				A tool for calculating player ratings for SBCs in FIFA Ultimate Team
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
		<Link href="/" className="text-reset text-decoration-none" openInSameTab>
			<div style={style}>
				<Image src="/logo.png" alt="SBC Solver logo" width="50px" />
				<h1 className="m-2">SBC Rating Solver</h1>
			</div>
		</Link>
	);
};
