import { getTransitionContextName, estimateTransitionDuration } from '../optimization.domain';
import { NavigationDirection } from '../navigation.domain';
import { PageRelationship } from '../relationship.domain';

describe('Transition Optimization Domain', () => {
  describe('Context Naming', () => {
    it('returns backward for backward direction', () => {
      expect(getTransitionContextName(NavigationDirection.BACKWARD, PageRelationship.SIBLING)).toBe('backward');
    });

    it('returns drill-down for parent-child relationship', () => {
      expect(getTransitionContextName(NavigationDirection.FORWARD, PageRelationship.PARENT_CHILD)).toBe('drill-down');
    });

    it('returns sibling for sibling relationship', () => {
      expect(getTransitionContextName(NavigationDirection.FORWARD, PageRelationship.SIBLING)).toBe('sibling');
    });
  });

  describe('Duration Estimation', () => {
    it('applies power mode adjustments', () => {
      const normal = estimateTransitionDuration(PageRelationship.UNRELATED, false);
      const lowPower = estimateTransitionDuration(PageRelationship.UNRELATED, true);
      expect(lowPower).toBeLessThan(normal);
    });

    it('applies relationship multipliers', () => {
      const base = estimateTransitionDuration(PageRelationship.UNRELATED, false);
      const sibling = estimateTransitionDuration(PageRelationship.SIBLING, false);
      const drill = estimateTransitionDuration(PageRelationship.PARENT_CHILD, false);

      expect(sibling).toBeLessThan(base);
      expect(drill).toBeGreaterThan(base);
    });
  });
});
