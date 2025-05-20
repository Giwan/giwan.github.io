import React from "react";
import {
    button,
    pageButtonContainer,
    pageNumberStyle,
    pageButtonNumbers
} from "./Pagination.module.css";
import { createButtons } from "./paginationHelpers";

const Pagination = function ({
    pageNumber,
    prevButtons,
    nextButtons,
    setPage,
    totalPages,
}) {
    return (
        <div className={pageButtonContainer}>
            <div className={pageButtonNumbers}>
                <PageButtons
                    buttons={createButtons(
                        [-4, -3, -2, -1],
                        setPage,
                        pageNumber,
                        totalPages
                    )}
                />
                <span className={pageNumberStyle}>{pageNumber}</span>
                <PageButtons
                    buttons={createButtons(
                        [1, 2, 3, 4],
                        setPage,
                        pageNumber,
                        totalPages
                    )}
                />
            </div>
            <div>
                <PageButtons {...{ buttons: prevButtons }} />
                <PageButtons {...{ buttons: nextButtons }} />
            </div>
        </div>
    );
};

export default Pagination;



/**
 * Create a button element based on the provided array of buttons.
 */
const PageButtons = ({ buttons }) =>
    buttons.map((b) => {
        if (!b) return null;
        const { label, action } = b;

        return (
            <button key={label} onClick={action} className={button}>
                {convertLabel(label)}
            </button>
        );
    });

/**
 * Helper function to use the HTML icons
 * Used for the previous and next buttons.
 */
const convertLabel = (label) =>
    typeof label === "number" ? (
        label
    ) : (
        <span dangerouslySetInnerHTML={{ __html: label }} />
    );
