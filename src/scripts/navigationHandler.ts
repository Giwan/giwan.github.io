/**
 * PWA Article Navigation Scroll Handler
 * Handles scroll behavior for article navigation
 */

import { isBlogPage, restoreToScrollPosition } from "@/components/articleDataHandler.mjs";

export function initializeNavigationHandler(): void {
    // Override Astro's default scroll behavior for article navigation
    document.addEventListener("astro:after-swap", () => {
        // Check if we navigated to a blog article
        // Ensure we scroll to the very top of the shell (including header)
        if (isBlogPage()) restoreToScrollPosition(0, 50);
    });
}

// Auto-initialize when script loads
initializeNavigationHandler();