import { NavigationDirection } from './navigation.domain';
import { PageRelationship } from './relationship.domain';

export function getTransitionContextName(direction: NavigationDirection, relationship: PageRelationship): string {
  if (direction === NavigationDirection.BACKWARD) return 'backward';

  const names: Record<string, string> = {
    [PageRelationship.PARENT_CHILD]: 'drill-down',
    [PageRelationship.CHILD_PARENT]: 'drill-up',
    [PageRelationship.SIBLING]: 'sibling',
    [PageRelationship.CONTEXTUAL]: 'contextual'
  };

  return names[relationship] || 'forward';
}

export function estimateTransitionDuration(
  relationship: PageRelationship,
  isLowPowerMode: boolean
): number {
  const baseDuration = 300;
  const powerAdjusted = isLowPowerMode ? baseDuration * 0.7 : baseDuration;
  return applyRelationshipMultiplier(powerAdjusted, relationship);
}

function applyRelationshipMultiplier(duration: number, relationship: PageRelationship): number {
  if (relationship === PageRelationship.SIBLING) return duration * 0.8;
  if (relationship === PageRelationship.PARENT_CHILD) return duration * 1.2;
  if (relationship === PageRelationship.CHILD_PARENT) return duration * 1.2;
  return duration;
}
