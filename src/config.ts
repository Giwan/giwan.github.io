// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_CONFIG = {
  title: "Giwan's Blog",
  description: "Personal technical blog by Giwan – built with Astro.",
  lang: "en",
  dir: "ltr",
  siteUrl: "https://giwan.github.io",
  author: "Giwan",
  social: {
    twitter: "@giwan",
    github: "giwan",
    linkedin: "giwan",
    mastodon: "https://mastodon.social/@giwan",
    email: "giwan@mytoori.com",
  },
  umamiWebsiteId: "0650b7e5-4c3a-44e4-9af7-b058f1a00a9e",
};

export const THEME_CONFIG = {
  themeColor: "#272822",
  backgroundColor: "#808080",
};

export const PWA_ICONS = [
  { src: "/icons/16.png", sizes: "16x16", type: "image/png" },
  { src: "/icons/32.png", sizes: "32x32", type: "image/png" },
  { src: "/icons/64.png", sizes: "64x64", type: "image/png" },
  { src: "/icons/72.png", sizes: "72x72", type: "image/png" },
  { src: "/icons/android-launchericon-96-96.png", sizes: "96x96", type: "image/png" },
  { src: "/icons/128.png", sizes: "128x128", type: "image/png" },
  { src: "/icons/144.png", sizes: "144x144", type: "image/png" },
  { src: "/icons/152.png", sizes: "152x152", type: "image/png" },
  { src: "/icons/167.png", sizes: "167x167", type: "image/png" },
  { src: "/icons/180.png", sizes: "180x180", type: "image/png" },
  { src: "/icons/192.png", sizes: "192x192", type: "image/png" },
  { src: "/icons/256.png", sizes: "256x256", type: "image/png" },
  { src: "/icons/512.png", sizes: "512x512", type: "image/png" },
  { src: "/icons/512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  { src: "/icons/1024.png", sizes: "1024x1024", type: "image/png" },
];

export const APPLE_TOUCH_ICONS = [
  { href: "/icons/180.png" },
  { href: "/icons/152.png", sizes: "152x152" },
  { href: "/icons/167.png", sizes: "167x167" },
];

export const APPLE_SPLASH_SCREENS = [
  { href: "/icons/SplashScreen.scale-200.png", media: "(max-device-width: 480px)" },
  { href: "/icons/SplashScreen.scale-400.png", media: "(min-device-width: 481px)" },
  { href: "/icons/SplashScreen.scale-100.png" },
];

export const WINDOWS_TILE_ICONS = {
  tileColor: THEME_CONFIG.themeColor,
  tileImage: "/icons/144.png",
  square70: "/icons/SmallTile.scale-100.png",
  square150: "/icons/Square150x150Logo.scale-100.png",
  wide310: "/icons/Wide310x150Logo.scale-100.png",
  square310: "/icons/LargeTile.scale-100.png",
};

export const PWA_CONFIG = {
  name: SITE_CONFIG.title,
  shortName: "G1",
  description: SITE_CONFIG.description,
  scope: "/",
  startUrl: "/",
  display: "standalone",
  orientation: "portrait-primary",
  lang: SITE_CONFIG.lang,
  dir: SITE_CONFIG.dir,
  categories: ["blog", "technology", "development"],
  themeColor: THEME_CONFIG.themeColor,
  backgroundColor: THEME_CONFIG.backgroundColor,
  icons: PWA_ICONS,
};

export const ASSETS = {
  defaultHeroImage: "/placeholder-social.jpg",
  favicon: "/favicon.svg",
};

export const PUBLICATION_INFO = {
  currentIssue: 42,
};

export const SITE_TITLE = SITE_CONFIG.title;
export const SITE_DESCRIPTION = SITE_CONFIG.description;
export const SITE_DATE = new Date().toISOString().split("T")[0];
