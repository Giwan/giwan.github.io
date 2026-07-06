import { calculateTransitionAttributes } from '../attribute.domain';
import { PageType, NavigationDirection } from '../navigation.domain';
import { PageRelationship } from '../relationship.domain';

describe('Transition Attribute Domain', () => {
  const mockContext = {
    from: '/', to: '/blog',
    fromPageType: PageType.HOME,
    toPageType: PageType.BLOG_LIST,
    direction: NavigationDirection.FORWARD,
    relationship: PageRelationship.PARENT_CHILD,
    timestamp: Date.now()
  };

  it('generates correct data attributes', () => {
    const blueprint = calculateTransitionAttributes(mockContext, false, false);

    expect(blueprint.attributes['data-transition-direction']).toBe('forward');
    expect(blueprint.attributes['data-transition-relationship']).toBe('parent-child');
    expect(blueprint.attributes['data-reduced-motion']).toBe('false');
    expect(blueprint.attributes['data-low-power']).toBe('false');
  });

  it('respects reduced motion and low power flags', () => {
    const blueprint = calculateTransitionAttributes(mockContext, true, true);
    expect(blueprint.attributes['data-reduced-motion']).toBe('true');
    expect(blueprint.attributes['data-low-power']).toBe('true');
  });
});
