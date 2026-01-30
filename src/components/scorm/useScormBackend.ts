import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface ScormBackendHook {
  isLoading: boolean;
  error: Error | null;
  callScormMethod: (
    method: string, 
    params: Record<string, any>
  ) => Promise<any>;
}

/**
 * Custom hook to handle SCORM API calls to the backend
 * This replaces the direct LMS API calls with HTTP requests to your .NET backend
 */
export const useScormBackend = (): ScormBackendHook => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Base URL for SCORM API endpoints
  const API_BASE_URL = '/ScormCoursePlayer/AjaxMethods.aspx';

  /**
   * Call a SCORM method through the backend
   * @param method - SCORM method name (e.g., 'LMSInitialize', 'LMSSetValue')
   * @param params - Parameters for the method
   */
  const callScormMethod = useCallback(async (
    method: string, 
    params: Record<string, any> = {}
  ): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      // For methods that need to send data to the server
      const isWriteOperation = [
        'LMSSetValue', 
        'LMSCommit', 
        'LMSFinish'
      ].includes(method);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if needed
          // 'Authorization': `Bearer ${token}`
        },
        params: {}
      };

      // For read operations, use query parameters
      if (!isWriteOperation) {
        config.params = { ...params, method };
      }

      // Make the API call
      const response = isWriteOperation
        ? await axios.post(API_BASE_URL, { method, ...params }, config)
        : await axios.get(API_BASE_URL, config);

      // Handle the response
      if (response.data && response.data.success) {
        return response.data.result;
      } else {
        throw new Error(response.data?.error || 'Unknown error');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      console.error(`SCORM ${method} error:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    callScormMethod,
  };
};

/**
 * Wrapper for the SCORM API that uses the backend
 */
export class ScormBackendApi {
  private callScormMethod: (method: string, params?: Record<string, any>) => Promise<any>;

  constructor(callScormMethod: (method: string, params?: Record<string, any>) => Promise<any>) {
    this.callScormMethod = callScormMethod;
  }

  async LMSInitialize(empty: string): Promise<string> {
    return this.callScormMethod('LMSInitialize', { empty });
  }

  async LMSFinish(empty: string): Promise<string> {
    return this.callScormMethod('LMSFinish', { empty });
  }

  async LMSGetValue(element: string): Promise<string> {
    return this.callScormMethod('LMSGetValue', { element });
  }

  async LMSSetValue(element: string, value: string): Promise<string> {
    return this.callScormMethod('LMSSetValue', { element, value });
  }

  async LMSCommit(empty: string): Promise<string> {
    return this.callScormMethod('LMSCommit', { empty });
  }

  async LMSGetLastError(): Promise<string> {
    return this.callScormMethod('LMSGetLastError');
  }

  async LMSGetErrorString(errorCode: string): Promise<string> {
    return this.callScormMethod('LMSGetErrorString', { errorCode });
  }

  async LMSGetDiagnostic(errorCode: string): Promise<string> {
    return this.callScormMethod('LMSGetDiagnostic', { errorCode });
  }
}
