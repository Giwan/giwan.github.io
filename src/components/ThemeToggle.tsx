import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useRef } from 'react';

export const ThemeToggle = () => {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getTitle = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to system theme';
      case 'system':
        return 'Switch to light mode';
      default:
        return 'Toggle theme';
    }
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

  // Add transition:name for visual continuity
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.style.viewTransitionName = 'theme-toggle';
    }
  }, []);

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