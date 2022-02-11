import React, { useState } from "react";
import { Link } from "./";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";

import "../styles/Sidebar.scss";

export function Sidebar() {
	const [show, setShow] = useState(false);

	const handleInfoClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setShow(true);
	};

	return (
		<>
			<div className="button-container">
				<button className="button" onClick={handleInfoClick} title="About">
					<i className="far fa-question-circle"></i>
				</button>
			</div>
			<PrimeSidebar visible={show} onHide={() => setShow(false)} className="">
				<div className="body">
					<div>
						<h2>About</h2>
						<p>
							This tool is inspired by{" "}
							<Link href="https://elmaano.github.io/sbc/">
								SBC Rating Brute Forcer
							</Link>{" "}
							made by{" "}
							<Link href="https://www.github.com/elmaano/sbc">elmaano</Link>.
							And the squad ratings are calculated based on{" "}
							<Link href="https://reddit.com/user/ChairmanMeowwww">
								u_ChairmanMeowwww
							</Link>
							's{" "}
							<Link href="https://reddit.com/r/FIFA/comments/5osq7k/new_overall_rating_figured_out/">
								formula
							</Link>
							.
						</p>
					</div>
					<div className="p-my-4">
						<Link
							href="https://github.com/mabenj/SbcCruncher"
							className="p-text-normal">
							<i className="fab fa-github"></i>&nbsp;mabenj
						</Link>
					</div>
				</div>
			</PrimeSidebar>
		</>
	);
}
