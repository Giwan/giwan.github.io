/**
 * Accessibility initialization script
 * Handles initial accessibility setup and enhancements
 */

function setupFocusManagement(): void {
    // Add focus-visible polyfill behavior for better keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

function setupSkipLinks(): void {
    // Ensure skip links are properly positioned when focused
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    skipLinks.forEach(link => {
        link.addEventListener('focus', () => {
            link.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
}

export function initializeAccessibility(): void {
    setupFocusManagement();
    setupSkipLinks();
}

// Auto-initialize when script loads
initializeAccessibility();