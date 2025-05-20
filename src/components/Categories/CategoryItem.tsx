import style from "./categories.module.css";
import { isCategorySelected } from "../../utils/helpers/isCategorySelected";

type TProps = {
    selectedCategory?: string;
    c: string;
};

const CategoryItem = ({ c, selectedCategory }: TProps) => (
    <li
        key={c}
        className={style.categoriesListItemStyle}
        data-is-selected={isCategorySelected(c, selectedCategory)}
    >
        <a href={`/tools/${c}`}>{c}</a>
    </li>
);

export default CategoryItem;
