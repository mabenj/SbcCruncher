import React from "react";

import "../../styles/Spinners/Ellipsis.scss";

export default function Ellipsis() {
	return (
		<div className="lds-ellipsis">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}
