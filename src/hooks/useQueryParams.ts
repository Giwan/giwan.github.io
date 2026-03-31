/**
 * A custom hook to get and set the
 * query parameter
 */

import { useEffect, useState } from "react";

function useQueryParams() {
    const [queryValue, updateQueryValue] = useState<string | null | undefined>();

    useEffect(() => {
        const getQ = () => new URLSearchParams(window.location.search).get("q");

        // Initial detection
        updateQueryValue(getQ());

        // Handle browser back/forward buttons
        const handlePopState = () => {
            updateQueryValue(getQ());
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const setQueryValue = (value: string) => {
        const url = new URL(window.location.href);
        if (value) {
            url.searchParams.set("q", value);
        } else {
            url.searchParams.delete("q");
        }

        // Update URL without a hard reload
        window.history.pushState({}, "", url);
        updateQueryValue(value);
    }

    return [queryValue, setQueryValue] as const;
}

export default useQueryParams;