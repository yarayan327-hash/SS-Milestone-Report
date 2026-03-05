export interface MilestoneReport {
  studentName: string;
  studentId: string;
  executiveSummary: { en: string; ar: string; };
  transformation: {
    category: { en: string; ar: string };
    start: { en: string; ar: string };
    now: { en: string; ar: string };
  }[];
  encouragement: { en: string; ar: string; };
}
