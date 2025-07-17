import { atom } from 'nanostores';

// Store for mobile menu open/closed state
export const $isMobileMenuOpen = atom(false);

// Actions to control the menu
export const openMobileMenu = () => $isMobileMenuOpen.set(true);
export const closeMobileMenu = () => $isMobileMenuOpen.set(false);
export const toggleMobileMenu = () => $isMobileMenuOpen.set(!$isMobileMenuOpen.get());