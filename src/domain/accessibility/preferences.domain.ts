export interface AccessibilityPreferences {
  reducedMotion: boolean;
  screenReaderAnnouncements: boolean;
  focusManagement: boolean;
  keyboardNavigation: boolean;
}

export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  reducedMotion: false,
  screenReaderAnnouncements: true,
  focusManagement: true,
  keyboardNavigation: true,
};

export function resolvePreferences(stored: string | null, systemReducedMotion: boolean): AccessibilityPreferences {
  const base = { ...DEFAULT_PREFERENCES, reducedMotion: systemReducedMotion };
  if (!stored) return base;

  try {
    return { ...base, ...JSON.parse(stored) };
  } catch {
    return base;
  }
}
