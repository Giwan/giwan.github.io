/**
 * Transition Debugger - Development mode debugging tools for view transitions
 * 
 * This component provides:
 * - Real-time transition status monitoring
 * - Error history display
 * - Performance metrics visualization
 * - Manual fallback controls
 * - Debug information panel
 */

import React, { useState, useEffect } from 'react';
import { transitionErrorHandler, type TransitionError, type DebugInfo } from '../utils/transitionErrorHandler';

interface TransitionDebuggerProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  minimized?: boolean;
}

export const TransitionDebugger: React.FC<TransitionDebuggerProps> = ({
  position = 'bottom-right',
  minimized = true
}) => {
  const [isVisible, setIsVisible] = useState(!minimized);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [errorHistory, setErrorHistory] = useState<TransitionError[]>([]);
  const [isMinimized, setIsMinimized] = useState(minimized);

  // Only render in development mode
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (!isDev) return;

    // Enable debug mode
    transitionErrorHandler.enableDebugMode();

    // Update debug info periodically
    const updateDebugInfo = () => {
      const info = transitionErrorHandler.getDebugInfo();
      setDebugInfo(info);
      setErrorHistory(info.errorHistory);
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);

    // Listen for transition errors
    const handleTransitionError = (event: CustomEvent) => {
      updateDebugInfo();
    };

    document.addEventListener('transition-error', handleTransitionError as EventListener);

    return () => {
      clearInterval(interval);
      document.removeEventListener('transition-error', handleTransitionError as EventListener);
    };
  }, [isDev]);

  if (!isDev || !isVisible) {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const handleClearErrors = () => {
    transitionErrorHandler.clearErrorHistory();
    setErrorHistory([]);
  };

  const handleForceFallback = () => {
    transitionErrorHandler.forceFallback('manual-debug');
  };

  const handleTestErrors = () => {
    transitionErrorHandler.testErrorHandling();
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getErrorTypeColor = (type: TransitionError['type']) => {
    const colors = {
      'api-unsupported': 'text-yellow-600',
      'preparation-failed': 'text-red-600',
      'transition-failed': 'text-red-600',
      'timeout': 'text-orange-600',
      'unknown': 'text-gray-600'
    };
    return colors[type] || 'text-gray-600';
  };

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50 bg-black/90 text-white text-xs font-mono rounded-lg shadow-lg border border-gray-600 max-w-md`}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-600">
        <span className="font-semibold">Transition Debugger</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-3 space-y-3 max-h-96 overflow-y-auto">
          {/* Status */}
          <div>
            <h4 className="font-semibold mb-1">Status</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>API Supported:</span>
                <span className={debugInfo?.apiSupported ? 'text-green-400' : 'text-red-400'}>
                  {debugInfo?.apiSupported ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Path:</span>
                <span className="text-blue-400 truncate max-w-32" title={debugInfo?.currentPath}>
                  {debugInfo?.currentPath}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transition Active:</span>
                <span className={debugInfo?.transitionInProgress ? 'text-yellow-400' : 'text-gray-400'}>
                  {debugInfo?.transitionInProgress ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          {debugInfo?.performanceMetrics && (
            <div>
              <h4 className="font-semibold mb-1">Performance</h4>
              <div className="space-y-1 text-xs">
                {debugInfo.performanceMetrics.frameRate && (
                  <div className="flex justify-between">
                    <span>Frame Rate:</span>
                    <span className={debugInfo.performanceMetrics.frameRate >= 30 ? 'text-green-400' : 'text-red-400'}>
                      {debugInfo.performanceMetrics.frameRate} fps
                    </span>
                  </div>
                )}
                {debugInfo.performanceMetrics.memory && (
                  <div className="flex justify-between">
                    <span>Memory:</span>
                    <span className="text-blue-400">
                      {Math.round(debugInfo.performanceMetrics.memory.used / 1024 / 1024)}MB
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Device Info */}
          {debugInfo?.deviceCapabilities && (
            <div>
              <h4 className="font-semibold mb-1">Device</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>CPU Cores:</span>
                  <span className="text-blue-400">
                    {debugInfo.deviceCapabilities.hardwareConcurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Reduced Motion:</span>
                  <span className={debugInfo.deviceCapabilities.prefersReducedMotion ? 'text-yellow-400' : 'text-gray-400'}>
                    {debugInfo.deviceCapabilities.prefersReducedMotion ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Viewport:</span>
                  <span className="text-blue-400">
                    {debugInfo.deviceCapabilities.viewportSize?.width}×{debugInfo.deviceCapabilities.viewportSize?.height}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error History */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold">Errors ({errorHistory.length})</h4>
              {errorHistory.length > 0 && (
                <button
                  onClick={handleClearErrors}
                  className="px-2 py-1 bg-red-700 hover:bg-red-600 rounded text-xs"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {errorHistory.length === 0 ? (
                <div className="text-gray-400 text-xs">No errors</div>
              ) : (
                errorHistory.slice(-5).reverse().map((error, index) => (
                  <div key={index} className="border border-gray-600 rounded p-2">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold ${getErrorTypeColor(error.type)}`}>
                        {error.type}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {formatTimestamp(error.context?.timestamp || 0)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-300 break-words">
                      {error.message}
                    </div>
                    {error.context?.fromPath && error.context?.toPath && (
                      <div className="text-xs text-blue-400 mt-1">
                        {error.context.fromPath} → {error.context.toPath}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Controls */}
          <div>
            <h4 className="font-semibold mb-1">Controls</h4>
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={handleForceFallback}
                className="px-2 py-1 bg-orange-700 hover:bg-orange-600 rounded text-xs"
              >
                Force Fallback
              </button>
              <button
                onClick={handleTestErrors}
                className="px-2 py-1 bg-purple-700 hover:bg-purple-600 rounded text-xs"
              >
                Test Errors
              </button>
              <button
                onClick={() => console.log('Debug Info:', debugInfo)}
                className="px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded text-xs"
              >
                Log Debug
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized indicator */}
      {isMinimized && (
        <div className="p-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${debugInfo?.apiSupported ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-xs">
              {errorHistory.length > 0 ? `${errorHistory.length} errors` : 'OK'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Floating toggle button for easy access
export const TransitionDebuggerToggle: React.FC = () => {
  const [showDebugger, setShowDebugger] = useState(false);
  const isDev = import.meta.env.DEV;

  if (!isDev) return null;

  return (
    <>
      <button
        onClick={() => setShowDebugger(!showDebugger)}
        className="fixed bottom-4 left-4 z-40 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg font-mono text-xs"
        title="Toggle Transition Debugger"
      >
        🔧
      </button>
      {showDebugger && (
        <TransitionDebugger 
          position="bottom-left" 
          minimized={false}
        />
      )}
    </>
  );
};

export default TransitionDebugger;