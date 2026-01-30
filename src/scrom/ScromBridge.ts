type ScormBoolean = "true" | "false";

export class ScormBridge {
  private initialized = false;
  private lastError = "0";
  private static readonly ALLOWED_SCORM_12_KEYS = [
    "cmi.core.lesson_status",
    "cmi.core.lesson_location",
    "cmi.core.score.raw",
    "cmi.core.score.min",
    "cmi.core.score.max",
    "cmi.core.total_time",
    "cmi.suspend_data",
    "cmi.core.student_id"
  ];

  constructor(
    private onSetValue: (key: string, value: string) => void,
    private onCommit: () => void
  ) {}

  LMSInitialize(_: string = ""): ScormBoolean {
    this.initialized = true;
    this.lastError = "0";
    return "true";
  }

  LMSFinish(_: string = ""): ScormBoolean {
    this.initialized = false;
    this.onCommit();
    return "true";
  }

  LMSGetValue(_: string): string {
    return "";
  }

  LMSSetValue(element: string, value: string): ScormBoolean {
    if (!this.initialized) {
      this.lastError = "301";
      return "false";
    }

    // 🚫 Ignore SCORM 2004 keys
    if (!ScormBridge.ALLOWED_SCORM_12_KEYS.some(k => element.startsWith(k))) {
      console.warn("[SCORM] Ignored non-1.2 element:", element);
      return "true";
    }

    this.onSetValue(element, value);
    this.lastError = "0";
    return "true";
  }

  LMSCommit(_: string = ""): ScormBoolean {
    this.onCommit();
    return "true";
  }

  LMSGetLastError(): string {
    return this.lastError;
  }

  LMSGetErrorString(code: string): string {
    return code;
  }

  LMSGetDiagnostic(code: string = this.lastError): string {
    return code;
  }
}