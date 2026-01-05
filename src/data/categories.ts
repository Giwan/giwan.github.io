
export const subCategories = {
    DESIGN: "Design",
    WRITING: "Writing",
    READING: "Reading",
    DEVELOPER: "Developer",
    WIREFRAME: "Wireframe",
    PROJECT_MANAGEMENT: "Project Management",
    SOFTWARE: "Software",
    SOCIAL: "Social",
    DATA_MANAGEMENT: "Data",
    SEARCH: "Search",
    AI_ML: "AI & ML",
    HOSTING: "Hosting",
    FRAMEWORKS: "Frameworks",
    TESTING: "Testing",
    MONITORING: "Monitoring"
}

export const categoriesList = ["all", ...Object.values(subCategories)];

export const categories = {
    ...subCategories,
    NOTES: "Notes",
    EMAIL: "Email",
    MARKETING: "Marketing",
    PRODUCTIVITY: "Productivity",
}

export default Object.freeze(categories);
