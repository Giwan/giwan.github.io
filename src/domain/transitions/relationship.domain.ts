import { PageType } from './navigation.domain';

export enum PageRelationship {
  SIBLING = 'sibling',
  PARENT_CHILD = 'parent-child',
  CHILD_PARENT = 'child-parent',
  UNRELATED = 'unrelated',
  CONTEXTUAL = 'contextual'
}

export function analyzePageRelationship(from: PageType, to: PageType): PageRelationship {
  if (from === to) return PageRelationship.SIBLING;
  if (isDrillingDown(from, to)) return PageRelationship.PARENT_CHILD;
  if (isDrillingUp(from, to)) return PageRelationship.CHILD_PARENT;
  if (isContextuallyLinked(from, to)) return PageRelationship.CONTEXTUAL;

  return PageRelationship.UNRELATED;
}

function isDrillingDown(from: PageType, to: PageType): boolean {
  const hierarchies = [
    [PageType.HOME, PageType.BLOG_LIST],
    [PageType.HOME, PageType.TOOLS_LIST],
    [PageType.BLOG_LIST, PageType.BLOG_POST],
    [PageType.TOOLS_LIST, PageType.TOOLS_CATEGORY]
  ];
  return hierarchies.some(([parent, child]) => from === parent && to === child);
}

function isDrillingUp(from: PageType, to: PageType): boolean {
  return isDrillingDown(to, from);
}

function isContextuallyLinked(a: PageType, b: PageType): boolean {
  const contextualSets = [
    new Set([PageType.BLOG_LIST, PageType.SEARCH]),
    new Set([PageType.TOOLS_LIST, PageType.SEARCH]),
    new Set([PageType.HOME, PageType.ABOUT]),
    new Set([PageType.HOME, PageType.CONTACT])
  ];

  return contextualSets.some(set => set.has(a) && set.has(b));
}
