import { useState } from "react";
import ToolsList from "./ToolsList";
import FilterTools from "./FilterTools";

const Tools = () => {
    const [category, setCategory] = useState();

    return (
        <>
            <FilterTools {...{ setCategory, category }} />
            <ToolsList {...{ category }} />
        </>
    );
};

export default Tools;
