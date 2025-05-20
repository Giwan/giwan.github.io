export const isCategorySelected = (currentCat: string, selectedCat?: string) =>
    Boolean(selectedCat && currentCat === selectedCat);