import React from "react";
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useRef, useState } from 'react';

const getNextThemeIcon = (theme: "light" | "dark" | "system" = "light"): React.JSX.Element => {
  const classNameForIcon = "h-4 w-4 transition-all duration-300";
  const data: Record<"light" | "dark" | "system", React.JSX.Element> = {
    "light": <Moon className={classNameForIcon} />, // Next is dark
    "dark": <Monitor className={classNameForIcon} />, // Next is system
    "system": <Sun className={classNameForIcon} /> // Next is light
  }
  return data[theme];
}

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getIcon = () => getNextThemeIcon(theme);

  const getAriaLabel = () => {
    const nextModes: Record<"light" | "dark" | "system", string> = {
      "light": "dark",
      "dark": "system",
      "system": "light"
    };
    return `Currently in ${theme} mode. Click to switch to ${nextModes[theme]} mode.`;
  };

  // Enhanced theme toggle that coordinates with page transitions
  const handleThemeToggle = () => {
    // Check if a page transition is in progress
    const isTransitioning = document.documentElement.hasAttribute('data-transition-direction');

    if (isTransitioning) {
      // Queue the theme change to happen after the page transition
      const handleTransitionEnd = () => {
        toggleTheme();
        document.removeEventListener('astro:after-swap', handleTransitionEnd);
      };
      document.addEventListener('astro:after-swap', handleTransitionEnd);
    } else {
      // No page transition in progress, change theme immediately
      toggleTheme();
    }
  };

  // Ensure component is properly hydrated before showing
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Add transition:name for visual continuity
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.style.viewTransitionName = 'theme-toggle';
    }
  }, []);

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        disabled
        style={{ viewTransitionName: 'theme-toggle' }}
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    );
  }

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      onClick={handleThemeToggle}
      title={getAriaLabel()}
      className="h-9 w-9"
      style={{ viewTransitionName: 'theme-toggle' }}
    >
      {getIcon()}
      <span className="sr-only">{getAriaLabel()}</span>
    </Button>
  );
};