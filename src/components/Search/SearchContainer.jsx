import { useState, useEffect, useRef, useCallback } from "react";
import SearchQuery from "./SearchQuery";
import SearchResults from "./SearchResults";
import { posts } from "@/cache/searchData";
import { filterMatchingPosts } from "./search.helper";

const SearchContainer = function () {
    const [searchData, setSearchData] = useState({});
    const [isSearching, setIsSearching] = useState(false);
    const searchDelayRef = useRef(null);

    const handleSearch = useCallback((keyword) => {
        const trimmedKeyword = keyword?.trim() ?? "";

        if (searchDelayRef.current) {
            clearTimeout(searchDelayRef.current);
            searchDelayRef.current = null;
        }

        if (!trimmedKeyword) {
            setSearchData({});
            setIsSearching(false);
            return;
        }
        
        setIsSearching(true);
        
        // Simulate a slight delay for better UX with a loading state
        searchDelayRef.current = window.setTimeout(() => {
            setSearchData({
                keyword: trimmedKeyword,
                results: filterMatchingPosts(posts)(trimmedKeyword),
            });
            setIsSearching(false);
            searchDelayRef.current = null;
        }, 300);
    }, []);

    useEffect(() => {
        return () => {
            if (searchDelayRef.current) {
                clearTimeout(searchDelayRef.current);
            }
        };
    }, []);

    return (
        <div className="max-w-3xl mx-auto py-4">
            <header className="mb-10 text-center">
                <h1 className="mb-3 font-serif text-4xl font-bold text-foreground md:text-5xl">Search</h1>
                <p className="font-serif text-lg text-muted-foreground">Find stories, interviews, and insights from our archives</p>
            </header>

            <section className="mb-8">
                <SearchQuery handleSearch={handleSearch} />
            </section>
            
            <section className="min-h-[200px]" aria-live="polite">
                {isSearching ? <SearchLoadingState /> : <SearchResults searchData={searchData} />}
            </section>
        </div>
    );
};

const SearchLoadingState = () => (
    <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3 border border-border bg-muted p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            <p className="font-serif italic text-muted-foreground">Searching archives...</p>
        </div>
    </div>
);

export default SearchContainer;