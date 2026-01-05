import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const monitoringTools: TTool[] = [
    {
        title: "Sentry",
        url: "https://sentry.io/",
        description: `Application monitoring platform that helps developers identify, triage, and resolve issues in real-time. 
        Provides error tracking, performance monitoring, and release health insights.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.monitoring, labels.analytics, labels.performance, labels.debugging, labels.devops],
    },
    {
        title: "LogRocket",
        url: "https://logrocket.com/",
        description: `Frontend monitoring solution that records user sessions to help reproduce bugs and understand user behavior. 
        Combines session replay with performance monitoring and error tracking.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.monitoring, labels.analytics, labels.debugging, labels.performance, labels.ux],
    },
    {
        title: "Datadog",
        url: "https://www.datadoghq.com/",
        description: `Comprehensive monitoring and analytics platform for cloud applications, infrastructure, and logs. 
        Provides real-time visibility across your entire technology stack.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.monitoring, labels.analytics, labels.cloud, labels.infrastructure, labels.devops],
    },
    {
        title: "New Relic",
        url: "https://newrelic.com/",
        description: `Observability platform that helps engineers create more perfect software through data-driven insights. 
        Offers application performance monitoring, infrastructure monitoring, and digital experience monitoring.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.monitoring, labels.analytics, labels.performance, labels.infrastructure, labels.devops],
    },
    {
        title: "Vercel Analytics",
        url: "https://vercel.com/analytics",
        description: `Privacy-friendly web analytics that provides insights into your website's performance and user behavior. 
        Integrates seamlessly with Vercel deployments and respects user privacy.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.analytics, labels.performance, labels.privacy, labels.jamstack, labels.web],
    },
    {
        title: "Google Analytics",
        url: "https://analytics.google.com/",
        description: `Web analytics service that tracks and reports website traffic and user behavior. 
        Provides comprehensive insights into audience, acquisition, behavior, and conversions.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.analytics, labels.web, labels.marketing, labels.tracking, labels.reporting],
    },
    {
        title: "Plausible Analytics",
        url: "https://plausible.io/",
        description: `Simple, privacy-focused web analytics alternative to Google Analytics. 
        Provides essential insights without cookies, tracking scripts, or personal data collection.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.analytics, labels.privacy, labels.web, labels.gdpr, labels.lightweight],
    },
    {
        title: "Mixpanel",
        url: "https://mixpanel.com/",
        description: `Product analytics platform that helps teams track user interactions and measure engagement. 
        Focuses on event-based analytics to understand user behavior and product usage.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.analytics, labels.product, labels.engagement, labels.events, labels.mobile],
    },
    {
        title: "Amplitude",
        url: "https://amplitude.com/",
        description: `Digital analytics platform that helps product teams build better products through data-driven insights. 
        Specializes in user behavior analysis and product optimization.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.analytics, labels.product, labels.behavior, labels.optimization, labels.mobile],
    },
    {
        title: "Hotjar",
        url: "https://www.hotjar.com/",
        description: `Behavior analytics tool that provides heatmaps, session recordings, and user feedback. 
        Helps understand how users interact with your website to improve user experience.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.analytics, labels.ux, labels.heatmaps, labels.feedback, labels.behavior],
    },
    {
        title: "Grafana",
        url: "https://grafana.com/",
        description: `Open-source analytics and interactive visualization platform for monitoring and observability. 
        Supports multiple data sources and provides customizable dashboards.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.monitoring, labels.visualization, labels.opensource, labels.dashboards, labels.devops],
    },
    {
        title: "Prometheus",
        url: "https://prometheus.io/",
        description: `Open-source monitoring system with dimensional data model and powerful query language. 
        Designed for reliability and scalability in cloud-native environments.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.monitoring, labels.opensource, labels.metrics, labels.cloud, labels.devops],
    },
    {
        title: "Uptime Robot",
        url: "https://uptimerobot.com/",
        description: `Website monitoring service that checks your websites every 5 minutes and alerts you when they're down. 
        Provides uptime statistics, status pages, and multiple notification channels.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.monitoring, labels.uptime, labels.alerts, labels.availability, labels.status],
    },
    {
        title: "Pingdom",
        url: "https://www.pingdom.com/",
        description: `Website performance and availability monitoring service with global monitoring locations. 
        Provides detailed performance insights and real user monitoring capabilities.`,
        price: 0,
        category: subCategories.MONITORING,
        labels: [labels.monitoring, labels.performance, labels.uptime, labels.global, labels.rum],
    }
];

export default monitoringTools;