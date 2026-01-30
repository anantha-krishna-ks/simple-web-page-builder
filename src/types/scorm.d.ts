// src/types/scorm.d.ts
interface SCORM_API {
  LMSInitialize: (param: string) => string;
  LMSGetValue: (element: string) => string;
  LMSSetValue: (element: string, value: string) => string;
  LMSCommit: (param: string) => string;
  LMSFinish: (param: string) => string;
  LMSGetLastError: () => string;
  LMSGetErrorString: (errorCode: string) => string;
  LMSGetDiagnostic: (errorCode: string) => string;
  // Add other SCORM API methods as needed
}

declare global {
  interface Window {
    API?: SCORM_API;
    API_1484_11?: SCORM_API; // For SCORM 2004
  }
}