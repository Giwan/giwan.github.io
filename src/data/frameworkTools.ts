import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const frameworkTools: TTool[] = [
    {
        title: "Next.js",
        url: "https://nextjs.org/",
        description: `React framework with hybrid static & server rendering, TypeScript support, smart bundling, and more. 
        Provides excellent developer experience with zero-config setup and automatic optimizations.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.framework, labels.react, labels.typescript, labels.serverless, labels.jamstack],
    },
    {
        title: "Remix",
        url: "https://remix.run/",
        description: `Full-stack web framework focused on web standards and modern UX. 
        Emphasizes server-side rendering, progressive enhancement, and excellent performance.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.framework, labels.react, labels.typescript, labels.performance, labels.accessibility],
    },
    {
        title: "SvelteKit",
        url: "https://kit.svelte.dev/",
        description: `Full-stack framework built on Svelte with server-side rendering, routing, and code-splitting. 
        Offers excellent performance with minimal JavaScript bundle sizes.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.framework, labels.typescript, labels.performance, labels.jamstack, labels.serverless],
    },
    {
        title: "Nuxt",
        url: "https://nuxt.com/",
        description: `Vue.js framework for building performant and production-grade full-stack web applications. 
        Features server-side rendering, static site generation, and excellent developer experience.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.framework, labels.vue, labels.typescript, labels.jamstack, labels.serverless],
    },
    {
        title: "Astro",
        url: "https://astro.build/",
        description: `Modern static site generator that delivers lightning-fast performance with a component-based architecture. 
        Supports multiple UI frameworks and ships zero JavaScript by default.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.framework, labels.jamstack, labels.performance, labels.react, labels.vue],
    },
    {
        title: "Vite",
        url: "https://vitejs.dev/",
        description: `Next-generation frontend build tool that provides instant server start and lightning-fast HMR. 
        Works with multiple frameworks and offers excellent development experience.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.framework, labels.engineering, labels.performance, labels.react, labels.vue],
    },
    {
        title: "Angular",
        url: "https://angular.io/",
        description: `Platform and framework for building single-page client applications using HTML and TypeScript. 
        Provides comprehensive tooling, dependency injection, and enterprise-grade features.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.framework, labels.angular, labels.typescript, labels.mobile, labels.enterprise],
    },
    {
        title: "Vue.js",
        url: "https://vuejs.org/",
        description: `Progressive JavaScript framework for building user interfaces. 
        Designed to be incrementally adoptable with excellent documentation and gentle learning curve.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.framework, labels.vue, labels.typescript, labels.progressive, labels.reactive],
    },
    {
        title: "React",
        url: "https://react.dev/",
        description: `JavaScript library for building user interfaces with component-based architecture. 
        Maintained by Meta with large ecosystem and excellent community support.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.library, labels.react, labels.typescript, labels.component, labels.ecosystem],
    },
    {
        title: "Solid.js",
        url: "https://www.solidjs.com/",
        description: `Declarative JavaScript library for building user interfaces with fine-grained reactivity. 
        Offers React-like developer experience with better performance and smaller bundle sizes.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.library, labels.typescript, labels.performance, labels.reactive, labels.component],
    },
    {
        title: "Qwik",
        url: "https://qwik.builder.io/",
        description: `Resumable framework for building instant-loading web applications. 
        Features O(1) loading time regardless of application complexity through resumability.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.framework, labels.typescript, labels.performance, labels.resumable, labels.jamstack],
    },
    {
        title: "Fresh",
        url: "https://fresh.deno.dev/",
        description: `Full-stack web framework for Deno that delivers zero runtime overhead. 
        Uses islands architecture and provides excellent performance with minimal JavaScript.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.framework, labels.typescript, labels.performance, labels.deno, labels.islands],
    },
    {
        title: "T3 Stack",
        url: "https://create.t3.gg/",
        description: `Opinionated full-stack TypeScript framework combining Next.js, tRPC, Tailwind CSS, and Prisma. 
        Provides type-safe development experience from database to frontend.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.framework, labels.typescript, labels.react, labels.database, labels["type-safe"]],
    },
    {
        title: "Gatsby",
        url: "https://www.gatsbyjs.com/",
        description: `React-based static site generator with GraphQL data layer and plugin ecosystem. 
        Excellent for content-heavy sites with automatic performance optimizations.`,
        price: 0,
        category: subCategories.FRAMEWORKS,
        labels: [labels.framework, labels.react, labels.jamstack, labels.graphql, labels.performance],
    }
];

export default frameworkTools;