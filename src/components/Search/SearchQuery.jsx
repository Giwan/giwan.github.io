import { useEffect, useRef } from "react";
import {
    searchQueryStyle,
    searchQueryInput,
    searchQueryButton,
} from "./searchQuery.module.css";
import useQueryParams from "../../hooks/useQueryParams";

const SearchQuery = function ({ handleSearch }) {
    const [queryValue, setQueryValue] = useQueryParams();
    const inputRef = useRef();

    useEffect(() => {
        queryValue && handleSearch(queryValue);
    }, [queryValue]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.isComposing || e.keyCode === 229) return;

            const letterK = 75;
            if (e.keyCode === letterK && e.metaKey) {
                e.preventDefault(); // stop Firefox from searching in the address bar
                inputRef.current.focus();
                inputRef.current.select();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        () => window.removeEventListener("keydown", handleKeyPress);
    });

    const _handleSearch = (e) => {
        e.preventDefault();
        const keyword = e?.currentTarget?.q?.value;
        setQueryValue(keyword);
        handleSearch(keyword);
    };

    return (
        <form onSubmit={_handleSearch} className={searchQueryStyle}>
            <input
                type="search"
                name="q"
                className={searchQueryInput}
                defaultValue={queryValue}
                ref={inputRef}
            />
            <button className={searchQueryButton}>Search</button>
        </form>
    );
};

export default SearchQuery;
