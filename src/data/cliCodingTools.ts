import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const cliCodingTools: TTool[] = [
    {
        title: "GitHub Copilot CLI",
        url: "https://github.com/features/copilot#cli",
        description: "The power of GitHub Copilot, in the command line. The Copilot CLI translates natural language into shell commands, and provides explanations for command-line tools.",
        price: 10,
        category: subCategories.CLI,
        labels: [labels.productivity, labels.engineering, labels["ai-powered"]],
    },
    {
        title: "Gemini CLI",
        url: "https://blog.google/technology/developers/google-gemini-cli/",
        description: "An open-source, Google-developed CLI that gives you direct, lightweight access to Gemini models in your terminal. It offers a generous free tier for Gemini 1.5 Pro.",
        price: 0,
        category: subCategories.CLI,
        labels: [labels.productivity, labels.engineering, labels["ai-powered"]],
    },
    {
        title: "Amp",
        url: "https://amp.sh/",
        description: "A frontier coding agent from Sourcegraph that lets you wield the full power of leading models directly from your terminal. Offers a free, ad-supported tier.",
        price: 0,
        category: subCategories.CLI,
        labels: [labels.productivity, labels.engineering, labels["ai-powered"]],
    },
    {
        title: "OpenCode",
        url: "https://opencode.ai/",
        description: "An open-source AI coding agent built for the terminal. It can be configured to use various models, including Z.AI's GLM models, with plans starting at $3/month.",
        price: 3,
        category: subCategories.CLI,
        labels: [labels.productivity, labels.engineering, labels["ai-powered"]],
    },
];

export default cliCodingTools;
