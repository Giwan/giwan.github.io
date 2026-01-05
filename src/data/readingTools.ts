import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const readingTools: TTool[] = [
    {
        title: "Instapaper",
        url: "https://instapaper.com/",
        description: "Instapaper saves web content for later and possibly offline reading",
        price: 0,
        category: subCategories.READING,
        labels: [labels.reading, labels.productivity, labels.education],
    },
    {
        title: "HackerNews",
        url: "https://news.ycombinator.com/",
        description: "Lots of technical news of higher quality. Very little clickbait kind of content. The comments and discussions can be interesting.",
        price: 0,
        category: subCategories.READING,
        labels: [labels.reading, labels.news],
    },
    {
        title: "Medium",
        url: "https://medium.com/",
        description: "Medium has lots of good content. Unfortunately I'm not always happy with the direction that it's taking as a platform",
        price: 0,
        category: subCategories.READING,
        labels: [labels.reading, labels.productivity, labels.education],
    },
    {
        title: "Scribe.rip",
        url: "https://scribe.rip",
        description: "Read medium articles without medium",
        price: 0,
        category: subCategories.READING,
        labels: [labels.reading, labels.productivity],
    },
];

export default readingTools;
