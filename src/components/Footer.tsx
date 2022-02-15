import React from "react";
import { Link } from ".";

export const Footer = () => {
	return (
		<small className="p-d-flex p-flex-column p-jc-center p-ai-center">
			<div className="p-m-1 text-muted">
				The creation of SBC Cruncher was inspired by{" "}
				<Link href="https://www.github.com/elmaano/sbc">elmaano</Link>'s{" "}
				<Link href="https://elmaano.github.io/sbc/">
					SBC Rating Brute Forcer
				</Link>
			</div>
			<div className="p-m-1 text-muted">
				The squad ratings are calculated based on{" "}
				<Link href="https://reddit.com/user/ChairmanMeowwww">
					u_ChairmanMeowwww
				</Link>
				's{" "}
				<Link href="https://reddit.com/r/FIFA/comments/5osq7k/new_overall_rating_figured_out/">
					formula
				</Link>
			</div>
		</small>
	);
};
