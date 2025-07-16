import { useState, useEffect } from 'react';
import { handlePWAError, type PWAError } from '../utils/pwa';

interface ServiceWorkerUpdateState {
  updateAvailable: boolean;
  showNotification: boolean;
  updateServiceWorker: () => void;
  dismissNotification: () => void;
  hasError: boolean;
  errorMessage: string | null;
  retryRegistration: () => void;
}

export const useServiceWorkerUpdate = (): ServiceWorkerUpdateState => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleError = (error: Error, context: string) => {
    const pwaError: PWAError = {
      type: 'service-worker',
      message: `Service worker error in ${context}: ${error.message}`,
      originalError: error,
      timestamp: Date.now()
    };
    
    handlePWAError(pwaError);
    setHasError(true);
    setErrorMessage(error.message);
  };

  const clearError = () => {
    setHasError(false);
    setErrorMessage(null);
  };

  const setupServiceWorkerHandling = async () => {
    try {
      // Only run in browser environment
      if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return;
      }

      clearError();

      const registration = await navigator.serviceWorker.ready;
      
      // Check if there's a waiting service worker
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setUpdateAvailable(true);
        setShowNotification(true);
      }

      // Listen for new service worker installations
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            try {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is installed and ready
                setWaitingWorker(newWorker);
                setUpdateAvailable(true);
                setShowNotification(true);
              }
            } catch (error) {
              handleError(error as Error, 'state change handling');
            }
          });

          newWorker.addEventListener('error', (event) => {
            handleError(new Error('Service worker installation failed'), 'installation');
          });
        }
      });

      // Listen for controlling service worker changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        try {
          // Service worker has been updated and is now controlling the page
          window.location.reload();
        } catch (error) {
          handleError(error as Error, 'controller change');
        }
      });

      // Handle service worker errors
      registration.addEventListener('error', (event) => {
        handleError(new Error('Service worker runtime error'), 'runtime');
      });

    } catch (error) {
      handleError(error as Error, 'setup');
    }
  };

  useEffect(() => {
    setupServiceWorkerHandling();

    // Listen for messages from service worker with error handling
    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          setUpdateAvailable(true);
          setShowNotification(true);
        }
      } catch (error) {
        handleError(error as Error, 'message handling');
      }
    };

    // Listen for PWA errors from other components
    const handlePWAError = (event: CustomEvent) => {
      const error = event.detail as PWAError;
      if (error.type === 'service-worker') {
        setHasError(true);
        setErrorMessage(error.message);
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);
    window.addEventListener('pwa-error', handlePWAError as EventListener);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
      window.removeEventListener('pwa-error', handlePWAError as EventListener);
    };
  }, []);

  const updateServiceWorker = () => {
    try {
      if (waitingWorker) {
        // Tell the waiting service worker to skip waiting and become active
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        setShowNotification(false);
        clearError();
      }
    } catch (error) {
      handleError(error as Error, 'update activation');
    }
  };

  const dismissNotification = () => {
    try {
      setShowNotification(false);
      // Store dismissal in localStorage to prevent showing again for this update
      if (waitingWorker) {
        localStorage.setItem('sw-update-dismissed', Date.now().toString());
      }
    } catch (error) {
      handleError(error as Error, 'notification dismissal');
    }
  };

  const retryRegistration = () => {
    clearError();
    setupServiceWorkerHandling();
  };

  return {
    updateAvailable,
    showNotification,
    updateServiceWorker,
    dismissNotification,
    hasError,
    errorMessage,
    retryRegistration,
  };
};