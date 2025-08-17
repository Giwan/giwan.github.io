import React from "react";
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useRef, useState } from 'react';

const getThemeIcon = (theme: "light" | "dark" | "system" = "light"): React.JSX.Element => {
  const classNameForIcon = "h-4 w-4";
  const data: Record<"light" | "dark" | "system", React.JSX.Element> = {
    "light": <Sun className={classNameForIcon} />,
    "dark": <Moon className={classNameForIcon} />,
    "system": <Monitor className={classNameForIcon} />
  }
  return data[theme];
}

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getIcon = () => getThemeIcon(theme);

  const getTitle = () => {
  const titles: Record<"light" | "dark" | "system", string> = {
      "light": "Switch to dark mode",
      "dark": "Switch to system theme",
      "system": "Switch to light mode"
    };
    return titles[theme] || "Toggle theme";
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
      title={getTitle()}
      className="h-9 w-9"
      style={{ viewTransitionName: 'theme-toggle' }}
    >
      {getIcon()}
      <span className="sr-only">{getTitle()}</span>
    </Button>
  );
};