// src/services/scormService.ts

/**
 * SCORM API Service - A modern TypeScript implementation of the SCORM 1.2 API
 * This service provides a type-safe interface for SCORM 1.2 functionality
 */

// Type definitions
export interface ScormError {
  code: string;
  description: string;
  diagnosticInfo?: string;
}

export interface ScormData {
  [key: string]: any;
}

export interface ScormObjective {
  id: string;
  score_raw?: string;
  score_min?: string;
  score_max?: string;
  status?: string;
}

export interface ScormInteraction {
  id: string;
  type: 'true-false' | 'choice' | 'fill-in' | 'matching' | 'performance' | 'sequencing' | 'likert' | 'numeric';
  student_response?: string;
  result?: 'correct' | 'incorrect' | 'unanticipated' | 'neutral' | 'unknown';
  latency?: string;
  weighting?: string;
  description?: string;
  correct_responses?: string[];
}

export interface ScormStudentData {
  id: string;
  name: string;
  language?: string;
  location?: string;
  score?: {
    raw?: string;
    min?: string;
    max?: string;
  };
  total_time?: string;
  session_time?: string;
  lesson_status?: 'passed' | 'completed' | 'failed' | 'incomplete' | 'browsed' | 'not attempted';
  entry?: 'ab-initio' | 'resume' | '';
  exit?: 'time-out' | 'suspend' | 'logout' | 'normal' | '';
  credit?: 'credit' | 'no-credit';
  mode?: 'browse' | 'normal' | 'review';
}

