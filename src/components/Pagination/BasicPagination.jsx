import React from "react";
import { button, basicPaginationContainer } from "./Pagination.module.css";

const numberButtons = [1, 2, 3, 4, 5];
const buttons = ["<<", "<", ">", ">>"];

const Pagination = function () {
    return (
        <div className={basicPaginationContainer}>
            <div>
                {numberButtons.map((label) => (
                    <button key={label} className={button}>
                        {label}
                    </button>
                ))}
            </div>
            <div>
                {buttons.map((label) => (
                    <button key={label} className={button}>
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Pagination;
