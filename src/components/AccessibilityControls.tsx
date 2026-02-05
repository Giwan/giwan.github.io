/**
 * Accessibility Controls Component
 * 
 * Provides user interface for managing accessibility preferences
 * including reduced motion, screen reader announcements, and focus management.
 */

import React, { useState } from 'react';
import { Settings, Eye, EyeOff, Keyboard, Volume2, VolumeX, Zap, ZapOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/hooks/useAccessibility';

export const AccessibilityControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    preferences,
    toggleReducedMotion,
    toggleScreenReaderAnnouncements,
    toggleFocusManagement,
    toggleKeyboardNavigation,
    announce
  } = useAccessibility();

  const handleTogglePanel = () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      announce({
        message: 'Accessibility controls panel opened',
        priority: 'polite'
      });
    } else {
      announce({
        message: 'Accessibility controls panel closed',
        priority: 'polite'
      });
    }
  };

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
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <Button
        onClick={handleTogglePanel}
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg bg-background border-2 hover:bg-accent focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label={isOpen ? "Close accessibility controls" : "Open accessibility controls"}
        aria-expanded={isOpen}
        aria-controls="accessibility-controls-panel"
      >
        <Settings className="h-5 w-5" />
      </Button>

      {/* Controls Panel */}
      {isOpen && (
        <div
          id="accessibility-controls-panel"
          className="absolute bottom-16 right-0 w-80 bg-background border border-border rounded-lg shadow-xl p-4 space-y-4"
          role="dialog"
          aria-labelledby="accessibility-controls-title"
          aria-describedby="accessibility-controls-description"
        >
          <div className="flex items-center justify-between">
            <h2 id="accessibility-controls-title" className="text-lg font-semibold text-foreground">
              Accessibility Settings
            </h2>
            <Button
              onClick={handleTogglePanel}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label="Close accessibility controls"
            >
              ×
            </Button>
          </div>

          <p id="accessibility-controls-description" className="text-sm text-muted-foreground">
            Customize your accessibility preferences for a better browsing experience.
          </p>

          <div className="space-y-3">
            {/* Reduced Motion Control */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
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
            <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
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
            <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
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
            <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
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
          <div className="pt-3 border-t border-border">
            <div className="text-sm text-muted-foreground">
              <div className="font-medium mb-2">Keyboard Shortcuts:</div>
              <div className="space-y-1">
                <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl + /</kbd> Skip to main content</div>
                <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Alt + ←</kbd> Navigate back</div>
                <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Alt + →</kbd> Navigate forward</div>
                <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl/Cmd + K</kbd> Search</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};