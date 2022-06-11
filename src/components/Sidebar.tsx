import { Button } from "primereact/button";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import React, { useState } from "react";
import { useAnalytics } from "../hooks/useAnalytics";
import { useIsMobile } from "../hooks/useIsMobile";
import useUpdateEffect from "../hooks/useUpdateEffect";
import BMCButton from "./BMCButton";
import { Link } from "./Link";

export function Sidebar() {
    const [show, setShow] = useState(false);
    const isMobile = useIsMobile();
    const { event } = useAnalytics();

    useUpdateEffect(
        () =>
            event({
                category: "SIDEBAR",
                action: "TOGGLE_SIDEBAR",
                details: { sidebar_opened: show }
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [show]
    );

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
                tooltip="Help"
                tooltipOptions={{ position: "bottom" }}
            />
            <PrimeSidebar
                visible={show}
                onHide={() => setShow(false)}
                showCloseIcon={isMobile}
                fullScreen={isMobile}
                className="p-sidebar-md">
                <aside className="sidebar-body">
                    <div>
                        <h3>How to Use</h3>
                        <ol>
                            <li>
                                <p>
                                    Specify your desired target rating by
                                    clicking a rating card in the{" "}
                                    <strong>Target Rating</strong> section
                                    (Required)
                                </p>
                            </li>
                            <li>
                                <p>
                                    Enter the ratings of the players you already
                                    own and plan to use in the SBC in the{" "}
                                    <strong>Existing Players</strong> section
                                    (Optional)
                                </p>
                            </li>
                            <li>
                                <p>
                                    In the{" "}
                                    <strong>Range of Ratings to Try</strong>{" "}
                                    section, specify the range of ratings to use
                                    when calculating the solutions.
                                </p>
                                <p>
                                    For example, with a range from{" "}
                                    <strong>81</strong> to <strong>84</strong>,
                                    the resulting player rating combinations
                                    will be calculated from ratings{" "}
                                    <strong>81</strong>, <strong>82</strong>,{" "}
                                    <strong>83</strong> and <strong>84</strong>,
                                    plus from the ratings you specified in the{" "}
                                    <strong>Existing Players</strong> section.
                                </p>
                            </li>
                            <li>
                                <p>
                                    In the <strong>Player Prices</strong>{" "}
                                    section you can specify the price, in coins,
                                    for each of the ratings specified in the{" "}
                                    <strong>Range of Ratings to Try</strong>{" "}
                                    section.
                                </p>
                                <p>
                                    You can also fetch the price data directly
                                    from FUTBIN's{" "}
                                    <Link href="https://www.futbin.com/stc/cheapest">
                                        cheapest player by rating
                                    </Link>{" "}
                                    page by clicking the{" "}
                                    <strong>Fetch FUTBIN</strong> button. It
                                    will scrape the price of the cheapest player
                                    for each rating.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Lastly, press the <strong>Calculate</strong>{" "}
                                    button and wait for player rating
                                    combination solutions to appear in the{" "}
                                    <strong>Solutions</strong> table.
                                </p>
                                <p>
                                    Each row in the table represents a group of
                                    remaining player ratings you need to acquire
                                    in order to achieve the specified target
                                    rating.
                                </p>
                            </li>
                        </ol>
                    </div>
                    <div className="links-container">
                        <Link
                            href="https://github.com/mabenj/SbcCruncher"
                            className="no-style-a">
                            <i className="fab fa-github mr-2"></i>mabenj
                        </Link>
                        <span className="ml-5">
                            <BMCButton width={130} btnLocation="sidebar" />
                        </span>
                    </div>
                </aside>
            </PrimeSidebar>
        </>
    );
}
