import categories from "./categories";
import labels from "./labels";


const developerTools = [
    {
        title: "Cloudinary",
        url: "https://cloudinary.com/",
        description: `A great image server. Developers use it to serve images.
        It allows the image to be transformed before sending it to the client.
        This is especially important when serving responsive images.`,
        price: 0,
        category: categories.DEVELOPER,
        labels: [labels.productivity, labels.image],
    },
    {
        title: "Codepen",
        url: "https://codepen.io",
        description: `Online playground to create html CSS and JavaScript projects. 
        Use it to quickly experiment or see how others go about addressing certain issues.`,
        price: 0,
        category: categories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "Codesandbox",
        url: "https://codesandbox.io/",
        description: `Online playground to create html CSS and JavaScript projects. 
        Use it to quickly experiment or see how others go about addressing certain issues. `,
        price: 0,
        category: categories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "Glitch",
        url: "https://glitch.com/",
        description: `Online playground to create html CSS and JavaScript projects, but also NodeJS apps.
        Use it to quickly experiment. However it's also possible to host anything you create. `,
        price: 0,
        category: categories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "Replit",
        url: "https://replit.com/",
        description: `In browser IDE that supports over 50 languages. 
        Replit is especially special since most of the tools listed here don't support backend that much. 
        However I have to admit that I don't use this much. `,
        price: 0,
        category: categories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "JSFiddle",
        url: "https://jsfiddle.net/",
        description: `An online IDE for HTML, CSS and JavaScript snippets known as fiddles. 
        The interface splits into four panes which can can resized. `,
        price: 0,
        category: categories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "StackBlitz",
        url: "https://stackblitz.com/",
        description: `StackBlitz's WebContainers tech is a novel approach to the online development environment space. 
        These only work on chromium based browsers at the moment but the technology is very exciting. `,
        price: 0,
        category: categories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "CSS Shadows",
        url: "https://shadows.brumm.af/",
        description: `Find the perfect shadows for your CSS styles. 
        Use the handles to easily visualise the depth and blur levels of the shadows. `,
        price: 0,
        category: categories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "Cubic bezier tool",
        url: "https://cubic-bezier.com/",
        description: `A well known tool to find just the right Cubic Bezier curve for a given CSS animation. `,
        price: 0,
        category: categories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "CSS waves",
        url: "https://svgwave.in/",
        description: `Generate beautify CSS waves for your next design. Export them as SVG or PNG files.`,
        price: 0,
        category: categories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },

];

export default developerTools;
