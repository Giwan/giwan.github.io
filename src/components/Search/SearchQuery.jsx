import { useEffect, useRef, useState } from "react";
import useQueryParams from "../../hooks/useQueryParams";

const STYLES = {
    form: "relative transition-all duration-300",
    container: "relative flex items-center w-full",
    iconContainer: "absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground",
    input: "w-full pl-12 pr-24 py-4 font-sans text-lg bg-background border border-input rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-ring placeholder-muted-foreground text-foreground transition-all duration-200",
    shortcutHint: "absolute right-24 top-1/2 transform -translate-y-1/2 hidden md:flex items-center text-sm text-muted-foreground",
    shortcutKey: "px-1.5 py-0.5 border border-border rounded font-mono bg-muted",
    submitButton: "absolute right-0 top-0 bottom-0 w-20 bg-primary text-primary-foreground font-medium px-4 rounded-r-lg hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200 font-sans"
};

const SearchQuery = function ({ handleSearch }) {
    const [queryValue, setQueryValue] = useQueryParams();
    const [inputValue, setInputValue] = useState(queryValue ?? "");
    const [modifierKey, setModifierKey] = useState("⌘");
    const inputRef = useRef(null);

    // Sync input value and trigger search when URL query param changes
    useEffect(() => {
        if (queryValue === undefined) return;
        handleSearch(queryValue);
        setInputValue(queryValue ?? "");
    }, [queryValue, handleSearch]);

    // Keyboard shortcuts & Platform detection
    useEffect(() => {
        const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPod|iPad/.test(navigator.platform);
        setModifierKey(isMac ? "⌘" : "Ctrl");

        const handleKeyPress = (e) => {
            if (e.isComposing || e.keyCode === 229) return;

            const isK = e.key?.toLowerCase() === "k";
            const isModifier = e.metaKey || e.ctrlKey;

            if (isK && isModifier) {
                e.preventDefault(); 
                inputRef.current?.focus();
                inputRef.current?.select();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const keyword = inputValue.trim();
        setQueryValue(keyword);
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className={STYLES.form}>
                <div className={STYLES.container}>
                    {/* Search Icon */}
                    <div className={STYLES.iconContainer}>
                        <SearchIcon />
                    </div>
                    
                    {/* Search Input */}
                    <input
                        type="search"
                        name="q"
                        className={STYLES.input}
                        placeholder="Search articles..."
                        value={inputValue}
                        ref={inputRef}
                        onChange={handleChange}
                        aria-label="Search articles"
                    />
                    
                    {/* Keyboard Shortcut Hint */}
                    <div className={STYLES.shortcutHint}>
                        <span className={`${STYLES.shortcutKey} mr-1`}>{modifierKey}</span>
                        <span className={STYLES.shortcutKey}>K</span>
                    </div>
                    
                    {/* Search Button */}
                    <button 
                        className={STYLES.submitButton}
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

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export default SearchQuery;