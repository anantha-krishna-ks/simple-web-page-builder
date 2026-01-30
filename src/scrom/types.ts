export type ScormBoolean = "true" | "false";

export interface ScormAPIInterface {
  LMSInitialize(param?: string): ScormBoolean;
  LMSFinish(param?: string): ScormBoolean;
  LMSGetValue(element: string): string;
  LMSSetValue(element: string, value: string): ScormBoolean;
  LMSCommit(param?: string): ScormBoolean;
  LMSGetLastError(): string;
  LMSGetErrorString(code: string): string;
  LMSGetDiagnostic(code?: string): string;
}