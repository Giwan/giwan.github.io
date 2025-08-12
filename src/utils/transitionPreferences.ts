/**
 * Transition Preferences - User controls for transition intensity and behavior
 * 
 * This module provides:
 * - User preference storage and retrieval
 * - Transition intensity controls
 * - Accessibility preference integration
 * - Real-time preference updates
 */

import { TransitionIntensity, performanceMonitor } from './performanceMonitor';

export interface TransitionPreferences {
  intensity: TransitionIntensity;
  respectReducedMotion: boolean;
  adaptToPerformance: boolean;
  customDuration?: number;
  enableSoundEffects: boolean;
  enableHapticFeedback: boolean;
  debugMode: boolean;
}

export interface PreferenceChangeEvent {
  preference: keyof TransitionPreferences;
  oldValue: any;
  newValue: any;
  timestamp: number;
}

export class TransitionPreferencesManager {
  private preferences: TransitionPreferences;
  private readonly STORAGE_KEY = 'transition-preferences';
  private readonly DEFAULT_PREFERENCES: TransitionPreferences = {
    intensity: TransitionIntensity.NORMAL,
    respectReducedMotion: true,
    adaptToPerformance: true,
    enableSoundEffects: false,
    enableHapticFeedback: false,
    debugMode: false
  };

  private changeListeners: ((event: PreferenceChangeEvent) => void)[] = [];
  private mediaQueryList: MediaQueryList | null = null;

  constructor() {
    this.preferences = this.loadPreferences();
    this.initialize();
  }

  /**
   * Initialize preference manager
   */
  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Listen for reduced motion preference changes
    this.setupReducedMotionListener();

    // Apply initial preferences
    this.applyPreferences();

