/**
 * A custom hook to get and set the
 * query parameter
 */

import { useEffect, useState } from "react";

function useQueryParams() {
    const [queryValue, updateQueryValue] = useState<string | null | undefined>();

    useEffect(() => {
        const q = new URLSearchParams(location.search).get("q");
        updateQueryValue(q);
    }, []);

    const setQueryValue = (value: string) => {
        if (!value) return;
        location.search = `?q=${value}`;
        updateQueryValue(value);
    }

    return [queryValue, setQueryValue];
}

export default useQueryParams;