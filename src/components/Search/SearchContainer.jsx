import { useState, useEffect } from "react";
import SearchQuery from "./SearchQuery";
import SearchResults from "./SearchResults";
import { posts } from "../../../cache/searchData";
import { filterMatchingPosts } from "./search.helper";

const SearchContainer = function () {
    const [searchData, setSearchData] = useState({});
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = function (keyword) {
        if (!keyword || keyword.trim() === '') {
            setSearchData({});
            return;
        }
        
        setIsSearching(true);
        
        // Simulate a slight delay for better UX with a loading state
        setTimeout(() => {
            setSearchData({
                keyword,
                results: filterMatchingPosts(posts)(keyword),
            });
            setIsSearching(false);
        }, 300);
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-8 text-center bg-card rounded-lg p-6 border border-border">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Search Articles</h2>
                <p className="text-muted-foreground text-lg">Find stories, interviews, and insights from our archives</p>
            </div>
            
            <div className="mb-8">
                <SearchQuery handleSearch={handleSearch} />
            </div>
            
            <div className="min-h-[200px]">
                {isSearching ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="flex flex-col items-center bg-muted rounded-lg p-8 border border-border">
                            <div className="h-8 w-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mb-3"></div>
                            <p className="text-muted-foreground italic">Searching archives...</p>
                        </div>
                    </div>
                ) : (
                    <SearchResults searchData={searchData} />
                )}
            </div>
        </div>
    );
};

export default SearchContainer;