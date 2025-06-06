import { useEffect, useRef, useState } from "react";
import useQueryParams from "../../hooks/useQueryParams";

const SearchQuery = function ({ handleSearch }) {
    const [queryValue, setQueryValue] = useQueryParams();
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        queryValue && handleSearch(queryValue);
    }, [queryValue]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.isComposing || e.keyCode === 229) return;

            const letterK = 75;
            if (e.keyCode === letterK && (e.metaKey || e.ctrlKey)) {
                e.preventDefault(); 
                inputRef.current.focus();
                inputRef.current.select();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    const _handleSearch = (e) => {
        e.preventDefault();
        const keyword = e?.currentTarget?.q?.value;
        setQueryValue(keyword);
        handleSearch(keyword);
    };

    return (
        <div className="w-full">
            <form 
                onSubmit={_handleSearch} 
                className={`relative transition-all duration-300 ${isFocused ? 'shadow-paper-lg' : 'shadow-paper'}`}
            >
                <div className="relative flex items-center w-full">
                    {/* Search Icon */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    
                    {/* Search Input */}
                    <input
                        type="search"
                        name="q"
                        className="w-full pl-12 pr-24 py-4 font-sans text-lg bg-background-light border border-border rounded-lg outline-none focus:border-syntax-purple focus:ring-2 focus:ring-syntax-purple/30 placeholder-text-secondary text-text-primary transition-all duration-200"
                        placeholder="Search articles..."
                        defaultValue={queryValue}
                        ref={inputRef}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        aria-label="Search articles"
                    />
                    
                    {/* Keyboard Shortcut Hint */}
                    <div className="absolute right-24 top-1/2 transform -translate-y-1/2 hidden md:flex items-center text-sm text-text-secondary">
                        <span className="px-1.5 py-0.5 border border-border rounded mr-1 font-mono bg-background-highlight">⌘</span>
                        <span className="px-1.5 py-0.5 border border-border rounded font-mono bg-background-highlight">K</span>
                    </div>
                    
                    {/* Search Button */}
                    <button 
                        className="absolute right-0 top-0 bottom-0 w-20 bg-primary text-background font-medium px-4 rounded-r-lg hover:bg-accent focus:ring-2 focus:ring-offset-2 focus:ring-syntax-purple transition-all duration-200 font-sans shadow-lg hover:shadow-xl"
                        type="submit"
                        aria-label="Search"
                    >
                        Search
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchQuery;