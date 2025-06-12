import { categoriesList } from "../../data/categories";
import CategoryItem from "./CategoryItem";

export type TCategoryProps = {
    category: string;
};

/**
 * List the categories that the user can filter on
 */
const Categories = ({ category }: TCategoryProps) => (
    <nav className="mb-8">
        <ul className="flex flex-wrap gap-2">
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
