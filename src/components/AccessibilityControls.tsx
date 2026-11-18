/**
 * Accessibility Controls Component
 *
 * Provides user interface for managing accessibility preferences
 * including reduced motion, screen reader announcements, and focus management.
 *
 * Uses a native <dialog> (showModal) so it gets a focus trap, Escape-to-close,
 * a ::backdrop, and automatic focus return to the trigger — for free.
 */

import React, { useRef, useState } from 'react';
import { Settings, Eye, EyeOff, Keyboard, Volume2, VolumeX, Zap, ZapOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/hooks/useAccessibility';

export const AccessibilityControls: React.FC = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const {
    preferences,
    toggleReducedMotion,
    toggleScreenReaderAnnouncements,
    toggleFocusManagement,
    toggleKeyboardNavigation,
    announce
  } = useAccessibility();

  const openPanel = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    // showModal is unsupported in jsdom (and very old browsers); fall back to
    // the non-modal `open` attribute there.
    if (typeof dialog.showModal === 'function') {
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute('open', '');
      }
    } else {
      dialog.setAttribute('open', '');
    }
    setIsOpen(true);
    announce({ message: 'Accessibility settings opened', priority: 'polite' });
  };

  const closePanel = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close(); // fires the `close` event → handleDialogClose
      return;
    }
    dialog.removeAttribute('open');
    handleDialogClose();
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    announce({ message: 'Accessibility settings closed', priority: 'polite' });
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    // The dialog itself has no padding, so clicks landing on it are the backdrop.
    if (event.target === dialogRef.current) closePanel();
  };

  const handleTogglePanel = () => (isOpen ? closePanel() : openPanel());

  const handleReducedMotionToggle = () => {
    toggleReducedMotion();
    announce({
      message: `Reduced motion ${!preferences.reducedMotion ? 'enabled' : 'disabled'}`,
      priority: 'polite'
    });
  };

  const handleScreenReaderToggle = () => {
    toggleScreenReaderAnnouncements();
    announce({
      message: `Screen reader announcements ${!preferences.screenReaderAnnouncements ? 'enabled' : 'disabled'}`,
      priority: 'polite'
    });
  };

  const handleFocusManagementToggle = () => {
    toggleFocusManagement();
    announce({
      message: `Focus management ${!preferences.focusManagement ? 'enabled' : 'disabled'}`,
      priority: 'polite'
    });
  };

  const handleKeyboardNavigationToggle = () => {
    toggleKeyboardNavigation();
    announce({
      message: `Keyboard navigation enhancements ${!preferences.keyboardNavigation ? 'enabled' : 'disabled'}`,
      priority: 'polite'
    });
  };

  return (
    <div className="inline-block">
      {/* Trigger */}
      <button
        type="button"
        onClick={handleTogglePanel}
        className="focus-editorial inline-flex h-10 items-center gap-2 rounded-none border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-editorial hover:text-editorial"
        aria-label="Open accessibility settings"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Settings className="h-4 w-4" aria-hidden="true" />
        <span>Accessibility</span>
      </button>

      {/* Modal */}
      <dialog
        ref={dialogRef}
        id="accessibility-controls-panel"
        onClose={handleDialogClose}
        onClick={handleBackdropClick}
        aria-labelledby="accessibility-controls-title"
        aria-describedby="accessibility-controls-description"
        className="m-auto max-h-[85vh] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-none border border-border bg-background p-0 text-foreground shadow-xl backdrop:bg-black/50"
      >
        {/* Rendered only once open so server/client preference state can't mismatch */}
        {isOpen && (
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 id="accessibility-controls-title" className="text-lg font-semibold text-foreground">
              Accessibility Settings
            </h2>
            <Button
              onClick={closePanel}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label="Close accessibility settings"
            >
              ×
            </Button>
          </div>

          <p id="accessibility-controls-description" className="text-sm text-muted-foreground">
            Customize your accessibility preferences for a better browsing experience.
          </p>

          <div className="space-y-3">
            {/* Reduced Motion Control */}
            <div className="flex items-center justify-between rounded-none border border-border p-3 transition-colors hover:bg-accent/50">
              <div className="flex items-center space-x-3">
                {preferences.reducedMotion ? (
                  <ZapOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Zap className="h-5 w-5 text-primary" />
                )}
                <div>
                  <div className="font-medium text-foreground">Reduced Motion</div>
                  <div className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </div>
                </div>
              </div>
              <Button
                onClick={handleReducedMotionToggle}
                variant={preferences.reducedMotion ? "default" : "outline"}
                size="sm"
                aria-label={`${preferences.reducedMotion ? 'Disable' : 'Enable'} reduced motion`}
                aria-pressed={preferences.reducedMotion}
              >
                {preferences.reducedMotion ? 'On' : 'Off'}
              </Button>
            </div>

            {/* Screen Reader Announcements Control */}
            <div className="flex items-center justify-between rounded-none border border-border p-3 transition-colors hover:bg-accent/50">
              <div className="flex items-center space-x-3">
                {preferences.screenReaderAnnouncements ? (
                  <Volume2 className="h-5 w-5 text-primary" />
                ) : (
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <div className="font-medium text-foreground">Screen Reader Announcements</div>
                  <div className="text-sm text-muted-foreground">
                    Announce page changes and navigation
                  </div>
                </div>
              </div>
              <Button
                onClick={handleScreenReaderToggle}
                variant={preferences.screenReaderAnnouncements ? "default" : "outline"}
                size="sm"
                aria-label={`${preferences.screenReaderAnnouncements ? 'Disable' : 'Enable'} screen reader announcements`}
                aria-pressed={preferences.screenReaderAnnouncements}
              >
                {preferences.screenReaderAnnouncements ? 'On' : 'Off'}
              </Button>
            </div>

            {/* Focus Management Control */}
            <div className="flex items-center justify-between rounded-none border border-border p-3 transition-colors hover:bg-accent/50">
              <div className="flex items-center space-x-3">
                {preferences.focusManagement ? (
                  <Eye className="h-5 w-5 text-primary" />
                ) : (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <div className="font-medium text-foreground">Focus Management</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically manage focus during navigation
                  </div>
                </div>
              </div>
              <Button
                onClick={handleFocusManagementToggle}
                variant={preferences.focusManagement ? "default" : "outline"}
                size="sm"
                aria-label={`${preferences.focusManagement ? 'Disable' : 'Enable'} focus management`}
                aria-pressed={preferences.focusManagement}
              >
                {preferences.focusManagement ? 'On' : 'Off'}
              </Button>
            </div>

            {/* Keyboard Navigation Control */}
            <div className="flex items-center justify-between rounded-none border border-border p-3 transition-colors hover:bg-accent/50">
              <div className="flex items-center space-x-3">
                <Keyboard className={`h-5 w-5 ${preferences.keyboardNavigation ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <div className="font-medium text-foreground">Keyboard Navigation</div>
                  <div className="text-sm text-muted-foreground">
                    Enhanced keyboard shortcuts and navigation
                  </div>
                </div>
              </div>
              <Button
                onClick={handleKeyboardNavigationToggle}
                variant={preferences.keyboardNavigation ? "default" : "outline"}
                size="sm"
                aria-label={`${preferences.keyboardNavigation ? 'Disable' : 'Enable'} keyboard navigation enhancements`}
                aria-pressed={preferences.keyboardNavigation}
              >
                {preferences.keyboardNavigation ? 'On' : 'Off'}
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="border-t border-border pt-3">
            <div className="text-sm text-muted-foreground">
              <div className="mb-2 font-medium">Keyboard Shortcuts:</div>
              <div className="space-y-1">
                <div><kbd className="rounded-none bg-muted px-1 py-0.5 text-xs">Ctrl + /</kbd> Skip to main content</div>
                <div><kbd className="rounded-none bg-muted px-1 py-0.5 text-xs">Alt + ←</kbd> Navigate back</div>
                <div><kbd className="rounded-none bg-muted px-1 py-0.5 text-xs">Alt + →</kbd> Navigate forward</div>
                <div><kbd className="rounded-none bg-muted px-1 py-0.5 text-xs">Ctrl/Cmd + K</kbd> Search</div>
              </div>
            </div>
          </div>
        </div>
        )}
      </dialog>
    </div>
  );
};
