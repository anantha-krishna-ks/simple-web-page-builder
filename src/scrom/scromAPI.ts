import { defaultCMI, CMIData } from "./dataModel";
import { SCORM_ERRORS } from "./errors";
import { ScormAPIInterface, ScormBoolean } from "./types";

export class ScormAPI implements ScormAPIInterface {
  private initialized = false;
  private terminated = false;
  private lastError = "0";
  private cmi: CMIData;

  constructor() {
    this.cmi = JSON.parse(
      localStorage.getItem("SCORM_CMI") ||
      JSON.stringify(defaultCMI)
    );
  }

  private persist(): void {
    localStorage.setItem("SCORM_CMI", JSON.stringify(this.cmi));
  }

  LMSInitialize(param: string = ""): ScormBoolean {
    if (param !== "") {
      this.lastError = "201";
      return "false";
    }
    if (this.initialized) {
      this.lastError = "101";
      return "false";
    }
    this.initialized = true;
    this.lastError = "0";
    return "true";
  }

  LMSFinish(param: string = ""): ScormBoolean {
    if (!this.initialized) {
      this.lastError = "301";
      return "false";
    }
    this.persist();
    this.initialized = false;
    this.terminated = true;
    this.lastError = "0";
    return "true";
  }

  LMSGetValue(element: string): string {
    if (!this.initialized) {
      this.lastError = "301";
      return "";
    }
    if (!(element in this.cmi)) {
      this.lastError = "401";
      return "";
    }
    this.lastError = "0";
    return String(this.cmi[element] ?? "");
  }

  LMSSetValue(element: string, value: string): ScormBoolean {
    if (!this.initialized) {
      this.lastError = "301";
      return "false";
    }
    if (!(element in this.cmi)) {
      this.lastError = "401";
      return "false";
    }

    this.cmi[element] = value;
    this.lastError = "0";

    // Auto lesson status
    if (element === "cmi.core.score.raw") {
      const mastery = parseInt(
        String(this.cmi["cmi.student_data.mastery_score"])
      );
      if (!isNaN(mastery)) {
        this.cmi["cmi.core.lesson_status"] =
          parseInt(value) >= mastery ? "passed" : "failed";
      }
    }

    return "true";
  }

  LMSCommit(param: string = ""): ScormBoolean {
    if (!this.initialized) {
      this.lastError = "301";
      return "false";
    }
    this.persist();
    this.lastError = "0";
    return "true";
  }

  LMSGetLastError(): string {
    return this.lastError;
  }

  LMSGetErrorString(code: string): string {
    return SCORM_ERRORS[code] || "Unknown error";
  }

  LMSGetDiagnostic(code: string = this.lastError): string {
    return this.LMSGetErrorString(code);
  }
}

export const API = new ScormAPI();