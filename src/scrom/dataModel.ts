export interface CMIData {
  [key: string]: string | number;
}

export const defaultCMI: CMIData = {
  "cmi.core.student_id": "",
  "cmi.core.student_name": "",
  "cmi.core.lesson_location": "",
  "cmi.core.credit": "credit",
  "cmi.core.lesson_status": "not attempted",
  "cmi.core.entry": "ab-initio",
  "cmi.core.score.raw": "",
  "cmi.core.score.max": "",
  "cmi.core.score.min": "",
  "cmi.core.total_time": "0000:00:00.00",
  "cmi.core.session_time": "0000:00:00.00",
  "cmi.suspend_data": "",
  "cmi.launch_data": "",
  "cmi.student_data.mastery_score": "",
  "cmi.student_preference.language": "en",
  "cmi.interactions._count": 0,
  "cmi.objectives._count": 0
};