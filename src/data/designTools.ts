import categories from "./categories";
import labels from "./labels";

const designTools = [
    {
        title: "Figma",
        url: "https://figma.com",
        description:
            "App great design tool. It's easy to use and especially get started. No installation required for example. Simply fireup your web browser and signup and get started.",
        category: categories.DESIGN,
        labels: [labels.design, labels.productivity],
    },

    {
        title: "Dribbble",
        url: "https://dribbble.com/",
        description: `UI and UX social plaform. 
        It's great to browse through the designs from others. 
        It motivates and inspires `,
        price: 0,
        category: categories.DESIGN,
        labels: [labels.productivity, labels.design],
    },
    {
        title: "Behance",
        url: "https://www.behance.net/",
        description: `UI and UX plaform. 
        Teams can easily share their projects making it easy to see the contributions from everyone`,
        price: 0,
        category: categories.DESIGN,
        labels: [labels.productivity, labels.design],
    },

    {
        title: "AutoDraw",
        url: "https://autodraw.com/",
        description: "Draw shapes and easily turn them into icons.",
        price: 0,
        category: categories.DESIGN,
        labels: [labels.productivity, labels.design],
    },
    {
        title: "Framer",
        url: "https://www.framer.com",
        description: "No-code environment for designing beautiful websites",
        price: 0,
        category: categories.DESIGN,
        labels: [labels.productivity, labels.design, labels.prototype],
    },
    {
        title: "Spline.design",
        url: "https://spline.design/",
        description: "Figma for 3D designs! Create 3D scenes, edit materials, and model 3D objects.",
        price: 0,
        category: categories.DESIGN,
        labels: [labels.productivity, labels.prototype]
    },
    {
        title: "reasonable.work",
        url: "https://reasonable.work",
        description: `When working on a new project picking colours can be hard. 
        This helps to find the right colour that is also accessible. 
        Everybody benefits from accessible sites. 
        I also like the simplicity of the site's design.
        `,
        price: 0,
        category: categories.DESIGN,
        labels: [labels.productivity, labels.prototype]
    },
    {
        title: "octopus.do",
        url: "https://octopus.do",
        description: `
        A well designed app that helps visually build out your sitemap.
        Useful to quickly visialise the different pages of your site. 
        `,
        price: 0,
        category: categories.DESIGN,
        labels: [labels.productivity, labels.prototype]
    },
    {
        title: "tints.dev",
        url: "https://www.tints.dev",
        description: `
        Find the perfect colour swatch for your tailwind based project.
        It's great inspiration for possible new project. 
        `,
        price: 0,
        category: categories.DESIGN,
        labels: [labels.productivity, labels.prototype]
    },
];

export default designTools;
