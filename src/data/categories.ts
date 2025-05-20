
export const subCategories = {
    DESIGN: "Design",
    WRITING: "Writing",
    READING: "Reading",
    DEVELOPER: "Developer",
    WIREFRAME: "Wireframe",
    PROJECT_MANAGEMENT: "Project",
    SOFTWARE: "software",
    SOCIAL: "Social",
    DATA_MANAGEMENT: "Data",
    SEARCH: "search"
}

export const categoriesList = ["all", ...Object.values(subCategories)];

export const categories = {
    ...subCategories,
    NOTES: "Notes",
    EMAIL: "Email",
    MARKETING: "Marketing",
    PRODUCTIVITY: "productivity",
}

export default Object.freeze(categories);
