import { resolvePreferences, DEFAULT_PREFERENCES } from '../preferences.domain';

describe('Accessibility Preferences Domain', () => {
  it('returns default preferences when no storage exists', () => {
    const prefs = resolvePreferences(null, false);
    expect(prefs).toEqual({ ...DEFAULT_PREFERENCES, reducedMotion: false });
  });

  it('merges stored preferences with defaults', () => {
    const stored = JSON.stringify({ focusManagement: false });
    const prefs = resolvePreferences(stored, false);
    expect(prefs.focusManagement).toBe(false);
    expect(prefs.screenReaderAnnouncements).toBe(true);
  });

  it('overrides reduced motion with system setting', () => {
    const prefs = resolvePreferences(null, true);
    expect(prefs.reducedMotion).toBe(true);
  });

  it('handles corrupted storage gracefully', () => {
    const prefs = resolvePreferences('invalid-json', false);
    expect(prefs).toEqual(DEFAULT_PREFERENCES);
  });
});
