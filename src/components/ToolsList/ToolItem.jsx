import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * The tools item. This is basically a page item for that tool.
 *
 */
const ToolItem = ({ tool }) => (
    <Card className="hover:bg-muted/50 transition-colors border-border focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <CardContent className="p-6">
            <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${tool.title}: ${tool.description}`}
                className="block hover:no-underline focus:outline-none group"
            >
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary group-focus:text-primary transition-colors mb-3 leading-tight">{tool.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{tool.description}</p>
            </a>
        </CardContent>
        {Array.isArray(tool.labels) && tool.labels.length > 0 && (
            <CardFooter className="pt-0 pb-6 px-6">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {tool.labels.map((label) => (
                        <Badge key={label + tool.url} variant="secondary" className="text-xs font-medium">
                            {label}
                        </Badge>
                    ))}
                </div>
            </CardFooter>
        )}
    </Card>
);

export default ToolItem;
