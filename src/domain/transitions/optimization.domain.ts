import { NavigationDirection } from './navigation.domain';
import { PageRelationship } from './relationship.domain';
import { isTrue } from '../common/logic.domain';

export function getTransitionContextName(direction: NavigationDirection, relationship: PageRelationship): string {
  if (isBackward(direction)) return 'backward';

  const contextMap: Record<string, string> = {
    [PageRelationship.PARENT_CHILD]: 'drill-down',
    [PageRelationship.CHILD_PARENT]: 'drill-up',
    [PageRelationship.SIBLING]: 'sibling',
    [PageRelationship.CONTEXTUAL]: 'contextual'
  };

  return contextMap[relationship] || 'forward';
}

const isBackward = (dir: NavigationDirection) => dir === NavigationDirection.BACKWARD;

export function estimateTransitionDuration(
  relationship: PageRelationship,
  isLowPowerMode: boolean
): number {
  const base = 300;
  const powerAdjusted = isTrue(isLowPowerMode) ? base * 0.7 : base;
  return applyMultiplier(powerAdjusted, relationship);
}

function applyMultiplier(duration: number, relationship: PageRelationship): number {
  if (isSibling(relationship)) return duration * 0.8;
  if (isDrill(relationship)) return duration * 1.2;
  return duration;
}

const isSibling = (rel: PageRelationship) => rel === PageRelationship.SIBLING;
const isDrill = (rel: PageRelationship) =>
  rel === PageRelationship.PARENT_CHILD || rel === PageRelationship.CHILD_PARENT;
