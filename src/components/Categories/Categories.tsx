import { categoriesList } from "../../data/categories";
import CategoryItem from "./CategoryItem";

export type TCategoryProps = {
    category: string;
};

/**
 * List the categories that the user can filter on
 */
const Categories = ({ category }: TCategoryProps) => (
    <nav className="mb-8" role="navigation" aria-label="Tool categories">
        <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">Categories</h2>
            <p className="text-sm text-muted-foreground">Filter tools by category</p>
        </div>
        <ul className="flex flex-wrap gap-2 sm:gap-3">
            {categoriesList.map((c) => (
                <CategoryItem
                    {...{
                        key: c,
                        c,
                        selectedCategory: category,
                    }}
                />
            ))}
        </ul>
    </nav>
);

export default Categories;
