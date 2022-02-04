import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Link from "./Link";

const buttonContainerStyle: React.CSSProperties = {
	display: "flex",
	justifyContent: "flex-end",
	marginTop: "20px"
};

const buttonStyle: React.CSSProperties = {
	background: "none",
	color: "inherit",
	border: "none",
	padding: "0",
	font: "inherit",
	cursor: "pointer",
	outline: "inherit",
	position: "absolute"
};

export default function Sidebar() {
	const [show, setShow] = useState(false);

	const handleInfoClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setShow(true);
	};

	return (
		<>
			<div style={buttonContainerStyle}>
				<button style={buttonStyle} onClick={handleInfoClick} title="About">
					<i className="far fa-question-circle"></i>
				</button>
			</div>
			<Offcanvas show={show} onHide={() => setShow(false)}>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>About</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					{/*CSpell: disable */}
					<p>
						This tool is inspired by{" "}
						<Link href="https://elmaano.github.io/sbc/">
							SBC Rating Brute Forcer
						</Link>{" "}
						made by{" "}
						<Link href="https://www.github.com/elmaano/sbc">elmaano</Link>.
					</p>
					<p>
						The squad ratings are calculated based on{" "}
						<Link href="https://reddit.com/user/ChairmanMeowwww">
							u_ChairmanMeowwww
						</Link>
						's{" "}
						<Link href="https://reddit.com/r/FIFA/comments/5osq7k/new_overall_rating_figured_out/">
							formula
						</Link>
						.
					</p>
					{/*CSpell: enable */}
					<p>
						<strong>Tip!</strong> To ensure faster calculation times, try to
						specify at least a few existing player ratings and do not use a
						large range for the ratings to try.
					</p>
				</Offcanvas.Body>
			</Offcanvas>
		</>
	);
}
