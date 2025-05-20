import { useState } from "react";
import SearchQuery from "./SearchQuery";
import SearchResults from "./SearchResults";
import { searchAndResultsContainer } from "./search.module.css";
import { posts } from "../../../cache/searchData";
import { filterMatchingPosts } from "./search.helper";

const Search = function () {
    const [searchData, setSearchData] = useState({});

    const handleSearch = function (keyword) {
        setSearchData({
            keyword,
            results: filterMatchingPosts(posts)(keyword),
        });
    };

    return (
        <div className={searchAndResultsContainer}>
            <SearchQuery {...{ handleSearch }} />
            <SearchResults {...{ searchData }} />
        </div>
    );
};

export default Search;
