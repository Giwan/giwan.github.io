import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, WifiOff, FileText, Image, Search } from 'lucide-react';
import NetworkErrorHandler from './NetworkErrorHandler';
import OfflineFallback from './OfflineFallback';
import { getNetworkStatus, isContentCached, fetchWithRetry } from '../utils/pwa';

interface ContentErrorHandlerProps {
  error?: Error;
  contentType?: 'page' | 'image' | 'api' | 'search' | 'generic';
  requestedUrl?: string;
  fallbackContent?: React.ReactNode;
  onRetry?: () => Promise<void>;
  onFallback?: () => void;
  children?: React.ReactNode;
}

/**
 * Comprehensive content error handler that provides appropriate fallbacks
 * based on content type and error conditions
 */
const ContentErrorHandler: React.FC<ContentErrorHandlerProps> = ({
  error,
  contentType = 'generic',
  requestedUrl,
  fallbackContent,
  onRetry,
  onFallback,
  children
}) => {
  const [networkStatus, setNetworkStatus] = useState(getNetworkStatus());
  const [isRetrying, setIsRetrying] = useState(false);
  const [cachedContent, setCachedContent] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Check if content is cached
    const checkCache = async () => {
      if (requestedUrl) {
        const isCached = await isContentCached(requestedUrl);
        setCachedContent(isCached);
      }
    };

    checkCache();

    // Listen for network changes
    const handleOnline = () => setNetworkStatus(getNetworkStatus());
    const handleOffline = () => setNetworkStatus(getNetworkStatus());

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [requestedUrl]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      if (onRetry) {
        await onRetry();
      } else if (requestedUrl) {
        // Default retry behavior - attempt to fetch the content
        await fetchWithRetry(requestedUrl);
        // If successful, reload the page or component
        window.location.reload();
      }
    } catch (retryError) {
      console.warn('Retry failed:', retryError);
    } finally {
      setIsRetrying(false);
    }
  };

  const getContentTypeIcon = () => {
    switch (contentType) {
      case 'page':
        return <FileText className="h-8 w-8 text-gray-400" />;
      case 'image':
        return <Image className="h-8 w-8 text-gray-400" />;
      case 'search':
        return <Search className="h-8 w-8 text-gray-400" />;
      case 'api':
        return <WifiOff className="h-8 w-8 text-gray-400" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-gray-400" />;
    }
  };

  const getErrorMessage = () => {
    if (!networkStatus.isOnline) {
      switch (contentType) {
        case 'page':
          return {
            title: 'Page Not Available Offline',
            description: cachedContent 
              ? 'This page is cached but failed to load. Try refreshing.'
              : 'This page hasn\'t been cached for offline viewing yet.'
          };
        case 'image':
          return {
            title: 'Image Not Available',
            description: 'Images require an internet connection to load.'
          };
        case 'search':
          return {
            title: 'Search Unavailable Offline',
            description: 'Search functionality requires an internet connection.'
          };
        case 'api':
          return {
            title: 'Data Not Available Offline',
            description: 'This content requires an internet connection to load.'
          };
        default:
          return {
            title: 'Content Not Available Offline',
            description: 'This content requires an internet connection.'
          };
      }
    } else {
      // Online but still failed
      return {
        title: 'Content Failed to Load',
        description: error?.message || 'An unexpected error occurred while loading this content.'
      };
    }
  };

  const getFallbackStrategy = () => {
    // If we have custom fallback content, use it
    if (fallbackContent) {
      return fallbackContent;
    }

    // If we're offline, show offline-specific fallback
    if (!networkStatus.isOnline) {
      return (
        <OfflineFallback 
          requestedUrl={requestedUrl}
          fallbackType={contentType === 'search' ? 'search' : contentType === 'page' ? 'page' : 'content'}
          onRetry={handleRetry}
        />
      );
    }

    // For network errors while online, show network error handler
    if (error) {
      return (
        <NetworkErrorHandler
          error={error}
          url={requestedUrl}
          onRetry={handleRetry}
        />
      );
    }

    // Default fallback UI
    const errorMessage = getErrorMessage();
    
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4">
          {getContentTypeIcon()}
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {errorMessage.title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {errorMessage.description}
        </p>

        {/* Network Status */}
        <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            networkStatus.isOnline ? 'bg-green-500' : 'bg-red-500'
          }`} />
          {networkStatus.isOnline ? 'Online' : 'Offline'}
          {retryCount > 0 && (
            <span className="ml-2">• {retryCount} retry attempts</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </button>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Go Back
          </button>

          {onFallback && (
            <button
              onClick={onFallback}
              className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Show Alternative
            </button>
          )}
        </div>

        {/* Additional Content */}
        {children && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 w-full max-w-md">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[200px] flex items-center justify-center">
      {getFallbackStrategy()}
    </div>
  );
};

export default ContentErrorHandler;