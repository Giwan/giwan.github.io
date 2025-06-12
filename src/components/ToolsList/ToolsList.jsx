import React from "react";
import tools from "../../data/tools";
import ToolItem from "./ToolItem";
import { filteredList } from "../../utils/helpers";

const ToolsList = ({ category }) => (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredList(tools, category).map((tool) => (
            <ToolItem key={tool.url} tool={tool} />
        ))}
    </section>
);

export default ToolsList;
