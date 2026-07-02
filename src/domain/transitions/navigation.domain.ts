import { isDefined, isNot } from '../common/logic.domain';

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
  const directMatch = matchDirectRoute(cleanPath);
  return isDefined(directMatch) ? directMatch : classifyDynamicRoute(cleanPath);
}

function matchDirectRoute(path: string): PageType | undefined {
  const routes: Record<string, PageType> = {
    '/': PageType.HOME,
    '/blog': PageType.BLOG_LIST,
    '/tools': PageType.TOOLS_LIST,
    '/about': PageType.ABOUT,
    '/contact': PageType.CONTACT,
    '/offline': PageType.OFFLINE,
  };
  return routes[path];
}

function classifyDynamicRoute(path: string): PageType {
  if (path.startsWith('/blog/')) return PageType.BLOG_POST;
  if (path.startsWith('/tools/')) return PageType.TOOLS_CATEGORY;
  if (path.startsWith('/search')) return PageType.SEARCH;
  return PageType.UNKNOWN;
}

export function detectNavigationDirection(fromPath: string, toPath: string, history: string[]): NavigationDirection {
  if (fromPath === toPath) return NavigationDirection.REFRESH;
  return isReturningBack(fromPath, toPath, history)
    ? NavigationDirection.BACKWARD
    : NavigationDirection.FORWARD;
}

const isReturningBack = (from: string, to: string, history: string[]): boolean =>
  isInHistoryBefore(to, from, history) || matchesBackwardPattern(from, to);

function isInHistoryBefore(to: string, from: string, history: string[]): boolean {
  const fromIndex = history.lastIndexOf(from);
  const toIndex = history.lastIndexOf(to);
  return isDefinedInHistory(toIndex) && isReturningToIndex(toIndex, fromIndex);
}

const isDefinedInHistory = (index: number) => index !== -1;
const isReturningToIndex = (to: number, from: number) => to < from;

const matchesBackwardPattern = (from: string, to: string): boolean =>
  isDrillingUp(from, to) || matchesBreadcrumbReduction(from, to);

function isDrillingUp(from: string, to: string): boolean {
  return from.startsWith(to) &&
         isLonger(from, to) &&
         isDeeper(from, to);
}

const isLonger = (a: string, b: string) => a.length > b.length;
const isDeeper = (a: string, b: string) => a.split('/').length > b.split('/').length;

function matchesBreadcrumbReduction(from: string, to: string): boolean {
  const patterns = [
    { from: /^\/blog\/.+/, to: /^\/blog$/ },
    { from: /^\/tools\/.+/, to: /^\/tools$/ },
    { from: /^\/search\/.+/, to: /^\/search$/ }
  ];
  return patterns.some(p => p.from.test(from) && p.to.test(to));
}
