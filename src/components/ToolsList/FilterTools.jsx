import { subCategories } from "../../data/categories";
import { Button } from "@/components/ui/button";

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
        <Button
            onClick={handleClick}
            key={label}
            value={subCategories[label]}
            variant={category === subCategories[label] ? "default" : "outline"}
            size="sm"
        >
            {subCategories[label]?.toLowerCase()}
        </Button>
    ));
    const allButton = (
        <Button 
            key="all-button" 
            onClick={clearFilters} 
            variant={!category ? "default" : "outline"}
            size="sm"
        >
            All
        </Button>
    );
    return [allButton, ...filterButtons];
};

export default FilterTools;
