import React from "react";
import styles from "./Spinner.module.scss";

const Ellipsis = () => {
    return (
        <div className={styles["lds-ellipsis"]}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

const Hourglass = () => {
    return <div className={styles["lds-hourglass"]}></div>;
};

const Ring = () => {
    return (
        <div className={styles["lds-ring"]}>
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
