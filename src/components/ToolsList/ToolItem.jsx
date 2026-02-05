import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Design constants
const STYLES = {
    CARD: "shadow-none transition-all duration-300 border-0 border-t-2 border-primary rounded-none bg-background h-full flex flex-col group/card focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
    BADGE_NEW: "bg-primary text-primary-foreground text-[10px] uppercase font-bold rounded-none px-1.5 py-0",
    BADGE_POPULAR: "bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase font-bold rounded-none px-1.5 py-0",
    BADGE_FREE: "ml-2 text-primary border-primary text-[10px] uppercase font-bold rounded-none shrink-0",
    LINK: "tool-card-link block hover:no-underline focus:outline-none focus-visible:outline-none group",
    TITLE: "text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-none tracking-tight flex-grow uppercase",
    DESCRIPTION: "text-foreground leading-relaxed text-sm sm:text-base font-serif italic opacity-90 text-justify hyphens-auto",
    PRICE_LABEL: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground",
    READ_MORE: "text-[10px] font-mono uppercase tracking-widest text-primary font-bold group-hover:underline",
    LABEL_BADGE: "text-[10px] uppercase font-bold rounded-none bg-muted/50 text-muted-foreground"
};

/**
 * StatusBadges Component
 * Displays 'New' or 'Popular' indicators if applicable.
 */
const StatusBadges = React.memo(({ isNew, isPopular }) => {
    if (!isNew && !isPopular) return null;

    return (
        <CardHeader className="pb-2 pt-4 px-0">
            <div className="flex gap-2">
                {isNew && (
                    <Badge 
                        variant="default" 
                        className={STYLES.BADGE_NEW} 
                        aria-label="Recently added tool"
                    >
                        New
                    </Badge>
                )}
                {isPopular && (
                    <Badge 
                        variant="default" 
                        className={STYLES.BADGE_POPULAR} 
                        aria-label="Popular tool"
                    >
                        Popular
                    </Badge>
                )}
            </div>
        </CardHeader>
    );
});

/**
 * ToolHeader Component
 * Displays the title and 'Free' badge.
 */
const ToolHeader = React.memo(({ title, isFree }) => (
    <div className="flex items-start justify-between mb-2">
        <h3 className={STYLES.TITLE}>{title}</h3>
        {isFree && (
            <Badge 
                variant="outline" 
                className={STYLES.BADGE_FREE} 
                aria-label="Free tool"
            >
                Free
            </Badge>
        )}
    </div>
));

/**
 * ToolFooter Component
 * Displays the list of labels/categories.
 */
const ToolFooterLabels = React.memo(({ labels, toolUrl }) => {
    if (!Array.isArray(labels) || labels.length === 0) return null;

    return (
        <CardFooter className="pt-0 pb-6 px-0">
            <div 
                className="flex flex-wrap gap-1.5 sm:gap-2" 
                role="list" 
                aria-label="Tool categories and tags"
            >
                {labels.map((label) => (
                    <Badge
                        key={`${label}-${toolUrl}`}
                        variant="secondary"
                        className={STYLES.LABEL_BADGE}
                        role="listitem"
                        aria-label={`Category: ${label}`}
                    >
                        {label}
                    </Badge>
                ))}
            </div>
        </CardFooter>
    );
});

// Utility functions
const UTILS = {
    isNewTool: (dateAdded) => {
        if (!dateAdded) return false;
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        return new Date(dateAdded) > new Date(Date.now() - thirtyDaysInMs);
    },
    isPopularTool: (labels) => {
        const popularKeywords = ["popular", "trending", "recommended"];
        return labels?.some((label) => 
            popularKeywords.includes(label.toLowerCase())
        ) ?? false;
    },
    getPricingInfo: (price, currency = "$") => {
        if (price === 0) return ". Free tool.";
        if (price > 0) return `. Pricing starts at ${currency}${price}.`;
        return "";
    },
    isFreeTool: (price) => price === 0,
    formatAriaLabel: (tool) => {
        const pricing = UTILS.getPricingInfo(tool.price, tool.currency);
        return `Visit ${tool.title}. ${tool.description}${pricing}`;
    }
};

/**
 * ToolItem Component
 * The main item for the tools list.
 */
const ToolItem = React.memo(({ tool }) => {
    const isNew = UTILS.isNewTool(tool.dateAdded);
    const isPopular = UTILS.isPopularTool(tool.labels);
    const isFree = UTILS.isFreeTool(tool.price);
    const ariaLabel = UTILS.formatAriaLabel(tool);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.currentTarget.click();
        }
    };

    return (
        <Card className={STYLES.CARD}>
            <StatusBadges isNew={isNew} isPopular={isPopular} />

            <CardContent className={`${isNew || isPopular ? "pt-2" : "pt-6"} flex-grow px-0`}>
                <a
                    className={STYLES.LINK}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ariaLabel}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    <ToolHeader title={tool.title} isFree={isFree} />
                    
                    <div className="w-full h-px bg-primary/20 mb-4" />
                    
                    <p className={STYLES.DESCRIPTION}>
                        {tool.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                        {!isFree && (
                            <p className={STYLES.PRICE_LABEL} aria-label="Pricing information">
                                Rate: {tool.currency || "$"}{tool.price}
                            </p>
                        )}
                        <span className={STYLES.READ_MORE}>
                            Read More →
                        </span>
                    </div>
                </a>
            </CardContent>

            <ToolFooterLabels labels={tool.labels} toolUrl={tool.url} />
        </Card>
    );
});

export default ToolItem;

