import { subCategories } from "../../data/categories";
import { button } from "./FilterTools.module.css";

/**
 * Shows a list of buttons that the user can use to filter on.
 * It loops through the labels available.
 * Not all labels have content however.
 * @param {*} param0
 * @returns
 */
const FilterTools = function ({ setCategory, category }) {
    const handleClick = function (e) {
        setCategory(e.currentTarget.value);
    };

    const clearFilters = () => setCategory(undefined);

    const filterButtons = Object.keys(subCategories).map((label) => (
        <button
            onClick={handleClick}
            key={label}
            value={subCategories[label]}
            className={button}
            data-active={category === subCategories[label]}
        >
            {subCategories[label]?.toLowerCase()}
        </button>
    ));
    const allButton = (
        <button key="all-button" onClick={clearFilters} className={button} data-active={!category}>
            All
        </button>
    );
    return [allButton, ...filterButtons];
};

export default FilterTools;
