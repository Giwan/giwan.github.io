import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createButtons } from "./paginationHelpers";

const Pagination = function ({
    pageNumber,
    prevButtons,
    nextButtons,
    setPage,
    totalPages,
}) {
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
                <PageButtons
                    buttons={createButtons(
                        [-4, -3, -2, -1],
                        setPage,
                        pageNumber,
                        totalPages
                    )}
                />
                <Badge variant="secondary" className="px-3 py-1">
                    {pageNumber}
                </Badge>
                <PageButtons
                    buttons={createButtons(
                        [1, 2, 3, 4],
                        setPage,
                        pageNumber,
                        totalPages
                    )}
                />
            </div>
            <div className="flex space-x-2">
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
            <Button key={label} onClick={action} variant="outline" size="sm">
                {convertLabel(label)}
            </Button>
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
