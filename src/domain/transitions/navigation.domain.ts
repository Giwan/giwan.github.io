export enum PageType {
  HOME = 'home',
  BLOG_LIST = 'blog-list',
  BLOG_POST = 'blog-post',
  TOOLS_LIST = 'tools-list',
  TOOLS_CATEGORY = 'tools-category',
  SEARCH = 'search',
  ABOUT = 'about',
  CONTACT = 'contact',
  OFFLINE = 'offline',
  UNKNOWN = 'unknown'
}

export enum NavigationDirection {
  FORWARD = 'forward',
  BACKWARD = 'backward',
  REFRESH = 'refresh'
}

export function classifyPageType(path: string): PageType {
  const cleanPath = path.replace(/\/$/, '') || '/';
  const pageMap: Record<string, PageType> = {
    '/': PageType.HOME,
    '/blog': PageType.BLOG_LIST,
    '/tools': PageType.TOOLS_LIST,
    '/about': PageType.ABOUT,
    '/contact': PageType.CONTACT,
    '/offline': PageType.OFFLINE,
  };

  if (pageMap[cleanPath]) return pageMap[cleanPath];
  return classifyDynamicRoute(cleanPath);
}

function classifyDynamicRoute(path: string): PageType {
  if (path.startsWith('/blog/')) return PageType.BLOG_POST;
  if (path.startsWith('/tools/')) return PageType.TOOLS_CATEGORY;
  if (path.startsWith('/search')) return PageType.SEARCH;
  return PageType.UNKNOWN;
}

export function detectNavigationDirection(fromPath: string, toPath: string, history: string[]): NavigationDirection {
  if (fromPath === toPath) return NavigationDirection.REFRESH;
  if (isReturningBack(fromPath, toPath, history)) return NavigationDirection.BACKWARD;
  return NavigationDirection.FORWARD;
}

function isReturningBack(from: string, to: string, history: string[]): boolean {
  return isInHistoryBefore(to, from, history) || matchesBackwardPattern(from, to);
}

function isInHistoryBefore(to: string, from: string, history: string[]): boolean {
  const fromIndex = history.lastIndexOf(from);
  const toIndex = history.lastIndexOf(to);
  return toIndex !== -1 && toIndex < fromIndex;
}

function matchesBackwardPattern(from: string, to: string): boolean {
  if (isDrillingUp(from, to)) return true;
  return matchesBreadcrumbReduction(from, to);
}

function isDrillingUp(from: string, to: string): boolean {
  return from.startsWith(to) && from.length > to.length && from.split('/').length > to.split('/').length;
}

function matchesBreadcrumbReduction(from: string, to: string): boolean {
  const patterns = [
    { from: /^\/blog\/.+/, to: /^\/blog$/ },
    { from: /^\/tools\/.+/, to: /^\/tools$/ },
    { from: /^\/search\/.+/, to: /^\/search$/ }
  ];
  return patterns.some(p => p.from.test(from) && p.to.test(to));
}
