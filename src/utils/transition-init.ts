import { transitionController } from './transitionController';
import { devConsole } from './isDev';

export function initializeTransitions(): void {
  if (typeof window === 'undefined') return;
  if (import.meta.env.DEV) {
    document.addEventListener('astro:before-preparation', () => {
      devConsole('log', ['Transition starting:', {
        from: window.location.pathname
      }]);
    });
  }
}

export function getTransitionController() {
  return transitionController;
}

export function isViewTransitionSupported(): boolean {
  return transitionController.isTransitionSupported();
}

export function initializeTransitionErrorHandling(): void {
  if (typeof window === 'undefined') return;
}

export { transitionController };
