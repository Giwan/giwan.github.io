import type { TRouter, TTarget } from '../../types/router.d.ts';

export function getActiveStyle(router: TRouter, styles: { activeLink: string }, target: TTarget): string | undefined {
  const { path, routes } = normalizeTarget(target);

  if (isExactMatch(router.pathname, path)) return styles.activeLink;
  if (isRouteMatch(router.pathname, routes)) return styles.activeLink;

  return undefined;
}

export const getCategoryRoute = (category: string): string =>
  `/tools/${encodeURI(category)}/`;

function normalizeTarget(target: TTarget): { path: string; routes: string[] } {
  if (isString(target)) return { path: target, routes: [] };
  if (isMissingPath(target)) throw Error('The path value is required when the target is an object');
  return { path: target.path, routes: target.routes || [] };
}

const isString = (val: unknown): val is string => typeof val === 'string';
const isMissingPath = (target: { path?: string; routes?: string[] }) => !target.path;

const isExactMatch = (current: string, target: string) => current === target;
const isRouteMatch = (current: string, routes: string[]) =>
  routes.some(route => current.includes(route));
