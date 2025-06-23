import React from "react";

const SearchResults = function ({ searchData }) {
    if (!searchData?.keyword) {
        return (
            <div className="text-center py-8">
                <p className="font-sans text-muted-foreground text-base">
                    Enter a search term to find articles
                </p>
            </div>
        );
    }
    
    const { results, keyword } = searchData;
    const resultCount = results?.length || 0;
    
    if (resultCount === 0) {
        return (
            <div className="bg-card p-6 rounded-lg border border-border">
                <div className="text-center py-4">
                    <h3 className="font-heading text-xl text-foreground mb-2 font-semibold">No results found</h3>
                    <p className="font-serif text-muted-foreground text-base mb-4">
                        We couldn't find any articles matching "<span className="font-bold text-primary">{keyword}</span>"
                    </p>
                    <div className="mt-4 border-t border-border pt-4">
                        <h4 className="font-heading text-lg mb-2 font-semibold text-foreground">Suggestions:</h4>
                        <ul className="text-muted-foreground text-left list-disc pl-8 text-base space-y-1">
                            <li>Check your spelling</li>
                            <li>Try using more general keywords</li>
                            <li>Try searching for related topics</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <div className="border-b-2 border-primary pb-3 mb-6 bg-card rounded-t-lg px-4 py-3">
                <p className="font-heading text-lg font-semibold text-foreground" aria-live="polite">
                    <span className="font-bold text-primary">{resultCount}</span> {resultCount === 1 ? 'result' : 'results'} for: 
                    <span className="bg-muted px-2 py-1 ml-2 font-serif italic rounded text-primary">"{keyword}"</span>
                </p>
            </div>
            
            <ul className="space-y-4">
                {results?.map((result) => (
                    <li key={result.id} className="bg-card rounded-lg border border-border transition-all duration-200">
                        <a 
                            href={`/blog/${result.id}`} 
                            className="block p-6 hover:bg-muted/50 rounded-lg transition-all duration-200 group"
                        >
                            <h3 className="font-heading text-xl text-foreground mb-3 group-hover:text-primary font-semibold">
                                {result.title}
                            </h3>
                            <div className="flex justify-between items-center">
                                <p className="font-serif text-muted-foreground text-base">
                                    {result.date}
                                </p>
                                <span className="text-primary text-base font-semibold group-hover:text-primary/80 transition-colors duration-200">Read article →</span>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResults;