import { isCategorySelected } from "../../utils/helpers/isCategorySelected";
import { cn } from "@/lib/utils";

type TProps = {
    selectedCategory?: string;
    c: string;
};

const CategoryItem = ({ c, selectedCategory }: TProps) => {
    const isSelected = isCategorySelected(c, selectedCategory);

    return (
        <li>
            <a
                href={`/tools/${c}`}
                aria-current={isSelected ? "page" : undefined}
                className={cn(
                    "focus-editorial inline-flex h-9 items-center rounded-none border px-4 text-[11px] font-bold uppercase tracking-widest transition-colors",
                    isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-editorial hover:text-editorial"
                )}
            >
                {c}
            </a>
        </li>
    );
};

export default CategoryItem;