export class ScormService {
  private static instance: ScormService;
  private isInitialized: boolean = false;
  private errorCode: string = '0';
  private dataModel: Document | null = null;
  private elementValues: ScormData = {};
  private readonly defaultValues: ScormData = {
    'cmi.core.lesson_status': 'not attempted',
    'cmi.core.entry': 'ab-initio',
    'cmi.core.credit': 'credit',
    'cmi.core.lesson_mode': 'normal',
    'cmi.core.student_id': '',
    'cmi.core.student_name': '',
    'cmi.core.score.min': '0',
    'cmi.core.score.max': '100',
    'cmi.student_data.mastery_score': '80'
  };

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): ScormService {
    if (!ScormService.instance) {
      ScormService.instance = new ScormService();
    }
    return ScormService.instance;
  }

  /**
   * Initialize the SCORM API
   * @returns boolean indicating success or failure
   */
  public initialize(): boolean {
    if (this.isInitialized) {
      this.errorCode = '101'; // Already initialized
      return false;
    }

    
    try {
      // Initialize data model
      this.initializeDataModel();
      
      // Set default values
      Object.entries(this.defaultValues).forEach(([key, value]) => {
        this.setValue(key, value);
      });

      this.isInitialized = true;
      this.errorCode = '0';
      return true;
    } catch (error) {
      console.error('SCORM initialization failed:', error);
      this.errorCode = '101'; // General initialization error
      return false;
    }
  }

  /**
   * Get a value from the SCORM data model
   * @param elementName The SCORM element name (e.g., 'cmi.core.lesson_status')
   * @returns The value of the element or empty string if not found
   */
  public getValue(elementName: string): string {
    if (!this.isInitialized) {
      this.errorCode = '301'; // Not initialized
      return '';
    }

    // Validate element name
    if (!this.validateElementName(elementName)) {
      this.errorCode = '201'; // Invalid argument error
      return '';
    }

    // Special handling for specific elements
    if (elementName === 'cmi.core.lesson_status' && !this.elementValues[elementName]) {
      return 'not attempted';
    }

    return this.elementValues[elementName] || '';
  }

  /**
   * Set a value in the SCORM data model
   * @param elementName The SCORM element name
   * @param value The value to set
   * @returns boolean indicating success or failure
   */
  public setValue(elementName: string, value: string): boolean {
    if (!this.isInitialized) {
      this.errorCode = '301'; // Not initialized
      return false;
    }

    // Validate element name and value
    if (!this.validateElementName(elementName) || !this.validateValue(elementName, value)) {
      this.errorCode = '201'; // Invalid argument error
      return false;
    }

    try {
      // Special handling for specific elements
      if (elementName.startsWith('cmi.objectives.')) {
        return this.handleObjectiveUpdate(elementName, value);
      } else if (elementName.startsWith('cmi.interactions.')) {
        return this.handleInteractionUpdate(elementName, value);
      }

      // Update the value
      this.elementValues[elementName] = value;

      // Special handling for score.raw to update lesson status if needed
      if (elementName === 'cmi.core.score.raw') {
        this.handleScoreUpdate(value);
      }

      this.errorCode = '0';
      return true;
    } catch (error) {
      console.error(`Error setting SCORM value ${elementName}:`, error);
      this.errorCode = '101'; // General system error
      return false;
    }
  }

  /**
   * Save the current state to the LMS
   * @returns boolean indicating success or failure
   */
  public commit(): boolean {
    if (!this.isInitialized) {
      this.errorCode = '301'; // Not initialized
      return false;
    }

    try {
      // In a real implementation, this would save to the LMS
      // For now, we'll just log the commit
      console.log('SCORM data committed:', this.elementValues);
      this.errorCode = '0';
      return true;
    } catch (error) {
      console.error('Error committing SCORM data:', error);
      this.errorCode = '101'; // General system error
      return false;
    }
  }

  /**
   * Terminate the SCORM session
   * @returns boolean indicating success or failure
   */
  public terminate(): boolean {
    if (!this.isInitialized) {
      this.errorCode = '301'; // Not initialized
      return false;
    }

    try {
      // Commit any pending changes
      this.commit();
      
      // Clean up
      this.isInitialized = false;
      this.errorCode = '0';
      return true;
    } catch (error) {
      console.error('Error terminating SCORM session:', error);
      this.errorCode = '101'; // General system error
      return false;
    }
  }

  /**
   * Get the last error code
   * @returns The last error code
   */
  public getLastError(): string {
    return this.errorCode;
  }

  /**
   * Get the error string for the given error code
   * @param errorCode The error code
   * @returns The error description
   */
  public getErrorString(errorCode: string): string {
    const errorMap: { [key: string]: string } = {
      '0': 'No error',
      '101': 'General exception',
      '201': 'Invalid argument error',
      '202': 'Element cannot have children',
      '203': 'Element not an array - cannot have count',
      '301': 'Not initialized',
      '401': 'Not implemented error',
      '402': 'Invalid set value, element is a keyword',
      '403': 'Element is read only',
      '404': 'Element is write only',
      '405': 'Incorrect data type',
      '406': 'Data out of range',
      '407': 'Data not found'
    };

    return errorMap[errorCode] || 'Unknown error';
  }

  /**
   * Get diagnostic information for the given error code
   * @param errorCode The error code
   * @returns Diagnostic information
   */
  public getDiagnostic(errorCode: string): string {
    return `SCORM Error ${errorCode}: ${this.getErrorString(errorCode)}`;
  }

  // Private helper methods

  private initializeDataModel(): void {
    // In a real implementation, this would load the SCORM data model
    // For now, we'll just initialize an empty data model
    this.dataModel = document.implementation.createDocument('', '', null);
    this.elementValues = { ...this.defaultValues };
  }

  private validateElementName(elementName: string): boolean {
    if (!elementName || typeof elementName !== 'string') {
      return false;
    }

    // Basic validation - can be expanded based on SCORM 1.2 specification
    return elementName.startsWith('cmi.');
  }

  private validateValue(elementName: string, value: string): boolean {
    // Basic validation - can be expanded based on SCORM 1.2 specification
    if (value === undefined || value === null) {
      return false;
    }

    // Special validation for specific element types
    if (elementName.endsWith('.score.raw') || 
        elementName.endsWith('.score.min') || 
        elementName.endsWith('.score.max')) {
      return this.isValidScore(value);
    }

    if (elementName.endsWith('.lesson_status')) {
      return ['passed', 'completed', 'failed', 'incomplete', 'browsed', 'not attempted'].includes(value);
    }

    return true;
  }

  private isValidScore(score: string): boolean {
    const num = parseFloat(score);
    return !isNaN(num) && isFinite(num);
  }

  private handleScoreUpdate(score: string): void {
    const credit = this.getValue('cmi.core.credit');
    if (credit === 'credit') {
      const masteryScore = parseFloat(this.getValue('cmi.student_data.mastery_score') || '80');
      const rawScore = parseFloat(score);
      
      if (!isNaN(masteryScore) && !isNaN(rawScore)) {
        const newStatus = rawScore >= masteryScore ? 'passed' : 'failed';
        this.setValue('cmi.core.lesson_status', newStatus);
      }
    } else {
      const lessonMode = this.getValue('cmi.core.lesson_mode');
      if (lessonMode === 'browse') {
        this.setValue('cmi.core.lesson_status', 'browsed');
      }
    }
  }

  private handleObjectiveUpdate(elementName: string, value: string): boolean {
    // Implementation for handling objective updates
    // This would include parsing the elementName to get the objective ID and field
    // and updating the appropriate data structure
    console.log(`Objective update: ${elementName} = ${value}`);
    return true;
  }

  private handleInteractionUpdate(elementName: string, value: string): boolean {
    // Implementation for handling interaction updates
    // This would include parsing the elementName to get the interaction ID and field
    // and updating the appropriate data structure
    console.log(`Interaction update: ${elementName} = ${value}`);
    return true;
  }
}

// Export a singleton instance
export const scormService = ScormService.getInstance();