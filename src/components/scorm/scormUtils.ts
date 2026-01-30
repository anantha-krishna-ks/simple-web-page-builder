/**
 * SCORM Utility Functions
 * 
 * This file contains helper functions for working with SCORM in a React application.
 * It provides utilities for SCORM API communication, data handling, and common operations.
 */

/**
 * SCORM Data Model Element Names
 * Standardized names for SCORM data model elements
 */
export const ScormElements = {
  // SCORM 1.2 and 2004 common elements
  SUSPEND_DATA: 'cmi.suspend_data',
  LESSON_LOCATION: 'cmi.core.lesson_location',
  LESSON_STATUS: 'cmi.core.lesson_status',
  TOTAL_TIME: 'cmi.core.total_time',
  EXIT: 'cmi.core.exit',
  COMMENTS: 'cmi.comments',
  
  // SCORM 1.2 specific
  SCORE_RAW: 'cmi.core.score.raw',
  SCORE_MAX: 'cmi.core.score.max',
  
  // SCORM 2004 specific
  PROGRESS_MEASURE: 'cmi.progress_measure',
  COMPLETION_STATUS: 'cmi.completion_status',
  SUCCESS_STATUS: 'cmi.success_status',
  
  // Navigation elements
  ENTRY: 'cmi.core.entry',
  LESSON_MODE: 'cmi.core.lesson_mode',
  
  // Student data
  STUDENT_ID: 'cmi.core.student_id',
  STUDENT_NAME: 'cmi.core.student_name',
  
  // Launch data
  LAUNCH_DATA: 'cmi.launch_data',
  
  // Objectives
  OBJECTIVES_COUNT: 'cmi.objectives._count',
  
  // Interactions
  INTERACTIONS_COUNT: 'cmi.interactions._count',
  
  // Student preference
  AUDIO: 'cmi.student_preference.audio',
  LANGUAGE: 'cmi.student_preference.language',
  SPEED: 'cmi.student_preference.speed',
  TEXT: 'cmi.student_preference.text'
} as const;

/**
 * Injects the SCORM API into the provided window object
 * This is used when the SCORM content is loaded in an iframe
 * and doesn't have access to the parent window's SCORM API
 */
export const injectScormApi = (targetWindow: Window, apiInstance: any): boolean => {
  try {
    // Store the API in the target window
    targetWindow.API = apiInstance;
    
    // Also set the API_1484_11 object for SCORM 2004 compatibility
    targetWindow.API_1484_11 = apiInstance;
    
    return true;
  } catch (error) {
    console.error('Failed to inject SCORM API:', error);
    return false;
  }
};

/**
 * Parses SCORM suspend data string into a JavaScript object
 * @param suspendData The raw suspend data string from SCORM
 * @returns Parsed object or null if invalid
 */
export const parseSuspendData = (suspendData: string | null): Record<string, any> | null => {
  if (!suspendData) return null;
  
  try {
    // Try to parse as JSON first
    if (suspendData.trim().startsWith('{') || suspendData.trim().startsWith('[')) {
      return JSON.parse(suspendData);
    }
    
    // Try to parse as URL-encoded string
    try {
      const decoded = decodeURIComponent(suspendData);
      return JSON.parse(decoded);
    } catch {
      // If URL decoding fails, try to parse as is
      try {
        return JSON.parse(suspendData);
      } catch {
        // If all parsing fails, return as string
        return { data: suspendData };
      }
    }
  } catch (error) {
    console.error('Failed to parse suspend data:', error);
    return null;
  }
};

/**
 * Serializes a JavaScript object into a SCORM-compatible suspend data string
 * @param data The data to serialize
 * @returns String representation of the data
 */
export const serializeSuspendData = (data: any): string => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Failed to serialize suspend data:', error);
    return '';
  }
};

/**
 * Gets a value from the SCORM API with error handling
 * @param api The SCORM API instance
 * @param elementName The SCORM data model element name
 * @param defaultValue Default value if the element is not found
 * @returns The value or default value
 */
export const safeGetValue = <T = any>(
  api: any,
  elementName: string,
  defaultValue: T = null as unknown as T
): T => {
  if (!api) {
    console.warn('SCORM API not available, returning default value');
    return defaultValue;
  }

  if (typeof elementName !== 'string' || !elementName.trim()) {
    console.error('Invalid SCORM element name:', elementName);
    return defaultValue;
  }

  try {
    let value: any;
    if (typeof api.LMSGetValue === 'function') {
      value = api.LMSGetValue(elementName);
    } else if (typeof api.GetValue === 'function') {
      value = api.GetValue(elementName);
    } else {
      console.error('No valid SCORM API methods found');
      return defaultValue;
    }

    const errorCode = api.LMSGetLastError ? 
      api.LMSGetLastError() : 
      (api.GetLastError ? api.GetLastError() : '0');
    
    if (errorCode !== '0') {
      const errorString = api.LMSGetErrorString ? 
        api.LMSGetErrorString(errorCode) : 
        (api.GetErrorString ? api.GetErrorString(errorCode) : `Error ${errorCode}`);
      console.warn(`SCORM Error (${errorCode}): ${errorString} for element ${elementName}`);
      return defaultValue;
    }
    
    return value !== undefined ? value : defaultValue;
  } catch (error) {
    console.error(`Error getting SCORM value for ${elementName}:`, error);
    return defaultValue;
  }
};

