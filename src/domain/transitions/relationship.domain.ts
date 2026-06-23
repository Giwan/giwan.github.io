import { PageType } from './navigation.domain';

export enum PageRelationship {
  SIBLING = 'sibling',
  PARENT_CHILD = 'parent-child',
  CHILD_PARENT = 'child-parent',
  UNRELATED = 'unrelated',
  CONTEXTUAL = 'contextual'
}

export function analyzePageRelationship(fromType: PageType, toType: PageType): PageRelationship {
  if (fromType === toType) return PageRelationship.SIBLING;
  if (isParentToChild(fromType, toType)) return PageRelationship.PARENT_CHILD;
  if (isParentToChild(toType, fromType)) return PageRelationship.CHILD_PARENT;
  if (isContextuallyRelated(fromType, toType)) return PageRelationship.CONTEXTUAL;

  return PageRelationship.UNRELATED;
}

function isParentToChild(parent: PageType, child: PageType): boolean {
  const pairs = [
    [PageType.BLOG_LIST, PageType.BLOG_POST],
    [PageType.TOOLS_LIST, PageType.TOOLS_CATEGORY],
    [PageType.HOME, PageType.BLOG_LIST],
    [PageType.HOME, PageType.TOOLS_LIST]
  ];
  return pairs.some(([p, c]) => p === parent && c === child);
}

function isContextuallyRelated(type1: PageType, type2: PageType): boolean {
  const contextualPairs = [
    [PageType.BLOG_LIST, PageType.SEARCH],
    [PageType.TOOLS_LIST, PageType.SEARCH],
    [PageType.HOME, PageType.ABOUT],
    [PageType.HOME, PageType.CONTACT]
  ];

  return contextualPairs.some(([p1, p2]) =>
    (type1 === p1 && type2 === p2) || (type1 === p2 && type2 === p1)
  );
}
