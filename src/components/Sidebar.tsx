import React, { useState } from "react";
import { Link } from "./";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import { Button } from "primereact/button";

import "../styles/Sidebar.scss";

export function Sidebar() {
	const [show, setShow] = useState(false);

	const handleInfoClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setShow(true);
	};

	return (
		<>
			<Button
				icon={<i className="far fa-question-circle"></i>}
				onClick={handleInfoClick}
				className="p-button-rounded p-button-text p-button-plain"
				tooltip="About"
				tooltipOptions={{ position: "bottom" }}
			/>
			<PrimeSidebar visible={show} onHide={() => setShow(false)} className="">
				<div className="body">
					<div>
						<h2>About</h2>
						{/*cSpell: disable */}
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
						{/*cSpell: enable */}
					</div>
					<div className="p-my-4">
						<Link
							href="https://github.com/mabenj/SbcCruncher"
							className="no-style-a">
							<i className="fab fa-github"></i>&nbsp;mabenjj
						</Link>
					</div>
				</div>
			</PrimeSidebar>
		</>
	);
}
