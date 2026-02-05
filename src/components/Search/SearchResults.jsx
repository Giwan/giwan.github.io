import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const STYLES = {
    SECTION_CONTAINER: "space-y-6",
    // Empty & No Results
    EMPTY_CARD: "bg-card border-border text-center py-12 px-6 rounded-none border-t-2 border-primary/20",
    EMPTY_TEXT: "font-serif italic text-muted-foreground text-lg",
    NO_RESULTS_HEADER: "font-heading text-2xl font-black uppercase text-foreground mb-2",
    SUGGESTION_TITLE: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4 block",
    // Result Item
    RESULT_CARD: "shadow-none transition-all duration-300 border-0 border-l-4 border-primary rounded-none bg-background group/card hover:bg-muted/30 focus-within:ring-2 focus-within:ring-primary",
    RESULT_TITLE: "text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight uppercase mb-3",
    RESULT_DATE: "font-serif italic text-muted-foreground text-sm",
    READ_MORE: "text-[10px] font-mono uppercase tracking-widest text-primary font-bold group-hover:underline",
    // Stat Card (Result Count)
    STAT_CARD: "bg-primary/5 border-primary/20 rounded-none border-t-4",
    STAT_TITLE: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground",
    STAT_VALUE: "text-2xl font-black text-primary uppercase",
};

const EmptyState = () => (
    <div className={STYLES.EMPTY_CARD}>
        <p className={STYLES.EMPTY_TEXT}>
            Enter a search term to find articles in our archives
        </p>
    </div>
);

const NoResults = ({ keyword }) => (
    <Card className="rounded-none border-t-4 border-destructive/50 bg-destructive/5">
        <CardContent className="pt-8 text-center">
            <h3 className={STYLES.NO_RESULTS_HEADER}>No results found</h3>
            <p className="font-serif italic text-muted-foreground mb-8">
                We couldn't find any articles matching "<span className="font-bold text-destructive">{keyword}</span>"
            </p>
            
            <div className="border-t border-border pt-6 max-w-sm mx-auto text-left">
                <span className={STYLES.SUGGESTION_TITLE}>Suggestions</span>
                <ul className="text-muted-foreground list-disc pl-5 space-y-2 font-serif italic text-sm">
                    <li>Check your spelling for typos</li>
                    <li>Try using more general keywords</li>
                    <li>Search for broader topics or eras</li>
                </ul>
            </div>
        </CardContent>
    </Card>
);

const ResultsHeader = ({ count, keyword }) => (
    <Card className={STYLES.STAT_CARD}>
        <CardHeader className="pb-2">
            <CardTitle className={STYLES.STAT_TITLE}>Search Discovery</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                <span className={STYLES.STAT_VALUE} aria-live="polite">
                    {count} {count === 1 ? "Result" : "Results"}
                </span>
                <span className="font-serif italic text-muted-foreground text-sm">
                    found for "{keyword}"
                </span>
            </div>
        </CardContent>
    </Card>
);

const ResultItem = ({ result }) => (
    <Card className={STYLES.RESULT_CARD}>
        <CardContent className="p-6">
            <a 
                href={`/blog/${result.id}`} 
                className="block group focus:outline-none"
                aria-label={`Read article: ${result.title}`}
            >
                <h3 className={STYLES.RESULT_TITLE}>
                    {result.title}
                </h3>
                <div className="flex justify-between items-center mt-4">
                    <p className={STYLES.RESULT_DATE}>
                        {result.date}
                    </p>
                    <span className={STYLES.READ_MORE} aria-hidden="true">
                        Read Story →
                    </span>
                </div>
            </a>
        </CardContent>
    </Card>
);

const SearchResults = React.memo(function ({ searchData }) {
    if (!searchData?.keyword) return <EmptyState />;
    
    const { results, keyword } = searchData;
    const resultCount = results?.length || 0;
    
    if (resultCount === 0) return <NoResults keyword={keyword} />;
    
    return (
        <div className={STYLES.SECTION_CONTAINER}>
            <ResultsHeader count={resultCount} keyword={keyword} />
            
            <div className="space-y-4" role="list">
                {results.map((result) => (
                    <div key={result.id} role="listitem">
                        <ResultItem result={result} />
                    </div>
                ))}
            </div>
        </div>
    );
});

export default SearchResults;