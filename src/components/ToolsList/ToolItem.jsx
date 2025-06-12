import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * The tools item. This is basically a page item for that tool.
 *
 */
const ToolItem = ({ tool }) => (
    <Card className="hover:bg-muted/50 transition-colors">
        <CardContent className="p-6">
            <a
                href={tool.url}
                target="_blank"
                rel="norel noreferrer"
                alt={`${tool.title} - ${tool.description}`}
                className="block hover:no-underline"
            >
                <h2 className="text-xl font-semibold text-foreground hover:text-accent transition-colors mb-2">{tool.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
            </a>
        </CardContent>
        {Array.isArray(tool.labels) && tool.labels.length > 0 && (
            <CardFooter className="pt-0 pb-6 px-6">
                <div className="flex flex-wrap gap-2">
                    {tool.labels.map((label) => (
                        <Badge key={label + tool.url} variant="secondary" className="text-xs">
                            {label}
                        </Badge>
                    ))}
                </div>
            </CardFooter>
        )}
    </Card>
);

export default ToolItem;
