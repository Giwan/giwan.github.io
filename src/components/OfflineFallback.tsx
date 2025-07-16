import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, BookOpen, Home, Search } from 'lucide-react';
import { getNetworkStatus, getOfflineFallbackSuggestions, isContentCached } from '../utils/pwa';

interface OfflineFallbackProps {
  requestedUrl?: string;
  fallbackType?: 'page' | 'content' | 'search';
  onRetry?: () => void;
}

const OfflineFallback: React.FC<OfflineFallbackProps> = ({
  requestedUrl,
  fallbackType = 'page',
  onRetry
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(getNetworkStatus());
  const [cachedContent, setCachedContent] = useState<boolean>(false);

  useEffect(() => {
    // Load offline suggestions
    const loadSuggestions = async () => {
      try {
        const offlineSuggestions = await getOfflineFallbackSuggestions();
        setSuggestions(offlineSuggestions);
      } catch (error) {
        console.warn('Failed to load offline suggestions:', error);
      }
    };

    // Check if requested content is cached
    const checkCachedContent = async () => {
      if (requestedUrl) {
        try {
          const isCached = await isContentCached(requestedUrl);
          setCachedContent(isCached);
        } catch (error) {
          console.warn('Failed to check cached content:', error);
        }
      }
    };

    loadSuggestions();
    checkCachedContent();

    // Listen for network status changes
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
    
    try {
      // Wait a moment to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update network status
      setNetworkStatus(getNetworkStatus());
      
      if (networkStatus.isOnline && onRetry) {
        onRetry();
      } else if (networkStatus.isOnline) {
        // Reload the page if no custom retry handler
        window.location.reload();
      }
    } catch (error) {
      console.warn('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const formatUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace(/^\//, '').replace(/\/$/, '') || 'Home';
    } catch {
      return url;
    }
  };

  const getFallbackContent = () => {
    switch (fallbackType) {
      case 'search':
        return {
          title: 'Search Unavailable Offline',
          description: 'Search functionality requires an internet connection. You can browse cached articles below.',
          icon: <Search className="h-12 w-12 text-gray-400" />
        };
      case 'content':
        return {
          title: 'Content Not Available Offline',
          description: cachedContent 
            ? 'This content is cached but failed to load. Try refreshing the page.'
            : 'This content hasn\'t been cached for offline viewing yet.',
          icon: <BookOpen className="h-12 w-12 text-gray-400" />
        };
      default:
        return {
          title: 'Page Not Available Offline',
          description: 'This page requires an internet connection or hasn\'t been cached yet.',
          icon: <WifiOff className="h-12 w-12 text-gray-400" />
        };
    }
  };

  const fallbackContent = getFallbackContent();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Status Icon */}
        <div className="mb-6">
          {fallbackContent.icon}
        </div>

        {/* Main Message */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {fallbackContent.title}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {fallbackContent.description}
        </p>

        {/* Network Status */}
        <div className="mb-6 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              networkStatus.isOnline ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {networkStatus.isOnline ? 'Online' : 'Offline'}
              {networkStatus.effectiveType && (
                <span className="ml-1">({networkStatus.effectiveType})</span>
              )}
            </span>
          </div>
        </div>

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="w-full mb-6 flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>

        {/* Cached Content Suggestions */}
        {suggestions.length > 0 && (
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Available Offline
            </h2>
            <div className="space-y-2">
              {suggestions.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  className="block p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                      {formatUrl(url)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Fallback */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-center space-x-4">
            <a
              href="/"
              className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </a>
            <a
              href="/blog"
              className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Blog
            </a>
          </div>
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && requestedUrl && (
          <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
            <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Debug Info
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
              Requested: {requestedUrl}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Cached: {cachedContent ? 'Yes' : 'No'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineFallback;