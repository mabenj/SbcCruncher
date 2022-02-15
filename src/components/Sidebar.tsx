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
			<PrimeSidebar
				visible={show}
				onHide={() => setShow(false)}
				className="p-sidebar-md">
				<div className="body">
					<div>
						<h3>Usage</h3>
						<ol>
							<li>
								<p>
									Enter a target rating you would want to achieve in the{" "}
									<strong>Squad Target Rating</strong> field (e.g. 86)
								</p>
							</li>
							<li>
								<p>
									Enter the ratings of the players you already own and plan to
									use in the squad into the <strong>Existing Players</strong>{" "}
									field (Optional)
								</p>
							</li>
							<li>
								<p>
									In the <strong>Range of Ratings to Try</strong> section,
									specify the minimum and maximum ratings to use in the
									resulting player rating combinations.
								</p>
								<p>
									For example, with a minimum of 81 and a maximum of 84, the
									resulting player rating combinations will be calculated from
									ratings 81, 82, 83 and 84, plus from the ratings you specified
									in the <strong>Existing Players</strong> field.
								</p>
							</li>
							<li>
								<p>
									In the <strong>Player Prices</strong> section you can specify
									the price in coins for each of the ratings specified in the{" "}
									<strong>Range of Ratings to Try</strong> section. You can also
									fetch the price data directly from FUTBIN's{" "}
									<Link href="https://www.futbin.com/stc/cheapest">
										cheapest player by rating
									</Link>{" "}
									page by clicking the <strong>Fetch from FUTBIN</strong>{" "}
									button. The price of the cheapest player for each rating will
									then be used to populate the price fields. (Optional)
								</p>
								<strong>
									Note! Currently only the prices for ratings 81 - 98 are
									available from FUTBIN
								</strong>
							</li>
							<li>
								<p>
									Lastly, press the <strong>Calculate</strong> button and wait
									for player rating combination solutions to appear in the{" "}
									<strong>Solutions</strong> table.
								</p>
								<p>
									Each row in the table represents the ratings of the remaining
									players you need to acquire in order to achieve the specified
									target rating.
								</p>
							</li>
						</ol>
					</div>
					<div className="p-my-4">
						<Link
							href="https://github.com/mabenj/SbcCruncher"
							className="no-style-a">
							<i className="fab fa-github"></i>&nbsp;mabenj
						</Link>
					</div>
				</div>
			</PrimeSidebar>
		</>
	);
}
