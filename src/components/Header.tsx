import React from "react";
import Image from "react-bootstrap/Image";

export default function Header() {
	const style: React.CSSProperties = {
		display: "flex",
		alignItems: "center"
	};

	return (
		<>
			<div style={style}>
				<Image src="/logo.png" alt="SBC Solver logo" width="50px" />
				<h1 className="m-2">SBC Rating Solver</h1>
			</div>
			<small className="text-muted m-1">
				A tool for calculating player ratings for SBCs in FIFA Ultimate Team
			</small>
		</>
	);
}
