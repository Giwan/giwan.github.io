import {
  classifyPageType,
  detectNavigationDirection,
  PageType,
  NavigationDirection
} from './navigation.domain';
import {
  analyzePageRelationship,
  PageRelationship
} from './relationship.domain';

export interface NavigationContext {
  direction: NavigationDirection;
  fromPageType: PageType;
  toPageType: PageType;
  relationship: PageRelationship;
  fromPath: string;
  toPath: string;
  timestamp: number;
}

export function createNavigationContext(fromPath: string, toPath: string, history: string[]): NavigationContext {
  const fromPageType = classifyPageType(fromPath);
  const toPageType = classifyPageType(toPath);

  return {
    direction: detectNavigationDirection(fromPath, toPath, history),
    fromPageType,
    toPageType,
    relationship: analyzePageRelationship(fromPageType, toPageType),
    fromPath,
    toPath,
    timestamp: Date.now()
  };
}
