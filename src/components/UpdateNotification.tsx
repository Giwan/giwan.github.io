import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Download } from 'lucide-react';

interface UpdateNotificationProps {
  onUpdate: () => void;
  onDismiss: () => void;
  isVisible: boolean;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  onUpdate,
  onDismiss,
  isVisible
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => setIsAnimating(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible]);

  const handleUpdate = () => {
    setIsUpdating(true);
    setIsAnimating(false);
    setTimeout(() => {
      onUpdate();
    }, 200);
  };

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onDismiss();
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-sm transition-all duration-300 ease-in-out ${
        isAnimating 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-full opacity-0'
      }`}
      role="alert"
      aria-live="polite"
      aria-labelledby="update-notification-title"
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <Download className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <h3 
              id="update-notification-title"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Update Available
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Dismiss update notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          A new version of the blog is available. Update now to get the latest content and features.
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;