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

  if (isHome(cleanPath)) return PageType.HOME;
  if (isBlogList(cleanPath)) return PageType.BLOG_LIST;
  if (isBlogPost(cleanPath)) return PageType.BLOG_POST;
  if (isToolsList(cleanPath)) return PageType.TOOLS_LIST;
  if (isToolsCategory(cleanPath)) return PageType.TOOLS_CATEGORY;
  if (isSearch(cleanPath)) return PageType.SEARCH;
  if (isAbout(cleanPath)) return PageType.ABOUT;
  if (isContact(cleanPath)) return PageType.CONTACT;
  if (isOffline(cleanPath)) return PageType.OFFLINE;

  return PageType.UNKNOWN;
}

const isHome = (path: string) => path === '' || path === '/';
const isBlogList = (path: string) => path === '/blog';
const isBlogPost = (path: string) => path.startsWith('/blog/') && path !== '/blog';
const isToolsList = (path: string) => path === '/tools';
const isToolsCategory = (path: string) => path.startsWith('/tools/') && path !== '/tools';
const isSearch = (path: string) => path.startsWith('/search');
const isAbout = (path: string) => path === '/about';
const isContact = (path: string) => path === '/contact';
const isOffline = (path: string) => path === '/offline';

export function detectNavigationDirection(fromPath: string, toPath: string, history: string[]): NavigationDirection {
  if (fromPath === toPath) return NavigationDirection.REFRESH;
  if (isInHistoryBefore(toPath, fromPath, history)) return NavigationDirection.BACKWARD;
  if (matchesBackwardPattern(fromPath, toPath)) return NavigationDirection.BACKWARD;
  return NavigationDirection.FORWARD;
}

function isInHistoryBefore(to: string, from: string, history: string[]): boolean {
  const fromIndex = history.lastIndexOf(from);
  const toIndex = history.lastIndexOf(to);
  return toIndex !== -1 && toIndex < fromIndex;
}

function matchesBackwardPattern(from: string, to: string): boolean {
  if (from.includes(to) && from !== to) return true;
  if (isDrillingUp(from, to)) return true;

  const patterns = [
    { from: /^\/blog\/[\w-]+/, to: /^\/blog\/?$/ },
    { from: /^\/tools\/[\w-]+/, to: /^\/tools\/?$/ },
    { from: /^\/search\/results/, to: /^\/search\/?$/ }
  ];

  return patterns.some(p => p.from.test(from) && p.to.test(to));
}

const isDrillingUp = (from: string, to: string) =>
  from.startsWith(to) && from.split('/').length > to.split('/').length;
