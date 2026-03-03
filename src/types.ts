export type Language = 'en' | 'ar';

export interface MilestoneData {
  student: string;
  level: string;
  summary: string;
  transformation: {
    title: string;
    items: {
      type: 'vocab' | 'grammar' | 'writing';
      label: string;
      summaryText: string;
      details: string;
    }[];
  };
  gapAnalysis: {
    title: string;
    summary: string;
    items: {
      label: string;
      desc: string;
      risk: string;
      details: string;
    }[];
  };
  roadmap: {
    title: string;
    phases: {
      phase: string;
      title: string;
      desc: string;
      visual: string;
      details: string;
    }[];
  };
  cta: string;
  viewDetails: string;
  hideDetails: string;
}

export interface StudentReport {
  id: string;
  en: MilestoneData;
  ar: MilestoneData;
}