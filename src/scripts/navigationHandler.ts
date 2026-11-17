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

/**
 * Cmd/Ctrl + K jumps to search, matching the shortcut advertised in the header.
 */
export function initializeSearchShortcut(): void {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            window.location.assign("/search/");
        }
    });
}

// Auto-initialize when script loads
initializeNavigationHandler();
initializeSearchShortcut();