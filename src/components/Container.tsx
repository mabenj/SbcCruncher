import React from "react";

import "../styles/Container.scss";

export const Container = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="main-container">
			<div className="children">{children}</div>
		</main>
	);
};
