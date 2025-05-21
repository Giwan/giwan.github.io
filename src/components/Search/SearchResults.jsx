import React from "react";

const SearchResults = function ({ searchData }) {
    if (!searchData?.keyword) {
        return (
            <div className="text-center py-8">
                <p className="font-serif text-muted italic text-base">
                    Enter a search term to find articles
                </p>
            </div>
        );
    }
    
    const { results, keyword } = searchData;
    const resultCount = results?.length || 0;
    
    if (resultCount === 0) {
        return (
            <div className="bg-paperDark p-6 rounded-sm shadow-inner-sm">
                <div className="text-center py-4">
                    <h3 className="font-heading text-xl text-heading mb-2 font-semibold">No results found</h3>
                    <p className="font-serif text-body text-base mb-4">
                        We couldn't find any articles matching "<span className="font-bold">{keyword}</span>"
                    </p>
                    <div className="mt-4 border-t border-border pt-4">
                        <h4 className="font-heading text-lg mb-2 font-semibold">Suggestions:</h4>
                        <ul className="text-body text-left list-disc pl-8 text-base">
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
            <div className="border-b-3 border-primary pb-2 mb-6">
                <p className="font-heading text-lg font-semibold" aria-live="polite">
                    <span className="font-bold">{resultCount}</span> {resultCount === 1 ? 'result' : 'results'} for: 
                    <span className="bg-highlight px-2 ml-2 font-serif italic">"{keyword}"</span>
                </p>
            </div>
            
            <ul className="space-y-6">
                {results?.map((result) => (
                    <li key={result.id} className="pb-6 border-b border-border last:border-b-0">
                        <a 
                            href={`/blog/${result.id}`} 
                            className="block transition-colors duration-200 hover:bg-paperDark p-4 -m-4 rounded-sm"
                        >
                            <h3 className="font-heading text-xl text-heading mb-2 hover:text-accent font-semibold">
                                {result.title}
                            </h3>
                            <div className="flex justify-between items-center">
                                <p className="font-serif text-muted text-base">
                                    {result.date}
                                </p>
                                <span className="text-accent text-base font-semibold">Read article →</span>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResults;