// src/hooks/useScorm.ts
import { useEffect, useState } from 'react';
import { scormService, ScormData } from '../services/scromService';

export const useScorm = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scormData, setScormData] = useState<ScormData>({});

  // Initialize SCORM on mount
  useEffect(() => {
    const initScorm = () => {
      try {
        const success = scormService.initialize();
        if (success) {
          setIsInitialized(true);
          // Load initial SCORM data
          // This would be expanded to load actual data from your LMS
          setScormData({});
        } else {
          const errorCode = scormService.getLastError();
          setError(`SCORM initialization failed: ${scormService.getErrorString(errorCode)}`);
        }
      } catch (error) {
        setError(`Error initializing SCORM: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    initScorm();

    // Clean up on unmount
    return () => {
      if (isInitialized) {
        scormService.terminate();
      }
    };
  }, []);

  // Update a SCORM value
  const setScormValue = (elementName: string, value: string): boolean => {
    if (!isInitialized) {
      setError('SCORM not initialized');
      return false;
    }

    const success = scormService.setValue(elementName, value);
    if (!success) {
      const errorCode = scormService.getLastError();
      setError(`Failed to set SCORM value: ${scormService.getErrorString(errorCode)}`);
    }
    return success;
  };

  // Get a SCORM value
  const getScormValue = (elementName: string): string => {
    if (!isInitialized) {
      setError('SCORM not initialized');
      return '';
    }
    return scormService.getValue(elementName);
  };

  // Save SCORM data
  const saveScormData = (): boolean => {
    if (!isInitialized) {
      setError('SCORM not initialized');
      return false;
    }
    return scormService.commit();
  };

  return {
    isInitialized,
    error,
    scormData,
    setScormValue,
    getScormValue,
    saveScormData,
    terminate: scormService.terminate.bind(scormService)
  };
};