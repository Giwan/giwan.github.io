import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { fetchWithRetry, getNetworkStatus, type RetryConfig } from '../utils/pwa';

interface NetworkErrorHandlerProps {
  error: Error;
  url?: string;
  onRetry?: () => void;
  onSuccess?: (response: Response) => void;
  retryConfig?: Partial<RetryConfig>;
  children?: React.ReactNode;
}

const NetworkErrorHandler: React.FC<NetworkErrorHandlerProps> = ({
  error,
  url,
  onRetry,
  onSuccess,
  retryConfig,
  children
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [networkStatus, setNetworkStatus] = useState(getNetworkStatus());
  const [lastRetryTime, setLastRetryTime] = useState<number | null>(null);

  useEffect(() => {
    // Listen for network status changes
    const handleOnline = () => {
      const newStatus = getNetworkStatus();
      setNetworkStatus(newStatus);
      
      // Auto-retry when coming back online if we have a URL to retry
      if (newStatus.isOnline && url && retryCount > 0) {
        handleAutoRetry();
      }
    };

    const handleOffline = () => {
      setNetworkStatus(getNetworkStatus());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [url, retryCount]);

  const handleAutoRetry = async () => {
    if (!url || isRetrying) return;

    try {
      setIsRetrying(true);
      const response = await fetchWithRetry(url, {}, retryConfig);
      
      if (onSuccess) {
        onSuccess(response);
      }
      
      // Reset retry count on success
      setRetryCount(0);
    } catch (retryError) {
      console.warn('Auto-retry failed:', retryError);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleManualRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    setLastRetryTime(Date.now());

    try {
      if (url) {
        const response = await fetchWithRetry(url, {}, retryConfig);
        
        if (onSuccess) {
          onSuccess(response);
        }
        
        // Reset retry count on success
        setRetryCount(0);
      } else if (onRetry) {
        await onRetry();
      }
    } catch (retryError) {
      console.warn('Manual retry failed:', retryError);
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorType = (error: Error): string => {
    const message = error.message.toLowerCase();
    
    if (message.includes('failed to fetch') || message.includes('network error')) {
      return 'network';
    } else if (message.includes('timeout')) {
      return 'timeout';
    } else if (message.includes('404')) {
      return 'not-found';
    } else if (message.includes('500') || message.includes('502') || message.includes('503')) {
      return 'server';
    } else {
      return 'unknown';
    }
  };

  const getErrorMessage = (errorType: string): { title: string; description: string } => {
    switch (errorType) {
      case 'network':
        return {
          title: 'Connection Problem',
          description: networkStatus.isOnline 
            ? 'Unable to reach the server. This might be a temporary issue.'
            : 'You appear to be offline. Check your internet connection.'
        };
      case 'timeout':
        return {
          title: 'Request Timeout',
          description: 'The request took too long to complete. The server might be busy.'
        };
      case 'not-found':
        return {
          title: 'Content Not Found',
          description: 'The requested content could not be found on the server.'
        };
      case 'server':
        return {
          title: 'Server Error',
          description: 'The server encountered an error. Please try again in a moment.'
        };
      default:
        return {
          title: 'Something Went Wrong',
          description: 'An unexpected error occurred while loading the content.'
        };
    }
  };

  const errorType = getErrorType(error);
  const errorMessage = getErrorMessage(errorType);
  const canRetry = errorType !== 'not-found';

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
            {errorMessage.title}
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
            {errorMessage.description}
          </p>

          {/* Network Status Indicator */}
          <div className="flex items-center mb-3 text-xs text-red-600 dark:text-red-400">
            {networkStatus.isOnline ? (
              <Wifi className="h-3 w-3 mr-1" />
            ) : (
              <WifiOff className="h-3 w-3 mr-1" />
            )}
            <span>
              {networkStatus.isOnline ? 'Online' : 'Offline'}
              {networkStatus.effectiveType && (
                <span className="ml-1">({networkStatus.effectiveType})</span>
              )}
            </span>
          </div>

          {/* Retry Information */}
          {retryCount > 0 && (
            <div className="mb-3 text-xs text-red-600 dark:text-red-400">
              Retry attempts: {retryCount}
              {lastRetryTime && (
                <span className="ml-2">
                  Last attempt: {new Date(lastRetryTime).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {canRetry && (
              <button
                onClick={handleManualRetry}
                disabled={isRetrying}
                className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-red-800 dark:text-red-200 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </button>
            )}

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Reload Page
            </button>
          </div>

          {/* Custom Content */}
          {children && (
            <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-700">
              {children}
            </div>
          )}

          {/* Technical Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-3 pt-3 border-t border-red-200 dark:border-red-700">
              <summary className="text-xs font-medium text-red-700 dark:text-red-300 cursor-pointer">
                Technical Details
              </summary>
              <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-xs font-mono text-red-800 dark:text-red-300 overflow-auto max-h-32">
                <div className="font-semibold mb-1">{error.name}</div>
                <div className="mb-2">{error.message}</div>
                {url && (
                  <div className="mb-2">
                    <span className="font-semibold">URL:</span> {url}
                  </div>
                )}
                {error.stack && (
                  <div className="text-red-600 dark:text-red-400 whitespace-pre-wrap">
                    {error.stack.split('\n').slice(0, 5).join('\n')}
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkErrorHandler;