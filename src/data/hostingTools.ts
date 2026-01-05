import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const hostingTools: TTool[] = [
    {
        title: "Vercel",
        url: "https://vercel.com/",
        description: `Frontend cloud platform optimized for Next.js and modern web frameworks. 
        Provides instant deployments, automatic scaling, and edge functions with excellent developer experience.`,
        price: 0,
        category: subCategories.HOSTING,
        labels: [labels.hosting, labels.deployment, labels.serverless, labels.jamstack, labels.react],
    },
    {
        title: "Netlify",
        url: "https://www.netlify.com/",
        description: `All-in-one platform for modern web projects with continuous deployment from Git. 
        Features include serverless functions, form handling, and powerful build tools.`,
        price: 0,
        category: subCategories.HOSTING,
        labels: [labels.hosting, labels.deployment, labels.serverless, labels.jamstack, labels.ci],
    },
    {
        title: "Railway",
        url: "https://railway.app/",
        description: `Modern deployment platform that simplifies shipping applications. 
        Supports databases, services, and provides instant deployments with automatic scaling.`,
        price: 0,
        category: subCategories.HOSTING,
        labels: [labels.hosting, labels.deployment, labels.cloud, labels.database, labels.devops],
    },
    {
        title: "Fly.io",
        url: "https://fly.io/",
        description: `Global application platform that runs applications close to users worldwide. 
        Excellent for full-stack applications with built-in database and edge deployment capabilities.`,
        price: 0,
        category: subCategories.HOSTING,
        labels: [labels.hosting, labels.deployment, labels.cloud, labels.database, labels.performance],
    },
    {
        title: "Render",
        url: "https://render.com/",
        description: `Unified cloud platform for building and running applications and websites. 
        Provides automatic deployments, managed databases, and background services.`,
        price: 0,
        category: subCategories.HOSTING,
        labels: [labels.hosting, labels.deployment, labels.cloud, labels.database, labels.devops],
    },
    {
        title: "Supabase",
        url: "https://supabase.com/",
        description: `Open-source Firebase alternative with PostgreSQL database, authentication, and real-time subscriptions. 
        Includes hosting capabilities for full-stack applications.`,
        price: 0,
        category: subCategories.HOSTING,
        labels: [labels.hosting, labels.database, labels.api, labels.cloud, labels.deployment],
    },
    {
        title: "PlanetScale",
        url: "https://planetscale.com/",
        description: `Serverless MySQL platform with branching capabilities for database schema changes. 
        Provides global edge database deployment with automatic scaling.`,
        price: 0,
        category: subCategories.HOSTING,
        labels: [labels.database, labels.serverless, labels.cloud, labels.performance, labels.devops],
    },
    {
        title: "Cloudflare Pages",
        url: "https://pages.cloudflare.com/",
        description: `JAMstack platform for deploying static sites and serverless functions. 
        Leverages Cloudflare's global network for exceptional performance and security.`,
        price: 0,
        category: subCategories.HOSTING,
        labels: [labels.hosting, labels.deployment, labels.jamstack, labels.serverless, labels.performance],
    },
    {
        title: "GitHub Pages",
        url: "https://pages.github.com/",
        description: `Static site hosting directly from GitHub repositories. 
        Perfect for documentation, portfolios, and open-source project sites with automatic deployment.`,
        price: 0,
        category: subCategories.HOSTING,
        labels: [labels.hosting, labels.deployment, labels.jamstack, labels["version-control"], labels.ci],
    },
    {
        title: "Heroku",
        url: "https://www.heroku.com/",
        description: `Cloud platform that enables companies to build, deliver, monitor, and scale applications. 
        Supports multiple programming languages with add-on ecosystem for databases and services.`,
        price: 0,
        category: subCategories.HOSTING,
        labels: [labels.hosting, labels.deployment, labels.cloud, labels.devops, labels.database],
    },
    {
        title: "DigitalOcean App Platform",
        url: "https://www.digitalocean.com/products/app-platform",
        description: `Platform-as-a-Service offering that simplifies deploying, managing, and scaling applications. 
        Supports static sites, APIs, databases, and background workers.`,
        price: 0,
        category: subCategories.HOSTING,
        labels: [labels.hosting, labels.deployment, labels.cloud, labels.database, labels.devops],
    },
    {
        title: "AWS Amplify",
        url: "https://aws.amazon.com/amplify/",
        description: `Full-stack development platform for building scalable web and mobile applications. 
        Provides hosting, authentication, APIs, and database services with AWS integration.`,
        price: 0,
        category: subCategories.HOSTING,
        labels: [labels.hosting, labels.deployment, labels.cloud, labels.serverless, labels.mobile],
    }
];

export default hostingTools;