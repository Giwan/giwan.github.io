import { FrameworkConfigSchema, type FrameworkConfig } from "./schemas/config";

/**
 * Validates and exports the framework configuration.
 * For users: Edit this object to customize your site.
 */
const rawConfig = {
  site: {
    title: "Framework Demo",
    description: "Testing the framework features.",
    author: "Framework Tester",
    logoText: "FT",
    siteUrl: "https://example.com",
    lang: "en",
    dir: "ltr",
    social: {
      github: "framework",
    },
  },
  navigation: {
    header: [
      { label: "Home", href: "/" },
      { label: "Tools", href: "/tools" },
    ],
    footer: [
      { label: "Privacy", href: "/privacy" },
    ],
  },
  features: {
    enableSearch: false,
    enablePWA: true,
    enableToolsPage: true,
    enableRSS: false,
  },
  theme: {
    active: "modern",
    themeColor: "#3b82f6",
    backgroundColor: "#f8fafc",
  },
  routing: {
    homepage: "tools",
  },
  assets: {
    favicon: "/favicon.svg",
    defaultHeroImage: "/placeholder-social.jpg",
  },
  publication: {
    issueNumber: 1,
  },
};

const result = FrameworkConfigSchema.safeParse(rawConfig);

if (!result.success) {
  console.error("❌ Configuration validation failed:");
  result.error.issues.forEach((issue) => {
    console.error(` - [${issue.path.join(".")}] ${issue.message}`);
  });
  throw new Error("Framework initialization aborted due to invalid configuration.");
}

export const CONFIG: FrameworkConfig = result.data;
export const SITE_CONFIG = CONFIG.site;
export const THEME_CONFIG = CONFIG.theme;
export const PWA_CONFIG = {
  name: CONFIG.site.title,
  shortName: CONFIG.site.logoText || "Blog",
  description: CONFIG.site.description,
  scope: "/",
  startUrl: "/",
  display: "standalone" as const,
  orientation: "portrait-primary" as const,
  lang: CONFIG.site.lang,
  dir: CONFIG.site.dir,
  categories: ["blog"],
  themeColor: CONFIG.theme.themeColor,
  backgroundColor: CONFIG.theme.backgroundColor,
  icons: [
    {
      src: "/icons/192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icons/512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icons/512-maskable.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};
export const APPLE_TOUCH_ICONS = [
  {
    src: "/icons/180.png",
    sizes: "180x180",
    type: "image/png",
  },
];
export const APPLE_SPLASH_SCREENS = [];
export const WINDOWS_TILE_ICONS = { tileColor: "#000", tileImage: "" };
export const ASSETS = CONFIG.assets;
export const PUBLICATION_INFO = { currentIssue: CONFIG.publication.issueNumber || 1 };
export const SITE_TITLE = CONFIG.site.title;
export const SITE_DESCRIPTION = CONFIG.site.description;
export const SITE_DATE = new Date().toISOString().split("T")[0];
