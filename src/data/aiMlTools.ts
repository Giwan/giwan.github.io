import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const aiMlTools: TTool[] = [
    {
        title: "ChatGPT",
        url: "https://chat.openai.com/",
        description: `OpenAI's conversational AI assistant that can help with coding, writing, analysis, and problem-solving. 
        Excellent for code generation, debugging, and explaining complex concepts.`,
        price: 0,
        category: subCategories.AI_ML,
        labels: [labels["ai-powered"], labels.productivity, labels.engineering],
    },
    {
        title: "GitHub Copilot",
        url: "https://github.com/features/copilot",
        description: `AI-powered code completion tool that suggests entire lines or blocks of code as you type. 
        Trained on billions of lines of code to help developers write code faster and with fewer errors.`,
        price: 10,
        currency: "USD",
        category: subCategories.AI_ML,
        labels: [labels["ai-powered"], labels.engineering, labels.productivity],
    },
    {
        title: "Cursor",
        url: "https://cursor.sh/",
        description: `AI-first code editor built on VS Code that integrates AI directly into your development workflow. 
        Features include AI chat, code generation, and intelligent code editing.`,
        price: 0,
        category: subCategories.AI_ML,
        labels: [labels["ai-powered"], labels.engineering, labels.productivity],
    },
    {
        title: "Claude",
        url: "https://claude.ai/",
        description: `Anthropic's AI assistant that excels at complex reasoning, coding, and analysis tasks. 
        Particularly strong at understanding context and providing detailed technical explanations.`,
        price: 0,
        category: subCategories.AI_ML,
        labels: [labels["ai-powered"], labels.productivity, labels.engineering],
    },
    {
        title: "Codeium",
        url: "https://codeium.com/",
        description: `Free AI-powered code completion and chat assistant that works with 70+ programming languages. 
        Offers real-time suggestions and explanations directly in your IDE.`,
        price: 0,
        category: subCategories.AI_ML,
        labels: [labels["ai-powered"], labels.engineering, labels.productivity],
    },
    {
        title: "Tabnine",
        url: "https://www.tabnine.com/",
        description: `AI code assistant that provides intelligent code completions based on your codebase and coding patterns. 
        Supports team training and on-premises deployment for enterprise security.`,
        price: 0,
        category: subCategories.AI_ML,
        labels: [labels["ai-powered"], labels.engineering, labels.productivity],
    },
    {
        title: "Replit Ghostwriter",
        url: "https://replit.com/ai",
        description: `AI-powered coding assistant integrated into Replit's online IDE. 
        Provides code completion, generation, and debugging assistance across multiple languages.`,
        price: 0,
        category: subCategories.AI_ML,
        labels: [labels["ai-powered"], labels.engineering, labels.productivity],
    },
    {
        title: "Amazon CodeWhisperer",
        url: "https://aws.amazon.com/codewhisperer/",
        description: `Amazon's AI coding companion that generates code suggestions in real-time. 
        Trained on billions of lines of code and optimized for AWS services integration.`,
        price: 0,
        category: subCategories.AI_ML,
        labels: [labels["ai-powered"], labels.engineering, labels.cloud, labels.productivity],
    },
    {
        title: "Sourcegraph Cody",
        url: "https://sourcegraph.com/cody",
        description: `AI coding assistant that understands your entire codebase to provide contextually relevant suggestions. 
        Integrates with popular IDEs and supports code search and explanation.`,
        price: 0,
        category: subCategories.AI_ML,
        labels: [labels["ai-powered"], labels.engineering, labels.productivity],
    },
    {
        title: "Perplexity AI",
        url: "https://www.perplexity.ai/",
        description: `AI-powered research and answer engine that provides cited sources for technical questions. 
        Excellent for researching programming concepts and finding up-to-date technical information.`,
        price: 0,
        category: subCategories.AI_ML,
        labels: [labels["ai-powered"], labels.productivity, labels.search, labels.documentation],
    },
    {
        title: "v0 by Vercel",
        url: "https://v0.dev/",
        description: `AI-powered UI generator that creates React components from text descriptions. 
        Generates clean, production-ready code using modern frameworks like Next.js and Tailwind CSS.`,
        price: 0,
        category: subCategories.AI_ML,
        labels: [labels["ai-powered"], labels.react, labels.engineering, labels.design],
    },
    {
        title: "Bolt.new",
        url: "https://bolt.new/",
        description: `AI-powered full-stack development environment that can build and deploy web applications from natural language descriptions. 
        Supports modern frameworks and provides instant preview capabilities.`,
        price: 0,
        category: subCategories.AI_ML,
        labels: [labels["ai-powered"], labels.engineering, labels.deployment, labels.productivity],
    }
];

export default aiMlTools;