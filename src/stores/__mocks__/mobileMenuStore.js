// Mock for mobileMenuStore.js
export const $isMobileMenuOpen = {
    get: jest.fn(() => false),
    set: jest.fn(),
    subscribe: jest.fn(),
};

export const openMobileMenu = jest.fn();
export const closeMobileMenu = jest.fn();
export const toggleMobileMenu = jest.fn();
