import {
    resultItem,
    resultDate,
    resultItemTitle,
} from "./resultItem.module.css";

const SearchResultItem = function ({ result }) {
    return (
        <li key={result.id} className={resultItem}>
            <a
                href={`/blog/${result.id}`}
                alt={result.title}
                className={resultItemTitle}
            >
                {result.title}
                <span className={resultDate}>{result.date}</span>
            </a>
        </li>
    );
};

export default SearchResultItem;
