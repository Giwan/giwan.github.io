import filteredList from "./helpers/filteredList.ts";
import type { IPost } from "../types/post.d.ts";
import type { TRouter, TTarget } from "../types/router.d.ts";

export { filteredList };


export const reverseDate = (date = "") =>
    parseInt(date.split("-").reverse().join(""));

/**
 * Format the string date to a number
 * Typically used for sorting by date
 * @param {String} date A date string that formatted as 10-10-1980
 * @returns Number
 */
export const getDateNumber = (dateString: string) => {
    if (typeof dateString !== "string") {
        throw new Error("Provided date argument is not of type string");
    }
    return Number(dateString?.replace(/-/g, "")) || 0;
}

/**
 * Check to see what style should be applied.
 * This is used by the navigation route.
 * It is in this file mostly because of testing.
 * @param {Object} router The router parameters object
 * @param {Object} styles The imported styles object
 * @param {Object | String} target The target path
 */
export const getStyle = (router: TRouter, styles: {
    activeLink: string;
}, target: TTarget) => {
    const [_target, _routes] = getStyleValidation(router, target);

    // early check for exact match
    if (router.pathname === _target) {
        return styles.activeLink;
    }

    if (Array.isArray(_routes) && _routes.length) {
        return _routes.find((route) => router.pathname.indexOf(route) > -1)
            ? styles.activeLink
            : undefined;
    }
};

/**
 * Throws an error if any important information is missing
 * when determining the routes.
 * @param {Object} router
 * @param {String | Object} target
 */
export const getStyleValidation = (router: TRouter, target: TTarget) => {
    if (!(router && router.pathname)) {
        throw new Error("Please provide a valid router object with pathname");
    }

    let _target = target,
        _routes: string[] = [];

    if (typeof target === "object") {
        if (!target.path) {
            throw new Error(
                "The path value is required when the target is an object. target: " +
                JSON.stringify(target)
            );
        }
        _target = target.path;
        _routes = target.routes;
    }

    return [_target, _routes];
};

const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
};

export const formatArticlePublishedDate = (post: IPost) => {

    const { pubDate, published } = post.frontmatter;
    const articleDate = pubDate || published;

    return formatDateWithOptions(String(articleDate));
}

export const formatDate = (dateOptionsFiltered: object) => (date: string) => new Date(date).toLocaleDateString(
    "en-GB",
    dateOptionsFiltered
)

export const formatDateWithOptions = (date: string) => {
    const dateOptionsFiltered = {
        ...dateOptions,
        weekday: "long"
    };

    return formatDate(dateOptionsFiltered)(date);
}
