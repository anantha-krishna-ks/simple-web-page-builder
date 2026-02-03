import React, { useEffect, useRef, useState } from 'react';
import { useScorm } from './ScormProvider';

interface ScormPlayerProps {
  /**
   * URL to the SCORM package or content to be loaded
   */
  src: string;
  
  /**
   * Callback when SCORM content reports completion
   */
  onComplete?: (data: Record<string, any>) => void;
  
  /**
   * Callback when SCORM encounters an error
   */
  onError?: (error: Error) => void;
  
  /**
   * Additional class names for the container
   */
  className?: string;
  
  /**
   * If true, the player will automatically initialize SCORM when mounted
   */
  autoInitialize?: boolean;
}

/**
 * SCORM Player component that loads and displays SCORM content
 */
const ScormPlayer: React.FC<ScormPlayerProps> = ({
  src,
  onComplete,
  onError,
  className = '',
  autoInitialize = true,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { 
    isInitialized, 
    initializeScorm, 
    terminateScorm, 
    setScormValue, 
    getScormValue, 
    commitScormData 
  } = useScorm();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize SCORM when component mounts if autoInitialize is true
  useEffect(() => {
    if (autoInitialize && !isInitialized) {
      try {
        initializeScorm();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize SCORM');
        setError(error);
        onError?.(error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (isInitialized) {
        try {
          // Try to commit any pending data
          commitScormData();
          // Terminate the SCORM session
          terminateScorm();
        } catch (err) {
          console.error('Error during SCORM cleanup:', err);
        }
      }
    };
  }, [autoInitialize, isInitialized]);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
    
    // Check if we need to inject the SCORM API into the iframe
    if (iframeRef.current?.contentWindow) {
      try {
        // This is where you would inject the SCORM API into the iframe
        // if the content doesn't already have access to it
        // For example:
        // injectScormApi(iframeRef.current.contentWindow);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to inject SCORM API');
        setError(error);
        onError?.(error);
      }
    }
  };

  // Handle errors loading the iframe
  const handleIframeError = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    const error = new Error('Failed to load SCORM content');
    setError(error);
    onError?.(error);
    setIsLoading(false);
  };

  // Listen for SCORM completion events
  useEffect(() => {
    if (!isInitialized) return;

    const checkCompletion = () => {
      try {
        const status = getScormValue('cmi.core.lesson_status');
        if (status === 'passed' || status === 'completed' || status === 'failed') {
          // Get completion data
          const completionData = {
            status,
            score: getScormValue('cmi.core.score.raw'),
            suspendData: getScormValue('cmi.suspend_data'),
            // Add any other data you need
          };
          
          onComplete?.(completionData);
          
          // Commit any final data
          commitScormData();
        }
      } catch (err) {
        console.error('Error checking SCORM completion:', err);
      }
    };

    // Check completion every 5 seconds
    const interval = setInterval(checkCompletion, 5000);
    return () => clearInterval(interval);
  }, [isInitialized, getScormValue, commitScormData, onComplete]);

  // Render loading state
  if (isLoading) {
    return (
      <div className={`scorm-loading ${className}`}>
        <div className="loading-spinner">Loading SCORM content...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`scorm-error ${className}`}>
        <div className="error-message">
          <h3>Error Loading SCORM Content</h3>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Render the SCORM content in an iframe
  return (
    <div className={`scorm-player ${className}`}>
      <iframe
        ref={iframeRef}
        src={src}
        title="SCORM Content"
        className="scorm-iframe"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
};

export default ScormPlayer;
