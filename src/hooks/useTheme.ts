import { useState, useEffect } from 'react';
import isServer from "../utils/helpers/isServer";

export type Theme = 'light' | 'dark' | 'system';
export type ThemeLimited = Exclude<Theme, 'system'>;

// Constants to minimize string repetition
const THEME_VALUES = {
  LIGHT: 'light' as const,
  DARK: 'dark' as const,
  SYSTEM: 'system' as const,
} as const;

const STORAGE_KEY = 'theme';
const DATA_THEME_ATTR = 'data-theme';
const DATA_TRANSITION_ATTR = 'data-transition-direction';
const DARK_CLASS = 'dark';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

// Import transition controller for coordination
let transitionController: any = null;
if (!isServer()) {
  import('../utils/transitionController').then(module => {
    transitionController = module.transitionController;
  });
}

export const useTheme = () => {
  // Initialize with the current theme from DOM to prevent hydration mismatch
  const getInitialTheme = (): Theme => {
    if (isServer()) return THEME_VALUES.SYSTEM;
    
    const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme;
    if (storedTheme && [THEME_VALUES.LIGHT, THEME_VALUES.DARK, THEME_VALUES.SYSTEM].includes(storedTheme)) {
      return storedTheme;
    }
    return THEME_VALUES.SYSTEM;
  };

  const getInitialResolvedTheme = (): ThemeLimited => {
    if (isServer()) return THEME_VALUES.LIGHT;
    
    const root = document.documentElement;
    return root.classList.contains(DARK_CLASS) || root.getAttribute(DATA_THEME_ATTR) === THEME_VALUES.DARK ? THEME_VALUES.DARK : THEME_VALUES.LIGHT;
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ThemeLimited>(getInitialResolvedTheme);

  // No need for initial effect since we initialize state correctly

  useEffect(() => {
    const updateTheme = () => {
      const root = document.documentElement;
      
      let effectiveTheme: ThemeLimited;
      
      if (theme === THEME_VALUES.SYSTEM) {
        effectiveTheme = window.matchMedia(MEDIA_QUERY).matches ? THEME_VALUES.DARK : THEME_VALUES.LIGHT;
      } else {
        effectiveTheme = theme;
      }

      setResolvedTheme(effectiveTheme);

      // Update DOM with view transition support
      const updateDOMWithTransition = () => {
        if (effectiveTheme === THEME_VALUES.DARK) {
          root.classList.add(DARK_CLASS);
          root.setAttribute(DATA_THEME_ATTR, THEME_VALUES.DARK);
        } else {
          root.classList.remove(DARK_CLASS);
          root.setAttribute(DATA_THEME_ATTR, THEME_VALUES.LIGHT);
        }
      };

      // Check if a page transition is in progress
      const isPageTransitioning = document.documentElement.hasAttribute(DATA_TRANSITION_ATTR);
      
      // Use view transition API if available and supported, but coordinate with page transitions
      if (typeof document !== 'undefined' && 'startViewTransition' in document && !isPageTransitioning) {
        try {
          (document as any).startViewTransition(() => updateDOMWithTransition());
        } catch (error) {
          console.warn('View transition failed, using fallback:', error);
          updateDOMWithTransition();
        }
      } else if (isPageTransitioning) {
        // If page transition is in progress, apply theme change without view transition
        // to avoid conflicts
        updateDOMWithTransition();
      } else {
        updateDOMWithTransition();
      }

      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, theme);
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia(MEDIA_QUERY);
    const handleSystemThemeChange = () => (theme === THEME_VALUES.SYSTEM) && updateTheme();

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      switch (prevTheme) {
        case THEME_VALUES.LIGHT:
          return THEME_VALUES.DARK;
        case THEME_VALUES.DARK:
          return THEME_VALUES.SYSTEM;
        case THEME_VALUES.SYSTEM:
          return THEME_VALUES.LIGHT;
        default:
          return THEME_VALUES.LIGHT;
      }
    });
  };

  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme: setThemeValue,
  };
};