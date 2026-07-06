export function formatNavigationAnnouncement(fromTitle: string, toTitle: string): string {
  return `Navigating from ${fromTitle} to ${toTitle}`;
}

export function formatLoadAnnouncement(pageTitle: string): string {
  return `${pageTitle} loaded`;
}

export function formatSkipAnnouncement(targetName: string): string {
  return `Skipped to ${targetName}`;
}

export function getFriendlyPageTitle(path: string): string {
  const titles: Record<string, string> = {
    '/': 'Home',
    '/blog': 'Blog',
    '/tools': 'Tools',
    '/about': 'About',
    '/contact': 'Contact',
    '/search': 'Search',
    '/offline': 'Offline',
  };

  if (titles[path]) return titles[path];
  if (path.startsWith('/blog/')) return 'Blog Article';
  if (path.startsWith('/tools/')) return 'Tools Category';

  return 'Page';
}
