import { categoriesList } from "../../data/categories";
import style from "./categories.module.css";
import CategoryItem from "./CategoryItem";

export type TCategoryProps = {
    category: string;
};

/**
 * List the categories that the user can filter on
 */
const Categories = ({ category }: TCategoryProps) => (
    <nav className={style.categoriesNav}>
        <ul className={style.categoriesListStyle}>
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
