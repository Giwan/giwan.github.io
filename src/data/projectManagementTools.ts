import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const projectManagementTools: TTool[] = [
    {
        title: "Trello",
        url: "https://trello.com",
        description:
            "A project management tools. Great for new projects. This is a great alternative for something like Jira. It's great for tracking your projects",
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.project, labels.management, labels.productivity],
    },
    {
        title: "Miro",
        url: "https://miro.com/",
        description:
            "The online collaborative whiteboard platform. Plan projects, create boards and use various media types.",
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.engineering],
    },
    {
        title: "Tweek",
        url: "https://tweek.so/",
        description:
            `Tweek Calendar is a Minimal Weekly Planner & To-Do List App. 
            The design is quite intriguing and makes it a pleasure to use.
            I'm not sure that this is for larger projects though. 
            `,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.design],
    },
    {
        title: "Notion",
        url: "https://www.notion.so/",
        description:
            `A nicely design full project management tools. This is very much for larger teams. `,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.design],
    },
    // Modern Note-taking Apps
    {
        title: "Obsidian",
        url: "https://obsidian.md/",
        description: `Powerful knowledge base that works on top of local folder of plain text Markdown files. Features linking, graph view, and extensive plugin ecosystem.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.notes, labels.markdown, labels.personal],
    },
    {
        title: "Roam Research",
        url: "https://roamresearch.com/",
        description: `Note-taking tool for networked thought. Create bi-directional links between ideas and build a knowledge graph.`,
        price: 15,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.notes, labels.personal],
    },
    {
        title: "Logseq",
        url: "https://logseq.com/",
        description: `Open-source, local-first knowledge base. Block-based editor with bi-directional linking and privacy-focused design.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.notes, labels.markdown, labels.opensource, labels.privacy],
    },
    {
        title: "RemNote",
        url: "https://www.remnote.com/",
        description: `All-in-one tool for thinking and learning. Combines note-taking, spaced repetition, and PDF annotation.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.notes, labels.education, labels.personal],
    },
    {
        title: "Craft",
        url: "https://www.craft.do/",
        description: `Beautiful, native note-taking app for Apple devices. Structured documents with linking, media support, and collaboration.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.notes, labels.design, labels.collaboration],
    },
    // Time Tracking and Project Management
    {
        title: "Toggl Track",
        url: "https://toggl.com/track/",
        description: `Simple time tracking tool for teams and freelancers. Track time across projects with detailed reporting and analytics.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.management, labels.tracking],
    },
    {
        title: "RescueTime",
        url: "https://www.rescuetime.com/",
        description: `Automatic time tracking and productivity insights. Understand how you spend your time and improve focus.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.tracking, labels.analytics, labels.personal],
    },
    {
        title: "Clockify",
        url: "https://clockify.me/",
        description: `Free time tracking software for teams. Track work hours across projects with reporting and team management features.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.management, labels.tracking, labels.collaboration],
    },
    {
        title: "Monday.com",
        url: "https://monday.com/",
        description: `Work operating system for teams. Customizable workflows, project tracking, and team collaboration platform.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.management, labels.collaboration, labels.project],
    },
    {
        title: "Asana",
        url: "https://asana.com/",
        description: `Team collaboration and project management platform. Track tasks, projects, and goals with timeline and calendar views.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.management, labels.collaboration, labels.project],
    },
    {
        title: "ClickUp",
        url: "https://clickup.com/",
        description: `All-in-one productivity platform. Combines tasks, docs, goals, and chat in one customizable workspace.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.management, labels.collaboration, labels.project],
    },
    // Communication and Collaboration Tools
    {
        title: "Discord",
        url: "https://discord.com/",
        description: `Voice, video, and text communication platform. Popular for gaming communities and developer teams.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.collaboration, labels.social],
    },
    {
        title: "Slack",
        url: "https://slack.com/",
        description: `Business communication platform. Organize conversations in channels with file sharing and app integrations.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.collaboration, labels.management],
    },
    {
        title: "Microsoft Teams",
        url: "https://www.microsoft.com/en-us/microsoft-teams/",
        description: `Collaboration platform with chat, video meetings, file storage, and app integration. Part of Microsoft 365.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.collaboration, labels.management],
    },
    {
        title: "Zoom",
        url: "https://zoom.us/",
        description: `Video conferencing and online meeting platform. HD video, screen sharing, and recording capabilities.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.collaboration],
    },
    {
        title: "Loom",
        url: "https://www.loom.com/",
        description: `Screen and video recording tool for async communication. Record your screen, voice, and face for quick video messages.`,
        price: 0,
        category: subCategories.PROJECT_MANAGEMENT,
        labels: [labels.productivity, labels.collaboration, labels.education],
    },
];

export default projectManagementTools;
