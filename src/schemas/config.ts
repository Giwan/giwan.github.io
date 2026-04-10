import { z } from "zod";

export const FrameworkConfigSchema = z.object({
  site: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    author: z.string().min(1),
    logoText: z.string().optional(),
    siteUrl: z.string().url(),
    lang: z.string().default("en"),
    dir: z.enum(["ltr", "rtl"]).default("ltr"),
    social: z.object({
      twitter: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
      mastodon: z.string().url().optional(),
      email: z.string().email().optional(),
    }).default({}),
    umamiWebsiteId: z.string().optional(),
  }),
  navigation: z.object({
    header: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    footer: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  }).default({}),
  features: z.object({
    enableSearch: z.boolean().default(true),
    enablePWA: z.boolean().default(true),
    enableToolsPage: z.boolean().default(false),
    enableRSS: z.boolean().default(true),
    enableSitemap: z.boolean().default(true),
  }).default({
    enableSearch: true,
    enablePWA: true,
    enableToolsPage: false,
    enableRSS: true,
    enableSitemap: true,
  }),
  theme: z.object({
    active: z.enum(["newspaper", "minimal", "modern"]).default("newspaper"),
    themeColor: z.string().default("#272822"),
    backgroundColor: z.string().default("#808080"),
    overrides: z.record(z.string()).optional(),
  }).default({
    active: "newspaper",
    themeColor: "#272822",
    backgroundColor: "#808080",
  }),
  routing: z.object({
    homepage: z.enum(["blog", "tools"]).default("blog"),
  }).default({
    homepage: "blog",
  }),
  assets: z.object({
    favicon: z.string().default("/favicon.svg"),
    defaultHeroImage: z.string().default("/placeholder-social.jpg"),
  }).default({
    favicon: "/favicon.svg",
    defaultHeroImage: "/placeholder-social.jpg",
  }),
  publication: z.object({
    issueNumber: z.number().optional(),
  }).default({}),
});

export type FrameworkConfig = z.infer<typeof FrameworkConfigSchema>;
