import * as articleDomain from '../../blog/article.domain';
import * as announcementsDomain from '../../accessibility/announcements.domain';
import * as focusDomain from '../../accessibility/focus.domain';
import * as preferencesDomain from '../../accessibility/preferences.domain';
import * as contextDomain from '../../transitions/context.domain';
import * as navigationDomain from '../../transitions/navigation.domain';
import * as optimizationDomain from '../../transitions/optimization.domain';
import * as relationshipDomain from '../../transitions/relationship.domain';
import * as dateUtils from '../date.domain';
import * as routerUtils from '../router.domain';

describe('Domain Module Integrity', () => {
  test('blog/article.domain exports expected functions', () => {
    expect(articleDomain.getArticleSlice).toBeDefined();
    expect(articleDomain.hasMoreArticles).toBeDefined();
  });

  test('accessibility/announcements.domain exports expected functions', () => {
    expect(announcementsDomain.getFriendlyPageTitle).toBeDefined();
    expect(announcementsDomain.formatNavigationAnnouncement).toBeDefined();
  });

  test('accessibility/focus.domain exports expected functions', () => {
    expect(focusDomain.findFirstFocusable).toBeDefined();
    expect(focusDomain.getSkipTargetName).toBeDefined();
  });

  test('accessibility/preferences.domain exports expected functions', () => {
    expect(preferencesDomain.resolvePreferences).toBeDefined();
  });

  test('transitions/context.domain exports expected functions', () => {
    expect(contextDomain.createNavigationContext).toBeDefined();
  });

  test('transitions/navigation.domain exports expected functions', () => {
    expect(navigationDomain.detectNavigationDirection).toBeDefined();
    expect(navigationDomain.classifyPageType).toBeDefined();
  });

  test('transitions/optimization.domain exports expected functions', () => {
    expect(optimizationDomain.getTransitionContextName).toBeDefined();
    expect(optimizationDomain.estimateTransitionDuration).toBeDefined();
  });

  test('transitions/relationship.domain exports expected functions', () => {
    expect(relationshipDomain.analyzePageRelationship).toBeDefined();
  });

  test('common/date.domain exports expected functions', () => {
    expect(dateUtils.formatDate).toBeDefined();
  });

  test('common/router.domain exports expected functions', () => {
    expect(routerUtils.getActiveStyle).toBeDefined();
  });
});
