import React from "react";
import "../styles/spinners.scss";

const Ellipsis = () => {
    return (
        <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

const Hourglass = () => {
    return <div className="lds-hourglass"></div>;
};

const Ring = () => {
    return (
        <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

const Spinner = () => <Ring />;
Spinner.Ellipsis = Ellipsis;
Spinner.Hourglass = Hourglass;
Spinner.Ring = Ring;

export default Spinner;
