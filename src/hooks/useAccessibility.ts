/**
 * React hook for managing accessibility preferences and features
 */

import { useState, useEffect, useCallback } from 'react';
import { accessibilityManager, AccessibilityPreferences, NavigationAnnouncement } from '../utils/accessibilityManager';

export interface UseAccessibilityReturn {
  preferences: AccessibilityPreferences;
  updatePreferences: (newPreferences: Partial<AccessibilityPreferences>) => void;
  announce: (announcement: NavigationAnnouncement) => void;
  isReducedMotion: boolean;
  toggleReducedMotion: () => void;
  toggleScreenReaderAnnouncements: () => void;
  toggleFocusManagement: () => void;
  toggleKeyboardNavigation: () => void;
}

export const useAccessibility = (): UseAccessibilityReturn => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(
    accessibilityManager.getPreferences()
  );

  // Update local state when preferences change
  useEffect(() => {
    const updatePreferences = () => {
      setPreferences(accessibilityManager.getPreferences());
    };

    // Listen for system reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', updatePreferences);

    return () => {
      mediaQuery.removeEventListener('change', updatePreferences);
    };
  }, []);

  /**
   * Update accessibility preferences
   */
  const updatePreferences = useCallback((newPreferences: Partial<AccessibilityPreferences>) => {
    accessibilityManager.updatePreferences(newPreferences);
    setPreferences(accessibilityManager.getPreferences());
  }, []);

  /**
   * Announce message to screen readers
   */
  const announce = useCallback((announcement: NavigationAnnouncement) => {
    accessibilityManager.announce(announcement);
  }, []);

  /**
   * Toggle reduced motion preference
   */
  const toggleReducedMotion = useCallback(() => {
    updatePreferences({ reducedMotion: !preferences.reducedMotion });
  }, [preferences.reducedMotion, updatePreferences]);

  /**
   * Toggle screen reader announcements
   */
  const toggleScreenReaderAnnouncements = useCallback(() => {
    updatePreferences({ screenReaderAnnouncements: !preferences.screenReaderAnnouncements });
  }, [preferences.screenReaderAnnouncements, updatePreferences]);

  /**
   * Toggle focus management
   */
  const toggleFocusManagement = useCallback(() => {
    updatePreferences({ focusManagement: !preferences.focusManagement });
  }, [preferences.focusManagement, updatePreferences]);

  /**
   * Toggle keyboard navigation enhancements
   */
  const toggleKeyboardNavigation = useCallback(() => {
    updatePreferences({ keyboardNavigation: !preferences.keyboardNavigation });
  }, [preferences.keyboardNavigation, updatePreferences]);

  return {
    preferences,
    updatePreferences,
    announce,
    isReducedMotion: preferences.reducedMotion,
    toggleReducedMotion,
    toggleScreenReaderAnnouncements,
    toggleFocusManagement,
    toggleKeyboardNavigation,
  };
};