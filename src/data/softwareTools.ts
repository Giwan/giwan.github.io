import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const softwareTools: TTool[] = [
    {
        title: "ProductHunt",
        url: "https://www.producthunt.com/",
        description: "Find great software as they are released.",
        price: 0,
        category: subCategories.SOFTWARE,
        labels: [labels.productivity, labels.software],
    },

    {
        title: "Readme.com",
        url: "https://readme.com/",
        description: "Create and manage documentation. ",
        price: 0,
        category: subCategories.SOFTWARE,
        labels: [labels.productivity, labels.project],
    },
    {
        title: "webmonetization",
        url: "https://webmonetization.org/",
        description: "Monetize the web without dark patterns at webmonetization.org",
        price: 0,
        category: subCategories.SOFTWARE,
        labels: [labels.productivity, labels.project],
    },
    {
        title: "patreon.com",
        url: "https://www.patreon.com",
        description: "Monetization for creators",
        price: 0,
        category: subCategories.SOFTWARE,
        labels: [labels.productivity, labels.project],
    },
    {
        title: "tiny-helpers.dev",
        url: "https://tiny-helpers.dev/",
        description: "Fun little helpers on the web to get things done.",
        price: 0,
        category: subCategories.SOFTWARE,
        labels: [labels.productivity, labels.project],
    },
];

export default softwareTools;
