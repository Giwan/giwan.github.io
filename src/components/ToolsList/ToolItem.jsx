import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
// Design constants
const STYLES = {
    CARD: "shadow-none transition-all duration-300 border-0 border-t-2 border-primary rounded-none bg-background h-full flex flex-col group/card",
    BADGE_NEW: "bg-primary text-primary-foreground text-[11px] uppercase font-bold rounded-none px-1.5 py-0",
    BADGE_POPULAR: "bg-primary/10 text-primary border border-primary/20 text-[11px] uppercase font-bold rounded-none px-1.5 py-0",
    BADGE_FREE: "ml-2 shrink-0 border border-primary px-1.5 py-0 text-primary text-[11px] uppercase font-bold tracking-widest",
    LINK: "flex h-full flex-col hover:no-underline group focus-editorial",
    TITLE: "text-2xl font-black text-foreground group-hover:text-editorial transition-colors leading-none tracking-tight flex-grow uppercase",
    DESCRIPTION: "text-foreground leading-relaxed text-sm sm:text-base font-serif opacity-90 text-justify hyphens-auto line-clamp-4",
    PRICE_LABEL: "text-[11px] font-mono uppercase tracking-widest text-muted-foreground",
    READ_MORE: "text-[11px] font-mono uppercase tracking-widest text-editorial font-bold group-hover:underline",
    LABEL_CHIP: "rounded-none border border-border px-2 py-1 text-[11px] uppercase font-bold tracking-widest text-muted-foreground"
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
                    <span className={STYLES.BADGE_NEW} aria-label="Recently added tool">
                        New
                    </span>
                )}
                {isPopular && (
                    <span className={STYLES.BADGE_POPULAR} aria-label="Popular tool">
                        Popular
                    </span>
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
            <span className={STYLES.BADGE_FREE} aria-label="Free tool">
                Free
            </span>
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
                    <span
                        key={`${label}-${toolUrl}`}
                        className={STYLES.LABEL_CHIP}
                        role="listitem"
                        aria-label={`Category: ${label}`}
                    >
                        {label}
                    </span>
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
            label && typeof label === 'string' && popularKeywords.includes(label.toLowerCase())
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

            <CardContent className={`${isNew || isPopular ? "pt-2" : "pt-6"} flex flex-grow flex-col px-0`}>
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

                    <div className="mt-auto flex items-center justify-between pt-4">
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
