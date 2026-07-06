import { identifyIntent, UserIntent } from '../shortcuts.domain';

describe('Accessibility Shortcuts Domain', () => {
  it('identifies skip to content intent', () => {
    const event = { ctrlKey: true, metaKey: false, altKey: false, key: '/' };
    expect(identifyIntent(event)).toBe(UserIntent.SKIP_TO_CONTENT);
  });

  it('identifies navigation intents', () => {
    expect(identifyIntent({ ctrlKey: false, metaKey: false, altKey: true, key: 'ArrowLeft' })).toBe(UserIntent.GO_BACK);
    expect(identifyIntent({ ctrlKey: false, metaKey: false, altKey: true, key: 'ArrowRight' })).toBe(UserIntent.GO_FORWARD);
  });

  it('identifies search intent', () => {
    expect(identifyIntent({ ctrlKey: true, metaKey: false, altKey: false, key: 'k' })).toBe(UserIntent.FOCUS_SEARCH);
    expect(identifyIntent({ ctrlKey: false, metaKey: true, altKey: false, key: 'k' })).toBe(UserIntent.FOCUS_SEARCH);
  });

  it('returns none for unknown shortcuts', () => {
    expect(identifyIntent({ ctrlKey: false, metaKey: false, altKey: false, key: 'a' })).toBe(UserIntent.NONE);
  });
});
