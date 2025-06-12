import React, { useState } from "react";
import Pagination from "./Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Page = ({ pageNumber }) => (
    <Card className={cn("p-8 text-center", pageNumber % 2 === 0 && "bg-muted/50")}>
        <CardContent>
            Page {pageNumber}
        </CardContent>
    </Card>
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
        <div className="space-y-6 max-w-2xl mx-auto p-6">
            <div className="text-center text-muted-foreground">
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
