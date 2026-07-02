import React from "react";
import { Button } from "@/components/ui/button";
import { isCategorySelected } from "../../utils/helpers/isCategorySelected";
import { getCategoryRoute } from "../../domain/common/router.domain";

type TProps = {
    selectedCategory?: string;
    c: string;
};

const CategoryItem = ({ c, selectedCategory }: TProps) => (
    <li key={c}>
        <Button
            variant={isCategorySelected(c, selectedCategory) ? "default" : "outline"}
            size="sm"
            asChild
        >
            <a href={getCategoryRoute(c)}>{c}</a>
        </Button>
    </li>
);

export default CategoryItem;
