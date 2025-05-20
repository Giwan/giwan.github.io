import categories from "./categories.ts";
import labels from "./labels.ts";

const writingTools = [

    {
        title: "Google doc",
        url: "https://docs.google.com",
        description:
            "Document writing. Create documents. If you've used Microsoft Word, this is a capable online alternative from Google.",
        price: 0,
        category: categories.WRITING,
        labels: [labels.productivity, labels.writing],
    },
    {
        title: "HackMD",
        url: "https://hackmd.io/",
        description:
            "Write markdown documents and store them in your github account. Great online editor for writing notes in markdown",
        price: 0,
        category: categories.WRITING,
        labels: [labels.productivity, labels.writing, labels.markdown],
    },
    {
        title: "Ghost",
        url: "https://ghost.org",
        description: "A medium like blog with more customization options. Host it on your own servers or opt for the (paid) hosted version. ",
        price: 0,
        category: categories.WRITING,
        labels: [labels.productivity, labels.writing],
    },
    {
        title: "txtfiddle.com",
        url: "https://txtfiddle.com/",
        description: "Wrangle text files. Wrap text, add line numbers or convert it to an md5 hash. Remove the html tags from text or convert markdown to html.",
        price: 0,
        category: categories.WRITING,
        labels: [labels.productivity, labels.writing],
    },

    {
        title: "Hemingway Editor",
        url: "https://hemingwayapp.com/",
        description: "An online editor that helps you write higher quality content. It will make suggestions for improvements and help you get to a higher quality article.",
        price: 0,
        category: categories.WRITING,
        labels: [labels.productivity, labels.writing],
    },
    {
        title: "Etherpad",
        url: "https://etherpad.org/",
        description: "Google docs alternative. And it's open source.",
        price: 0,
        category: categories.WRITING,
        labels: [labels.productivity, labels.writing, labels.notes],
    },
    {
        title: "Starlight",
        url: "https://starlight.astro.build",
        description: "Documentation tool based on AstroJS framework. Similar to Docusaurus",
        price: 0,
        category: categories.WRITING,
        labels: [labels.documentation],
    },
    {
        title: "Docusaurus",
        url: "https://docusaurus.io/",
        description: "Documentation tool based on AstroJS framework. Similar to Docusaurus",
        price: 0,
        category: categories.WRITING,
        labels: [labels.documentation],
    },
    {
        title: "GoodNotes",
        url: "https://www.goodnotes.com/",
        description: "GoodNotes is an app that lets you take digital notes and annotate PDFs. It allows you to combine handwritten and typed text, images, and even convert your handwriting to text.",
        price: 30,
        currency: "usd",
        category: categories.WRITING,
        labels: [labels.documentation],
    }
];

export default writingTools;
