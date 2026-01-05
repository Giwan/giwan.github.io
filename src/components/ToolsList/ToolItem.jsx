import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * The tools item. This is basically a page item for that tool.
 * Enhanced with accessibility features and optional indicators.
 */
const ToolItem = ({ tool }) => {
    // Check if tool is new (added within last 30 days)
    const isNew =
        tool.dateAdded &&
        new Date(tool.dateAdded) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Check if tool is popular (has specific labels indicating popularity)
    const isPopular = tool.labels?.some((label) =>
        ["popular", "trending", "recommended"].includes(label.toLowerCase())
    );

    // Check if tool is free
    const isFree = tool.price === 0;

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.currentTarget.click();
        }
    };

    return (
        <Card className="hover:bg-muted/50 transition-colors border-0 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background h-full flex flex-col">
            {(isNew || isPopular) && (
                <CardHeader className="pb-2 pt-4 px-6">
                    <div className="flex gap-2">
                        {isNew && (
                            <Badge
                                variant="default"
                                className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium"
                                aria-label="Recently added tool"
                            >
                                New
                            </Badge>
                        )}
                        {isPopular && (
                            <Badge
                                variant="default"
                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium"
                                aria-label="Popular tool"
                            >
                                Popular
                            </Badge>
                        )}
                    </div>
                </CardHeader>
            )}

            <CardContent
                className={`${
                    isNew || isPopular ? "pt-2" : "pt-6"
                } px-6 flex-grow`}
            >
                <a
                    className="tool-card-link block hover:no-underline focus:outline-none focus-visible:outline-none group"
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${tool.title}. ${tool.description}${
                        isFree
                            ? ". Free tool."
                            : tool.price
                            ? ` Pricing starts at ${tool.currency || "$"}${
                                  tool.price
                              }.`
                            : ""
                    }`}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary group-focus:text-primary transition-colors leading-tight flex-grow">
                            {tool.title}
                        </h3>
                        {isFree && (
                            <Badge
                                variant="outline"
                                className="ml-2 text-green-600 border-green-600 text-xs font-medium shrink-0"
                                aria-label="Free tool"
                            >
                                Free
                            </Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {tool.description}
                    </p>
                    {tool.price > 0 && (
                        <p
                            className="text-sm text-muted-foreground mt-2"
                            aria-label={`Pricing information`}
                        >
                            Starting at {tool.currency || "$"}
                            {tool.price}
                        </p>
                    )}
                </a>
            </CardContent>

            {Array.isArray(tool.labels) && tool.labels.length > 0 && (
                <CardFooter className="pt-0 pb-6 px-6">
                    <div
                        className="flex flex-wrap gap-1.5 sm:gap-2"
                        role="list"
                        aria-label="Tool categories and tags"
                    >
                        {tool.labels.map((label) => (
                            <Badge
                                key={label + tool.url}
                                variant="secondary"
                                className="text-xs font-medium"
                                role="listitem"
                                aria-label={`Category: ${label}`}
                            >
                                {label}
                            </Badge>
                        ))}
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};

export default ToolItem;
