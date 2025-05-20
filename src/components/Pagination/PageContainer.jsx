import React, { useState } from "react";
import Pagination from "./Pagination";
import { pageStyle, pageContainerStyle } from "./PageContainer.module.css";

const Page = ({ pageNumber }) => (
    <article className={pageStyle} data-highlight={pageNumber % 2}>Page {pageNumber}</article>
);

const PageContainer = ({ totalPages, startPage }) => {
    const [pageNumber, setPage] = useState(startPage);

    const firstPage = () => setPage(1);
    const lastPage = () => setPage(totalPages);

    const prevPage = () => pageNumber > 1 && setPage(pageNumber - 1);
    const nextPage = () =>
        pageNumber < totalPages && setPage(pageNumber + 1);

    const prevButtons = [
        {
            label: "&laquo",
            action: firstPage,
        },
        {
            label: "&lsaquo;",
            action: prevPage,
        },
    ];
    const nextButtons = [
        {
            label: "&rsaquo;",
            action: nextPage,
        },
        {
            label: "&raquo;",
            action: lastPage,
        },
    ];

    return (
        <div className={pageContainerStyle}>
            <div>
                Page {pageNumber} of {totalPages}
            </div>
            <Page pageNumber={pageNumber} />
            <div>
                <Pagination
                    {...{
                        pageNumber,
                        prevButtons,
                        nextButtons,
                        setPage,
                        totalPages,
                    }}
                />
            </div>
        </div>
    );
};

export default PageContainer;
