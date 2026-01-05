import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const designTools: TTool[] = [
    {
        title: "Figma",
        url: "https://figma.com",
        description:
            "App great design tool. It's easy to use and especially get started. No installation required for example. Simply fireup your web browser and signup and get started.",
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.productivity],
    },

    {
        title: "Dribbble",
        url: "https://dribbble.com/",
        description: `UI and UX social plaform. 
        It's great to browse through the designs from others. 
        It motivates and inspires `,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.productivity, labels.design],
    },
    {
        title: "Behance",
        url: "https://www.behance.net/",
        description: `UI and UX plaform. 
        Teams can easily share their projects making it easy to see the contributions from everyone`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.productivity, labels.design],
    },

    {
        title: "AutoDraw",
        url: "https://autodraw.com/",
        description: "Draw shapes and easily turn them into icons.",
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.productivity, labels.design],
    },
    {
        title: "Framer",
        url: "https://www.framer.com",
        description: "No-code environment for designing beautiful websites",
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.productivity, labels.design, labels.prototype],
    },
    {
        title: "Spline.design",
        url: "https://spline.design/",
        description: "Figma for 3D designs! Create 3D scenes, edit materials, and model 3D objects.",
        price: 0,
        category: subCategories.DESIGN,
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
        category: subCategories.DESIGN,
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
        category: subCategories.DESIGN,
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
        category: subCategories.DESIGN,
        labels: [labels.productivity, labels.prototype]
    },
    // Modern Design and Collaboration Tools
    {
        title: "Linear",
        url: "https://linear.app/",
        description: `Beautiful, fast issue tracking tool built for modern software teams. Streamlined workflows with keyboard shortcuts and Git integration.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.productivity, labels.management, labels.collaboration, labels.project],
    },
    {
        title: "Notion",
        url: "https://www.notion.so/",
        description: `All-in-one workspace for notes, docs, wikis, and project management. Powerful blocks-based editor with database functionality.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.productivity, labels.notes, labels.collaboration, labels.documentation, labels.management],
    },
    {
        title: "Miro",
        url: "https://miro.com/",
        description: `Online collaborative whiteboard platform for visual collaboration, brainstorming, and design thinking workshops.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.productivity, labels.collaboration, labels.wireframe, labels.prototype],
    },
    {
        title: "FigJam",
        url: "https://www.figma.com/figjam/",
        description: `Online whiteboard from Figma for brainstorming, diagramming, and creative collaboration with your team.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.productivity, labels.collaboration, labels.wireframe, labels.prototype],
    },
    {
        title: "Excalidraw",
        url: "https://excalidraw.com/",
        description: `Virtual collaborative whiteboard tool that lets you easily sketch diagrams with a hand-drawn feel.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.productivity, labels.collaboration, labels.wireframe, labels.opensource],
    },
    {
        title: "Penpot",
        url: "https://penpot.app/",
        description: `Open-source design and prototyping platform for cross-domain teams. Web-based with SVG support and developer handoff.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.productivity, labels.design, labels.prototype, labels.opensource, labels.collaboration],
    },
    // Icon and Asset Libraries
    {
        title: "Heroicons",
        url: "https://heroicons.com/",
        description: `Beautiful hand-crafted SVG icons by the makers of Tailwind CSS. Available in outline and solid styles.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.opensource, labels.productivity],
    },
    {
        title: "Lucide",
        url: "https://lucide.dev/",
        description: `Beautiful & consistent icon toolkit made by the community. Fork of Feather icons with 1000+ icons.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.opensource, labels.productivity],
    },
    {
        title: "Phosphor Icons",
        url: "https://phosphoricons.com/",
        description: `Flexible icon family with multiple weights and styles. Over 6,000 icons available in web font and SVG formats.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.opensource, labels.productivity],
    },
    {
        title: "Tabler Icons",
        url: "https://tabler-icons.io/",
        description: `Over 4,000 free SVG icons designed for web interfaces. Consistent, pixel-perfect, and customizable.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.opensource, labels.productivity],
    },
    {
        title: "Iconify",
        url: "https://iconify.design/",
        description: `Unified icon framework with 150,000+ icons from popular icon sets. Use any icon as SVG or web font.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.opensource, labels.productivity],
    },
    {
        title: "Unsplash",
        url: "https://unsplash.com/",
        description: `High-quality stock photos from talented photographers worldwide. Free to use for any project.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.productivity, labels.image],
    },
    {
        title: "Pexels",
        url: "https://www.pexels.com/",
        description: `Free stock photos, videos, and music for your creative projects. High-quality content from creators worldwide.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.productivity, labels.image],
    },
    // Color Palette and Design System Tools
    {
        title: "Coolors",
        url: "https://coolors.co/",
        description: `Fast color palette generator with trending palettes, accessibility checker, and export options.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.productivity, labels.accessibility],
    },
    {
        title: "Adobe Color",
        url: "https://color.adobe.com/",
        description: `Color palette generator and explorer with color wheel, trending palettes, and accessibility tools.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.productivity, labels.accessibility],
    },
    {
        title: "Contrast",
        url: "https://usecontrast.com/",
        description: `macOS app for quick access to WCAG color contrast ratios. Essential for accessible design.`,
        price: 9.99,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.productivity, labels.accessibility],
    },
    {
        title: "Huetone",
        url: "https://huetone.ardov.me/",
        description: `Tool for creating accessible color systems. Generate color palettes with proper contrast ratios.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.productivity, labels.accessibility],
    },
    {
        title: "Radix Colors",
        url: "https://www.radix-ui.com/colors",
        description: `Open-source color system for design systems. Carefully crafted color scales for UI design.`,
        price: 0,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.productivity, labels.opensource, labels.accessibility],
    },
    {
        title: "Tailwind UI",
        url: "https://tailwindui.com/",
        description: `Beautiful UI components and templates built with Tailwind CSS. Professional designs for modern web apps.`,
        price: 149,
        category: subCategories.DESIGN,
        labels: [labels.design, labels.productivity, labels.component, labels.react, labels.vue],
    },
];

export default designTools;
