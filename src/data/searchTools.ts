import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const searchTools: TTool[] = [
    {
        title: "phind.com",
        url: "https://phind.com",
        description: `An AI based search engine specifically for developers. It's free to use.`,
        price: 0,
        category: subCategories.SEARCH,
        labels: [labels.search]
    },

    {
        title: "chat.openai.com",
        url: "https://chat.openai.com/",
        description: `Generic chatbot. It can also be used by developers. Free to use but requires signup.`,
        price: 1,
        category: subCategories.SEARCH,
        labels: [labels.search]
    },
    {
        title: "chat.bing.com",
        url: "https://chat.bing.com/",
        description: `Chat bot that's based on chat GPT.`,
        price: 1,
        category: subCategories.SEARCH,
        labels: [labels.search]
    },

]

export default searchTools; 