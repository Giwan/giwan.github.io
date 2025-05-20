import React from "react";
import tools from "../../data/tools";
import styles from "../../styles/tools.module.css";
import ToolItem from "./ToolItem";
import { filteredList } from "../../utils/helpers";

const ToolsList = ({ category }) => (
    <section className={styles.toolsList}>
        {filteredList(tools, category).map((tool) => (
            <ToolItem key={tool.url} tool={tool} />
        ))}
    </section>
);

export default ToolsList;
