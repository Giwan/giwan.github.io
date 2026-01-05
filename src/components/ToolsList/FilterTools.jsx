import React from "react";
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

    const handleKeyDown = (e, action) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };

    const filterButtons = Object.keys(subCategories).map((label) => {
        const categoryValue = subCategories[label];
        const isSelected = category === categoryValue;
        
        return (
            <Button
                onClick={handleClick}
                onKeyDown={(e) => handleKeyDown(e, () => setCategory(categoryValue))}
                key={label}
                value={categoryValue}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Filter tools by ${categoryValue} category${isSelected ? ' (currently selected)' : ''}`}
            >
                {categoryValue?.toLowerCase()}
            </Button>
        );
    });
    
    const allButton = (
        <Button 
            key="all-button" 
            onClick={clearFilters}
            onKeyDown={(e) => handleKeyDown(e, clearFilters)}
            variant={!category ? "default" : "outline"}
            size="sm"
            role="button"
            tabIndex={0}
            aria-pressed={!category}
            aria-label={`Show all tools${!category ? ' (currently selected)' : ''}`}
        >
            All
        </Button>
    );
    
    return (
        <div 
            role="group" 
            aria-label="Filter tools by category"
            className="flex flex-wrap gap-2"
        >
            {[allButton, ...filterButtons]}
        </div>
    );
};

export default FilterTools;