/**
 * Sets a value in the SCORM API with error handling
 * @param api The SCORM API instance
 * @param elementName The SCORM data model element name
 * @param value The value to set
 * @returns true if successful, false otherwise
 */
export const safeSetValue = (
  api: any,
  elementName: string,
  value: any
): boolean => {
  if (!api) {
    console.error('SCORM API not available');
    return false;
  }

  try {
    let result;
    if (typeof api.LMSSetValue === 'function') {
      result = api.LMSSetValue(elementName, String(value));
    } else if (typeof api.SetValue === 'function') {
      result = api.SetValue(elementName, String(value));
    } else {
      console.error('No valid SCORM API set methods found');
      return false;
    }

    const errorCode = api.LMSGetLastError ? 
      api.LMSGetLastError() : 
      (api.GetLastError ? api.GetLastError() : '0');
    
    if (errorCode !== '0') {
      const errorString = api.LMSGetErrorString ? 
        api.LMSGetErrorString(errorCode) : 
        (api.GetErrorString ? api.GetErrorString(errorCode) : `Error ${errorCode}`);
      console.error(`SCORM Error (${errorCode}): ${errorString} when setting ${elementName}`);
      return false;
    }

    return result === 'true' || result === true;
  } catch (error) {
    console.error(`Error setting SCORM value for ${elementName}:`, error);
    return false;
  }
};

/**
 * Commits the current SCORM data to the LMS
 * @param api The SCORM API instance
 * @returns true if successful, false otherwise
 */
export const commitScormData = (api: any): boolean => {
  if (!api) {
    console.error('SCORM API not available');
    return false;
  }

  try {
    const result = api.LMSCommit ? 
      api.LMSCommit('') : 
      (api.Commit ? api.Commit('') : false);
    
    if (result === false || result === 'false') {
      const errorCode = api.LMSGetLastError ? 
        api.LMSGetLastError() : 
        (api.GetLastError ? api.GetLastError() : '0');
      
      if (errorCode !== '0') {
        const errorString = api.LMSGetErrorString ? 
          api.LMSGetErrorString(errorCode) : 
          (api.GetErrorString ? api.GetErrorString(errorCode) : `Error ${errorCode}`);
        console.error(`SCORM Commit Error (${errorCode}): ${errorString}`);
      }
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error committing SCORM data:', error);
    return false;
  }
};

/**
 * Initializes the SCORM API connection
 * @param api The SCORM API instance
 * @returns true if successful, false otherwise
 */
export const initializeScorm = (api: any): boolean => {
  if (!api) {
    console.error('SCORM API not available');
    return false;
  }

  try {
    const result = api.LMSInitialize ? 
      api.LMSInitialize('') : 
      (api.Initialize ? api.Initialize('') : false);
    
    if (result === false || result === 'false') {
      const errorCode = api.LMSGetLastError ? 
        api.LMSGetLastError() : 
        (api.GetLastError ? api.GetLastError() : '0');
      
      if (errorCode !== '0') {
        const errorString = api.LMSGetErrorString ? 
          api.LMSGetErrorString(errorCode) : 
          (api.GetErrorString ? api.GetErrorString(errorCode) : `Error ${errorCode}`);
        console.error(`SCORM Initialize Error (${errorCode}): ${errorString}`);
      }
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error initializing SCORM:', error);
    return false;
  }
};

/**
 * Terminates the SCORM API connection
 * @param api The SCORM API instance
 * @returns true if successful, false otherwise
 */
export const terminateScorm = (api: any): boolean => {
  if (!api) {
    console.error('SCORM API not available');
    return false;
  }

  try {
    // Make sure to commit any pending changes
    commitScormData(api);
    
    const result = api.LMSFinish ? 
      api.LMSFinish('') : 
      (api.Terminate ? api.Terminate('') : false);
    
    if (result === false || result === 'false') {
      const errorCode = api.LMSGetLastError ? 
        api.LMSGetLastError() : 
        (api.GetLastError ? api.GetLastError() : '0');
      
      if (errorCode !== '0') {
        const errorString = api.LMSGetErrorString ? 
          api.LMSGetErrorString(errorCode) : 
          (api.GetErrorString ? api.GetErrorString(errorCode) : `Error ${errorCode}`);
        console.error(`SCORM Terminate Error (${errorCode}): ${errorString}`);
      }
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error terminating SCORM:', error);
    return false;
  }
};

/**
 * Validates if a SCORM element name is valid
 * @param elementName The element name to validate
 * @returns true if valid, false otherwise
 */
export const isValidScormElement = (elementName: string): boolean => {
  if (typeof elementName !== 'string' || !elementName.trim()) {
    return false;
  }
  
  // Basic validation - can be extended with more specific rules
  return /^cmi(\.[a-zA-Z0-9_]+)+$/.test(elementName);
};

/**
 * Gets the SCORM version (1.2 or 2004)
 * @param api The SCORM API instance
 * @returns '1.2', '2004', or 'unknown'
 */
export const getScormVersion = (api: any): '1.2' | '2004' | 'unknown' => {
  if (!api) return 'unknown';
  
  if (typeof api.LMSGetValue === 'function') {
    return '1.2';
  } else if (typeof api.GetValue === 'function') {
    return '2004';
  }
  return 'unknown';
};

// Export all utility functions
export default {
  injectScormApi,
  parseSuspendData,
  serializeSuspendData,
  safeGetValue,
  safeSetValue,
  commitScormData,
  initializeScorm,
  terminateScorm,
  isValidScormElement,
  getScormVersion
};