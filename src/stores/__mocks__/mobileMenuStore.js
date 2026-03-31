// Mock for mobileMenuStore.js
const $isMobileMenuOpen = {
  get: jest.fn(() => false),
  set: jest.fn(),
  subscribe: jest.fn()
};

const openMobileMenu = jest.fn();
const closeMobileMenu = jest.fn();
const toggleMobileMenu = jest.fn();

module.exports = {
  $isMobileMenuOpen,
  openMobileMenu,
  closeMobileMenu,
  toggleMobileMenu
};