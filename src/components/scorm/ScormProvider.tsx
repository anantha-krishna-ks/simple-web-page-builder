import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';


declare global {
  interface Window {
    API: any; // Consider replacing 'any' with a more specific type
    API_1484_11?: any; // For SCORM 2004 support
  }
}

interface ScormContextType {
  isInitialized: boolean;
  scormData: Record<string, any>;
  initializeScorm: () => void;
  terminateScorm: () => void;
  setScormValue: (key: string, value: any) => void;
  getScormValue: (key: string) => any;
  commitScormData: () => void;
}



const ScormContext = createContext<ScormContextType | null>(null);

export const ScormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [scormData, setScormData] = useState<Record<string, any>>({});
  const [api, setApi] = useState<any>(null);

  // Initialize SCORM API
  const initializeScorm = () => {
    try {
      // Find the API object in the window
      const findAPI = (win: Window): any => {
        if (win.API) return win.API;
        if (win.parent && win.parent !== win) return findAPI(win.parent);
        return null;
      };

      const foundApi = findAPI(window);
      
      if (foundApi) {
        setApi(foundApi);
        foundApi.LMSInitialize('');
        setIsInitialized(true);
        loadScormData();
      } else {
        console.warn('SCORM API not found. Running in demo mode.');
        // In development, we'll use a mock API
        if (process.env.NODE_ENV === 'development') {
          setApi(createMockApi());
          setIsInitialized(true);
        }
      }
    } catch (error) {
      console.error('Error initializing SCORM:', error);
      toast.error('Failed to initialize SCORM');
    }
  };

  // Load SCORM data
  const loadScormData = () => {
    if (!api) return;
    
    const data: Record<string, any> = {};
    // Add common SCORM data model elements you need
    const elements = [
      'cmi.core.student_name',
      'cmi.core.lesson_status',
      'cmi.core.score.raw',
      'cmi.suspend_data'
    ];

    elements.forEach(key => {
      data[key] = api.LMSGetValue(key);
    });

    setScormData(data);
  };

  // Set SCORM value
  const setScormValue = (key: string, value: any) => {
    if (!api || !isInitialized) {
      console.warn('SCORM API not initialized');
      return false;
    }

    try {
      const result = api.LMSSetValue(key, value);
      if (result === 'true') {
        setScormData(prev => ({ ...prev, [key]: value }));
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error setting SCORM value ${key}:`, error);
      return false;
    }
  };

  // Get SCORM value
  const getScormValue = (key: string): any => {
    if (!api || !isInitialized) {
      console.warn('SCORM API not initialized');
      return null;
    }

    try {
      return api.LMSGetValue(key);
    } catch (error) {
      console.error(`Error getting SCORM value ${key}:`, error);
      return null;
    }
  };

  // Commit SCORM data
  const commitScormData = (): boolean => {
    if (!api || !isInitialized) {
      console.warn('SCORM API not initialized');
      return false;
    }

    try {
      return api.LMSCommit('') === 'true';
    } catch (error) {
      console.error('Error committing SCORM data:', error);
      return false;
    }
  };

  // Terminate SCORM session
  const terminateScorm = () => {
    if (!api || !isInitialized) return;

    try {
      // Set completion status if not already set
      if (!getScormValue('cmi.core.lesson_status')) {
        setScormValue('cmi.core.lesson_status', 'completed');
      }
      
      commitScormData();
      api.LMSFinish('');
      setIsInitialized(false);
    } catch (error) {
      console.error('Error terminating SCORM session:', error);
    }
  };

  // Handle window unload
  useEffect(() => {
    const handleUnload = () => {
      if (isInitialized) {
        terminateScorm();
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      if (isInitialized) {
        terminateScorm();
      }
    };
  }, [isInitialized]);

  return (
    <ScormContext.Provider
      value={{
        isInitialized,
        scormData,
        initializeScorm,
        terminateScorm,
        setScormValue,
        getScormValue,
        commitScormData,
      }}
    >
      {children}
    </ScormContext.Provider>
  );
};

// Custom hook to use SCORM context
export const useScorm = (): ScormContextType => {
  const context = useContext(ScormContext);
  if (!context) {
    throw new Error('useScorm must be used within a ScormProvider');
  }
  return context;
};

// Mock API for development
const createMockApi = () => ({
  LMSInitialize: () => 'true',
  LMSFinish: () => 'true',
  LMSGetValue: (key: string) => {
    console.log(`[MOCK] Getting ${key}`);
    return '';
  },
  LMSSetValue: (key: string, value: any) => {
    console.log(`[MOCK] Setting ${key} =`, value);
    return 'true';
  },
  LMSCommit: () => {
    console.log('[MOCK] Committing data');
    return 'true';
  },
  LMSGetLastError: () => '0',
  LMSGetErrorString: (errorCode: string) => `Error ${errorCode}`,
  LMSGetDiagnostic: (errorCode: string) => `Diagnostic for ${errorCode}`,
});
