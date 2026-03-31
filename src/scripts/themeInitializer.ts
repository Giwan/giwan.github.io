/**
 * Theme initialization script
 * Handles initial theme setup based on user preferences and system settings
 */

type TDarkLight = 'dark' | 'light';

// Constants to minimize string repetition
const THEME_VALUES = {
    DARK: 'dark' as const,
    LIGHT: 'light' as const,
    SYSTEM: 'system' as const,
} as const;

const STORAGE_KEY = 'theme';
const DATA_THEME_ATTR = 'data-theme';
const DARK_CLASS = 'dark';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

function getSystemTheme(): TDarkLight {
    return window.matchMedia(MEDIA_QUERY).matches ? THEME_VALUES.DARK : THEME_VALUES.LIGHT;
}

function getInitialTheme(): TDarkLight {
    const persistedTheme = localStorage.getItem(STORAGE_KEY);
    
    if (persistedTheme === THEME_VALUES.SYSTEM || !persistedTheme) {
        return getSystemTheme();
    }
    
    return persistedTheme as TDarkLight;
}

function applyTheme(theme: TDarkLight): void {
    const root = document.documentElement;
    
    if (theme === THEME_VALUES.DARK) {
        root.classList.add(DARK_CLASS);
        root.setAttribute(DATA_THEME_ATTR, THEME_VALUES.DARK);
    } else {
        root.classList.remove(DARK_CLASS);
        root.setAttribute(DATA_THEME_ATTR, THEME_VALUES.LIGHT);
    }
}

export function initializeTheme(): void {
    const theme = getInitialTheme();
    applyTheme(theme);
}

// Auto-initialize when script loads
initializeTheme();