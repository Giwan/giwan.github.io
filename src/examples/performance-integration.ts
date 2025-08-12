/**
 * Performance Integration Example
 * 
 * This example shows how to integrate the performance monitoring
 * and user preference systems into your Astro application.
 */

import { performanceMonitor } from '../utils/performanceMonitor';
import { transitionPreferences } from '../utils/transitionPreferences';
import { transitionController } from '../utils/transitionController';

// Example 1: Basic setup in your main layout or app initialization
export function initializePerformanceMonitoring() {
  // The performance monitor is automatically initialized,
  // but you can customize its behavior
  
  // Listen for performance fallback events
  document.addEventListener('transition-performance-fallback', (event) => {
    const customEvent = event as CustomEvent;
    const { performanceData, recommendedIntensity } = customEvent.detail;
    
    console.log('Performance fallback triggered:', {
      averageFrameRate: performanceData.averageFrameRate,
      droppedFrames: performanceData.droppedFrames,
      recommendedIntensity
    });
    
    // Optionally show a notification to the user
    showPerformanceNotification(recommendedIntensity);
  });
  
  // Set up preference change listeners
  transitionPreferences.addChangeListener((event) => {
    console.log('Transition preference changed:', {
      preference: event.preference,
      oldValue: event.oldValue,
      newValue: event.newValue
    });
    
    // You can react to specific preference changes
    if (event.preference === 'intensity') {
      updateTransitionIntensityUI(event.newValue);
    }
  });
}

// Example 2: Manual performance monitoring for custom transitions
export function monitorCustomTransition(transitionName: string) {
  // Start monitoring
  performanceMonitor.startMonitoring(transitionName);
  
  // Your custom transition code here
  performCustomAnimation().then(() => {
    // Stop monitoring and get results
    const results = performanceMonitor.stopMonitoring();
    
    if (results) {
      console.log('Custom transition performance:', {
        duration: results.endTime - results.startTime,
        averageFrameRate: results.averageFrameRate,
        droppedFrames: results.droppedFrames
      });
    }
  });
}

// Example 3: Adaptive transition intensity based on device capabilities
export function setupAdaptiveTransitions() {
  // Get recommended intensity based on current device performance
  const recommendedIntensity = performanceMonitor.getRecommendedIntensity();
  
  // Apply the recommended intensity if user hasn't set a preference
  const currentPreferences = transitionPreferences.getPreferences();
  if (currentPreferences.adaptToPerformance) {
    transitionPreferences.updatePreference('intensity', recommendedIntensity);
  }
  
  // Monitor performance continuously and adapt
  setInterval(() => {
    const currentMetrics = performanceMonitor.getCurrentMetrics();
    
    // If performance is consistently poor, suggest reducing intensity
    if (currentMetrics.frameRate < 30 && currentPreferences.adaptToPerformance) {
      const newRecommendation = performanceMonitor.getRecommendedIntensity(currentMetrics);
      
      if (newRecommendation !== currentPreferences.intensity) {
        transitionPreferences.updatePreference('intensity', newRecommendation);
      }
    }
  }, 5000); // Check every 5 seconds
}

// Example 4: Performance debugging and monitoring dashboard
export function createPerformanceDashboard() {
  const dashboard = document.createElement('div');
  dashboard.className = 'performance-dashboard';
  dashboard.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
  `;
  
  const updateDashboard = () => {
    const metrics = performanceMonitor.getCurrentMetrics();
    const history = performanceMonitor.getPerformanceHistory();
    const preferences = transitionPreferences.getPreferences();
    
    dashboard.innerHTML = `
      <div><strong>Performance Monitor</strong></div>
      <div>FPS: ${metrics.frameRate}</div>
      <div>Frame Time: ${metrics.averageFrameTime}ms</div>
      <div>Dropped Frames: ${metrics.droppedFrames}</div>
      <div>Memory Usage: ${metrics.memoryUsage ? (metrics.memoryUsage * 100).toFixed(1) + '%' : 'N/A'}</div>
      <div>Transitions: ${history.length}</div>
      <div>Intensity: ${preferences.intensity}</div>
      <div>Adapt Performance: ${preferences.adaptToPerformance ? 'ON' : 'OFF'}</div>
    `;
  };
  
  // Update dashboard every second
  setInterval(updateDashboard, 1000);
  updateDashboard();
  
  document.body.appendChild(dashboard);
  
  return dashboard;
}

// Example 5: Custom transition with performance awareness
export async function performCustomAnimation(): Promise<void> {
  const preferences = transitionPreferences.getPreferences();
  const effectiveIntensity = transitionPreferences.getEffectiveIntensity();
  
  // Adjust animation parameters based on intensity
  let duration = 300;
  let easing = 'ease-out';
  let complexity = 'normal';
  
  switch (effectiveIntensity) {
    case 'minimal':
      duration = 0;
      complexity = 'none';
      break;
    case 'reduced':
      duration = 150;
      easing = 'linear';
      complexity = 'simple';
      break;
    case 'enhanced':
      duration = 500;
      easing = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
      complexity = 'complex';
      break;
  }
  
  // Perform animation based on complexity level
  if (complexity === 'none') {
    // No animation, just instant change
    return Promise.resolve();
  }
  
  // Create and run animation
  const element = document.querySelector('.animated-element') as HTMLElement;
  if (!element) return;
  
  return new Promise((resolve) => {
    if (complexity === 'simple') {
      // Simple fade animation
      element.style.transition = `opacity ${duration}ms ${easing}`;
      element.style.opacity = '0';
      
      setTimeout(() => {
        element.style.opacity = '1';
        resolve();
      }, duration);
    } else {
      // Complex animation with transforms
      element.style.transition = `all ${duration}ms ${easing}`;
      element.style.transform = 'translateY(-20px) scale(0.95)';
      element.style.opacity = '0';
      
      setTimeout(() => {
        element.style.transform = 'translateY(0) scale(1)';
        element.style.opacity = '1';
        resolve();
      }, duration);
    }
  });
}

// Helper functions
function showPerformanceNotification(recommendedIntensity: string) {
  // Create a simple notification
  const notification = document.createElement('div');
  notification.textContent = `Performance optimized: Transition intensity set to ${recommendedIntensity}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 10000;
    font-size: 14px;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

function updateTransitionIntensityUI(intensity: string) {
  // Update any UI elements that show the current intensity
  const intensityIndicators = document.querySelectorAll('.transition-intensity-indicator');
  intensityIndicators.forEach(indicator => {
    indicator.textContent = intensity;
    indicator.className = `transition-intensity-indicator intensity-${intensity}`;
  });
}

// Export for use in Astro components or layouts
export {
  initializePerformanceMonitoring,
  monitorCustomTransition,
  setupAdaptiveTransitions,
  createPerformanceDashboard,
  performCustomAnimation
};