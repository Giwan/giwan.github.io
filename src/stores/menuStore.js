import { atom } from 'nanostores';

// Create an atom to track if the mobile menu is open
export const isMobileMenuOpen = atom(false);

// Helper functions to manipulate the store
export function openMobileMenu() {
  isMobileMenuOpen.set(true);
}

export function closeMobileMenu() {
  isMobileMenuOpen.set(false);
}

export function toggleMobileMenu() {
  isMobileMenuOpen.set(!isMobileMenuOpen.get());
}