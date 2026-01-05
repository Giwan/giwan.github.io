import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const developerTools: TTool[] = [
    {
        title: "Cloudinary",
        url: "https://cloudinary.com/",
        description: `A great image server. Developers use it to serve images.
        It allows the image to be transformed before sending it to the client.
        This is especially important when serving responsive images.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.image],
    },
    {
        title: "Codepen",
        url: "https://codepen.io",
        description: `Online playground to create html CSS and JavaScript projects. 
        Use it to quickly experiment or see how others go about addressing certain issues.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "Codesandbox",
        url: "https://codesandbox.io/",
        description: `Online playground to create html CSS and JavaScript projects. 
        Use it to quickly experiment or see how others go about addressing certain issues. `,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "Glitch",
        url: "https://glitch.com/",
        description: `Online playground to create html CSS and JavaScript projects, but also NodeJS apps.
        Use it to quickly experiment. However it's also possible to host anything you create. `,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "Replit",
        url: "https://replit.com/",
        description: `In browser IDE that supports over 50 languages. 
        Replit is especially special since most of the tools listed here don't support backend that much. 
        However I have to admit that I don't use this much. `,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "JSFiddle",
        url: "https://jsfiddle.net/",
        description: `An online IDE for HTML, CSS and JavaScript snippets known as fiddles. 
        The interface splits into four panes which can can resized. `,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "StackBlitz",
        url: "https://stackblitz.com/",
        description: `StackBlitz's WebContainers tech is a novel approach to the online development environment space. 
        These only work on chromium based browsers at the moment but the technology is very exciting. `,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "CSS Shadows",
        url: "https://shadows.brumm.af/",
        description: `Find the perfect shadows for your CSS styles. 
        Use the handles to easily visualise the depth and blur levels of the shadows. `,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "Cubic bezier tool",
        url: "https://cubic-bezier.com/",
        description: `A well known tool to find just the right Cubic Bezier curve for a given CSS animation. `,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "CSS waves",
        url: "https://svgwave.in/",
        description: `Generate beautify CSS waves for your next design. Export them as SVG or PNG files.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    // Modern Code Editors and IDEs
    {
        title: "Cursor",
        url: "https://cursor.sh/",
        description: `AI-powered code editor built on VS Code. Features intelligent code completion, chat with your codebase, and AI-assisted refactoring.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.engineering, labels["ai-powered"], labels.typescript],
    },
    {
        title: "Zed",
        url: "https://zed.dev/",
        description: `High-performance, multiplayer code editor from the creators of Atom and Tree-sitter. Built in Rust for speed and collaboration.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.engineering, labels.collaboration],
    },
    {
        title: "Nova",
        url: "https://nova.app/",
        description: `Beautiful, fast, flexible code editor for Mac. Native macOS app with powerful extensions and built-in Git integration.`,
        price: 99,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "Fleet",
        url: "https://www.jetbrains.com/fleet/",
        description: `Next-generation IDE from JetBrains. Lightweight editor that can transform into a full IDE when needed.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.engineering, labels.collaboration],
    },
    // API Development Tools
    {
        title: "Insomnia",
        url: "https://insomnia.rest/",
        description: `Powerful REST API client with GraphQL support, environment management, and team collaboration features.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.api, labels.testing, labels.graphql],
    },
    {
        title: "Hoppscotch",
        url: "https://hoppscotch.io/",
        description: `Open-source API development ecosystem. Lightweight, fast, and beautiful alternative to Postman with real-time collaboration.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.api, labels.testing, labels.opensource, labels.collaboration],
    },
    {
        title: "Bruno",
        url: "https://www.usebruno.com/",
        description: `Fast and Git-friendly open-source API client. Stores collections directly in folders on your filesystem.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.api, labels.testing, labels.opensource, labels["version-control"]],
    },
    {
        title: "Paw",
        url: "https://paw.cloud/",
        description: `Full-featured HTTP client for Mac with beautiful native interface, dynamic values, and code generation.`,
        price: 49.99,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.api, labels.testing],
    },
    {
        title: "HTTPie",
        url: "https://httpie.io/",
        description: `Modern, user-friendly command-line HTTP client and desktop app for API interaction and testing.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.api, labels.testing, labels.opensource],
    },
    // Database Tools and ORMs
    {
        title: "Prisma",
        url: "https://www.prisma.io/",
        description: `Next-generation ORM for Node.js and TypeScript. Type-safe database client with intuitive data modeling and migrations.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.database, labels.typescript, labels.nodejs, labels["type-safe"]],
    },
    {
        title: "Drizzle ORM",
        url: "https://orm.drizzle.team/",
        description: `Lightweight TypeScript ORM with SQL-like syntax. Designed for performance with zero runtime overhead.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.database, labels.typescript, labels.nodejs, labels["type-safe"], labels.opensource],
    },
    {
        title: "TablePlus",
        url: "https://tableplus.com/",
        description: `Modern, native database management tool with clean interface. Supports MySQL, PostgreSQL, SQLite, and more.`,
        price: 89,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.database, labels.management],
    },
    {
        title: "DBeaver",
        url: "https://dbeaver.io/",
        description: `Universal database tool for developers and database administrators. Supports all major databases with rich feature set.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.database, labels.management, labels.opensource],
    },
    {
        title: "Supabase",
        url: "https://supabase.com/",
        description: `Open-source Firebase alternative. Provides database, authentication, real-time subscriptions, and storage.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.database, labels.cloud, labels.opensource, labels.serverless],
    },
    {
        title: "PlanetScale",
        url: "https://planetscale.com/",
        description: `Serverless MySQL platform with branching, non-blocking schema changes, and global distribution.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.database, labels.cloud, labels.serverless],
    },
    {
        title: "Neon",
        url: "https://neon.tech/",
        description: `Serverless PostgreSQL with branching, autoscaling, and point-in-time recovery. Built for modern development workflows.`,
        price: 0,
        category: subCategories.DEVELOPER,
        labels: [labels.productivity, labels.database, labels.cloud, labels.serverless],
    },

];

export default developerTools;