    // Listen for performance changes if adaptation is enabled
    if (this.preferences.adaptToPerformance) {
      this.setupPerformanceAdaptation();
    }
  }

  /**
   * Set up reduced motion media query listener
   */
  private setupReducedMotionListener(): void {
    if (!window.matchMedia) return;

    this.mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      if (this.preferences.respectReducedMotion) {
        const newIntensity = e.matches ? TransitionIntensity.MINIMAL : TransitionIntensity.NORMAL;
        this.updatePreference('intensity', newIntensity);
      }
    };

    // Modern browsers
    if (this.mediaQueryList.addEventListener) {
      this.mediaQueryList.addEventListener('change', handleReducedMotionChange);
    } else {
      // Legacy browsers
      this.mediaQueryList.addListener(handleReducedMotionChange);
    }
  }

  /**
   * Set up performance-based adaptation
   */
  private setupPerformanceAdaptation(): void {
    document.addEventListener('transition-performance-fallback', (event: Event) => {
      const customEvent = event as CustomEvent;
      const recommendedIntensity = customEvent.detail?.recommendedIntensity;

      if (recommendedIntensity && this.preferences.adaptToPerformance) {
        this.updatePreference('intensity', recommendedIntensity);
      }
    });
  }

  /**
   * Load preferences from storage
   */
  private loadPreferences(): TransitionPreferences {
    if (typeof localStorage === 'undefined') {
      return { ...this.DEFAULT_PREFERENCES };
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...this.DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load transition preferences:', error);
    }

    return { ...this.DEFAULT_PREFERENCES };
  }

  /**
   * Save preferences to storage
   */
  private savePreferences(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.warn('Failed to save transition preferences:', error);
    }
  }

  /**
   * Get current preferences
   */
  public getPreferences(): TransitionPreferences {
    return { ...this.preferences };
  }

  /**
   * Get specific preference value
   */
  public getPreference<K extends keyof TransitionPreferences>(
    key: K
  ): TransitionPreferences[K] {
    return this.preferences[key];
  }

  /**
   * Update a specific preference
   */
  public updatePreference<K extends keyof TransitionPreferences>(
    key: K,
    value: TransitionPreferences[K]
  ): void {
    const oldValue = this.preferences[key];

    if (oldValue === value) return; // No change

    this.preferences[key] = value;
    this.savePreferences();
    this.applyPreferences();

    // Notify listeners
    const changeEvent: PreferenceChangeEvent = {
      preference: key,
      oldValue,
      newValue: value,
      timestamp: Date.now()
    };

    this.changeListeners.forEach(listener => {
      try {
        listener(changeEvent);
      } catch (error) {
        console.warn('Error in preference change listener:', error);
      }
    });
  }

  /**
   * Update multiple preferences at once
   */
  public updatePreferences(updates: Partial<TransitionPreferences>): void {
    const changes: PreferenceChangeEvent[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      const typedKey = key as keyof TransitionPreferences;
      const oldValue = this.preferences[typedKey];

      if (oldValue !== value) {
        this.preferences[typedKey] = value as any;
        changes.push({
          preference: typedKey,
          oldValue,
          newValue: value,
          timestamp: Date.now()
        });
      }
    });

    if (changes.length > 0) {
      this.savePreferences();
      this.applyPreferences();

      // Notify listeners of all changes
      changes.forEach(change => {
        this.changeListeners.forEach(listener => {
          try {
            listener(change);
          } catch (error) {
            console.warn('Error in preference change listener:', error);
          }
        });
      });
    }
  }

  /**
   * Reset preferences to defaults
   */
  public resetPreferences(): void {
    const oldPreferences = { ...this.preferences };
    this.preferences = { ...this.DEFAULT_PREFERENCES };
    this.savePreferences();
    this.applyPreferences();

    // Notify listeners of all changes
    Object.keys(this.preferences).forEach(key => {
      const typedKey = key as keyof TransitionPreferences;
      const oldValue = oldPreferences[typedKey];
      const newValue = this.preferences[typedKey];

      if (oldValue !== newValue) {
        const changeEvent: PreferenceChangeEvent = {
          preference: typedKey,
          oldValue,
          newValue,
          timestamp: Date.now()
        };

        this.changeListeners.forEach(listener => {
          try {
            listener(changeEvent);
          } catch (error) {
            console.warn('Error in preference change listener:', error);
          }
        });
      }
    });
  }

  /**
   * Apply current preferences to the document
   */
  private applyPreferences(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Apply transition intensity
    root.setAttribute('data-transition-intensity', this.preferences.intensity);

    // Apply reduced motion respect
    if (this.preferences.respectReducedMotion &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.setAttribute('data-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-reduced-motion');
    }

    // Apply performance adaptation
    root.setAttribute('data-adapt-performance', this.preferences.adaptToPerformance.toString());

    // Apply custom duration if set
    if (this.preferences.customDuration) {
      root.style.setProperty('--transition-duration-custom', `${this.preferences.customDuration}ms`);
    } else {
      root.style.removeProperty('--transition-duration-custom');
    }

    // Apply debug mode
    if (this.preferences.debugMode) {
      root.setAttribute('data-debug-transitions', 'true');
    } else {
      root.removeAttribute('data-debug-transitions');
    }

    // Apply sound effects preference
    root.setAttribute('data-sound-effects', this.preferences.enableSoundEffects.toString());

    // Apply haptic feedback preference
    root.setAttribute('data-haptic-feedback', this.preferences.enableHapticFeedback.toString());

    // Set CSS custom properties based on intensity
    this.applyCSSProperties();
  }

  /**
   * Apply CSS custom properties based on intensity
   */
  private applyCSSProperties(): void {
    const root = document.documentElement;

    switch (this.preferences.intensity) {
      case TransitionIntensity.MINIMAL:
        root.style.setProperty('--transition-duration-multiplier', '0');
        root.style.setProperty('--transition-scale-factor', '0');
        root.style.setProperty('--transition-opacity-factor', '1');
        break;

      case TransitionIntensity.REDUCED:
        root.style.setProperty('--transition-duration-multiplier', '0.5');
        root.style.setProperty('--transition-scale-factor', '0.5');
        root.style.setProperty('--transition-opacity-factor', '0.8');
        break;

      case TransitionIntensity.NORMAL:
        root.style.setProperty('--transition-duration-multiplier', '1');
        root.style.setProperty('--transition-scale-factor', '1');
        root.style.setProperty('--transition-opacity-factor', '1');
        break;

      case TransitionIntensity.ENHANCED:
        root.style.setProperty('--transition-duration-multiplier', '1.2');
        root.style.setProperty('--transition-scale-factor', '1.2');
        root.style.setProperty('--transition-opacity-factor', '1');
        break;
    }
  }

  /**
   * Get effective transition intensity (considering all factors)
   */
  public getEffectiveIntensity(): TransitionIntensity {
    // Check reduced motion first
    if (this.preferences.respectReducedMotion &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return TransitionIntensity.MINIMAL;
    }

    // Check performance adaptation
    if (this.preferences.adaptToPerformance) {
      const recommendedIntensity = performanceMonitor.getRecommendedIntensity();

      // Use the more conservative intensity
      const intensityOrder = [
        TransitionIntensity.MINIMAL,
        TransitionIntensity.REDUCED,
        TransitionIntensity.NORMAL,
        TransitionIntensity.ENHANCED
      ];

      const userIndex = intensityOrder.indexOf(this.preferences.intensity);
      const recommendedIndex = intensityOrder.indexOf(recommendedIntensity);

      return intensityOrder[Math.min(userIndex, recommendedIndex)];
    }

    return this.preferences.intensity;
  }

  /**
   * Add preference change listener
   */
  public addChangeListener(listener: (event: PreferenceChangeEvent) => void): void {
    this.changeListeners.push(listener);
  }

  /**
   * Remove preference change listener
   */
  public removeChangeListener(listener: (event: PreferenceChangeEvent) => void): void {
    const index = this.changeListeners.indexOf(listener);
    if (index > -1) {
      this.changeListeners.splice(index, 1);
    }
  }

  /**
   * Create a preference control UI element
   */
  public createIntensityControl(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'transition-intensity-control';
    container.innerHTML = `
      <label for="transition-intensity">Transition Intensity:</label>
      <select id="transition-intensity" class="transition-intensity-select">
        <option value="${TransitionIntensity.MINIMAL}">Minimal</option>
        <option value="${TransitionIntensity.REDUCED}">Reduced</option>
        <option value="${TransitionIntensity.NORMAL}">Normal</option>
        <option value="${TransitionIntensity.ENHANCED}">Enhanced</option>
      </select>
    `;

    const select = container.querySelector('select') as HTMLSelectElement;
    select.value = this.preferences.intensity;

    select.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.updatePreference('intensity', target.value as TransitionIntensity);
    });

    // Update select when preference changes
    this.addChangeListener((event) => {
      if (event.preference === 'intensity') {
        select.value = event.newValue as string;
      }
    });

    return container;
  }

  /**
   * Create a comprehensive preferences panel
   */
  public createPreferencesPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'transition-preferences-panel';
    panel.innerHTML = `
      <h3>Transition Preferences</h3>
      
      <div class="preference-group">
        <label for="intensity-select">Intensity:</label>
        <select id="intensity-select">
          <option value="${TransitionIntensity.MINIMAL}">Minimal</option>
          <option value="${TransitionIntensity.REDUCED}">Reduced</option>
          <option value="${TransitionIntensity.NORMAL}">Normal</option>
          <option value="${TransitionIntensity.ENHANCED}">Enhanced</option>
        </select>
      </div>
      
      <div class="preference-group">
        <label>
          <input type="checkbox" id="respect-reduced-motion"> 
          Respect reduced motion preference
        </label>
      </div>
      
      <div class="preference-group">
        <label>
          <input type="checkbox" id="adapt-performance"> 
          Adapt to device performance
        </label>
      </div>
      
      <div class="preference-group">
        <label for="custom-duration">Custom duration (ms):</label>
        <input type="number" id="custom-duration" min="0" max="2000" step="50">
      </div>
      
      <div class="preference-group">
        <label>
          <input type="checkbox" id="sound-effects"> 
          Enable sound effects
        </label>
      </div>
      
      <div class="preference-group">
        <label>
          <input type="checkbox" id="haptic-feedback"> 
          Enable haptic feedback
        </label>
      </div>
      
      <div class="preference-group">
        <label>
          <input type="checkbox" id="debug-mode"> 
          Debug mode
        </label>
      </div>
      
      <div class="preference-actions">
        <button id="reset-preferences">Reset to Defaults</button>
      </div>
    `;

    // Set initial values
    const intensitySelect = panel.querySelector('#intensity-select') as HTMLSelectElement;
    const respectReducedMotion = panel.querySelector('#respect-reduced-motion') as HTMLInputElement;
    const adaptPerformance = panel.querySelector('#adapt-performance') as HTMLInputElement;
    const customDuration = panel.querySelector('#custom-duration') as HTMLInputElement;
    const soundEffects = panel.querySelector('#sound-effects') as HTMLInputElement;
    const hapticFeedback = panel.querySelector('#haptic-feedback') as HTMLInputElement;
    const debugMode = panel.querySelector('#debug-mode') as HTMLInputElement;
    const resetButton = panel.querySelector('#reset-preferences') as HTMLButtonElement;

    intensitySelect.value = this.preferences.intensity;
    respectReducedMotion.checked = this.preferences.respectReducedMotion;
    adaptPerformance.checked = this.preferences.adaptToPerformance;
    customDuration.value = this.preferences.customDuration?.toString() || '';
    soundEffects.checked = this.preferences.enableSoundEffects;
    hapticFeedback.checked = this.preferences.enableHapticFeedback;
    debugMode.checked = this.preferences.debugMode;

    // Add event listeners
    intensitySelect.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.updatePreference('intensity', target.value as TransitionIntensity);
    });

    respectReducedMotion.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      this.updatePreference('respectReducedMotion', target.checked);
    });

    adaptPerformance.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      this.updatePreference('adaptToPerformance', target.checked);
    });

    customDuration.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const value = target.value ? parseInt(target.value) : undefined;
      this.updatePreference('customDuration', value);
    });

    soundEffects.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      this.updatePreference('enableSoundEffects', target.checked);
    });

    hapticFeedback.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      this.updatePreference('enableHapticFeedback', target.checked);
    });

    debugMode.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      this.updatePreference('debugMode', target.checked);
    });

    resetButton.addEventListener('click', () => {
      this.resetPreferences();
    });

    return panel;
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.mediaQueryList) {
      if (this.mediaQueryList.removeEventListener) {
        this.mediaQueryList.removeEventListener('change', () => { });
      } else {
        this.mediaQueryList.removeListener(() => { });
      }
      this.mediaQueryList = null;
    }

    this.changeListeners = [];
  }
}

// Create and export singleton instance
export const transitionPreferences = new TransitionPreferencesManager();

// Export for testing and advanced usage
export default TransitionPreferencesManager;