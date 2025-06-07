import React from "react";

const SearchResults = function ({ searchData }) {
    if (!searchData?.keyword) {
        return (
            <div className="text-center py-8">
                <p className="font-sans text-muted text-base">
                    Enter a search term to find articles
                </p>
            </div>
        );
    }
    
    const { results, keyword } = searchData;
    const resultCount = results?.length || 0;
    
    if (resultCount === 0) {
        return (
            <div className="bg-background-light p-6 rounded-lg border border-border shadow-lg">
                <div className="text-center py-4">
                    <h3 className="font-heading text-xl text-text-primary mb-2 font-semibold">No results found</h3>
                    <p className="font-serif text-text-secondary text-base mb-4">
                        We couldn't find any articles matching "<span className="font-bold text-syntax-yellow">{keyword}</span>"
                    </p>
                    <div className="mt-4 border-t border-border pt-4">
                        <h4 className="font-heading text-lg mb-2 font-semibold text-text-primary">Suggestions:</h4>
                        <ul className="text-text-secondary text-left list-disc pl-8 text-base space-y-1">
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
            <div className="border-b-2 border-syntax-purple pb-3 mb-6 bg-background-light rounded-t-lg px-4 py-3">
                <p className="font-heading text-lg font-semibold text-text-primary" aria-live="polite">
                    <span className="font-bold text-syntax-green">{resultCount}</span> {resultCount === 1 ? 'result' : 'results'} for: 
                    <span className="bg-background-highlight px-2 py-1 ml-2 font-serif italic rounded text-syntax-yellow">"{keyword}"</span>
                </p>
            </div>
            
            <ul className="space-y-4">
                {results?.map((result) => (
                    <li key={result.id} className="bg-background-light rounded-lg border border-border shadow-md hover:shadow-lg transition-all duration-200">
                        <a 
                            href={`/blog/${result.id}`} 
                            className="block p-6 hover:bg-background-highlight rounded-lg transition-all duration-200 group"
                        >
                            <h3 className="font-heading text-xl text-text-primary mb-3 group-hover:text-accent font-semibold">
                                {result.title}
                            </h3>
                            <div className="flex justify-between items-center">
                                <p className="font-serif text-text-secondary text-base">
                                    {result.date}
                                </p>
                                <span className="text-accent text-base font-semibold group-hover:text-syntax-purple transition-colors duration-200">Read article →</span>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResults;