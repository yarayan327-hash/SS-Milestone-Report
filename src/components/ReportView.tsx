'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  GraduationCap, 
  BookOpen, 
  Puzzle, 
  PenTool, 
  AlertTriangle, 
  ArrowLeft,
  Globe
} from 'lucide-react';
import { Language, StudentReport } from '@/types';

// --- Icon Mapping ---
const Icons = {
  ChevronDown,
  GraduationCap,
  Book: BookOpen,
  Puzzle,
  Pencil: PenTool,
  Warning: AlertTriangle,
  Logo: GraduationCap // Using Cap as logo placeholder
};

// --- Accordion Component ---
interface AccordionProps {
  children: React.ReactNode;
  details: string;
  lang: Language;
  variant?: 'blue' | 'yellow';
  viewDetailsLabel: string;
  hideDetailsLabel: string;
}

const Accordion: React.FC<AccordionProps> = ({ 
  children, 
  details, 
  lang, 
  variant = 'blue',
  viewDetailsLabel,
  hideDetailsLabel
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary/10' : ''}`}>
      <div className="p-6">
        {children}
        
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-6 pt-6 border-t border-gray-50' : 'max-h-0 opacity-0'}`}
        >
          <div className="space-y-3">
             <div className={`text-xs font-bold uppercase tracking-wider ${variant === 'blue' ? 'text-primary' : 'text-text-main'}`}>
               {lang === 'en' ? 'Detailed Insight' : 'تفاصيل إضافية'}
             </div>
             <p className="text-text-secondary leading-relaxed italic text-sm">
               {details}
             </p>
          </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className={`mt-4 w-full group flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            variant === 'blue' 
              ? 'bg-primary/5 text-primary hover:bg-primary/10' 
              : 'bg-accent/10 text-text-main hover:bg-accent/20'
          }`}
        >
          <span>{isExpanded ? hideDetailsLabel : viewDetailsLabel}</span>
          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
             <Icons.ChevronDown size={16} />
          </div>
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---
interface Props {
  studentName: string;
  studentId: string;
  date: string;
}

export default function ReportView({ studentName, studentId, date }: Props) {
  const [lang, setLang] = useState<Language>('en');

  // ⚠️ NOTE: Since your DB has Markdown but this UI needs JSON, 
  // we use this mock data populated with the real Student Name.
  // In the future, you should update Gemini to output this JSON structure.
  const reportData: StudentReport['en'] = {
    student: studentName,
    level: "A2 → B1",
    summary: "Congratulations on completing this significant chapter! You have evolved from a student relying on translation to a confident learner asking about complex rules. You are no longer just 'learning words'; you are building the architecture of the language.",
    transformation: {
      title: "The Transformation",
      items: [
        {
          type: "vocab",
          label: "Vocabulary",
          summaryText: "From Basic 'Food' to Academic 'Cuisine'",
          details: "You moved from generic terms like 'Shop' and 'Pants' to precise British English terms like 'Chemist' and 'Trousers'. Your vocabulary score increased by 40%."
        },
        {
          type: "grammar",
          label: "Grammar",
          summaryText: "Mastering Complex Tenses",
          details: "You successfully transitioned from simple present tense to using Past Continuous naturally. E.g., 'I was working' instead of 'I work yesterday'."
        },
        {
          type: "writing",
          label: "Writing",
          summaryText: "Structured Formal Communication",
          details: "Your emails have shifted from casual text-speak to professional formats, correctly using salutations and sign-offs."
        }
      ]
    },
    gapAnalysis: {
      title: "Gap Analysis",
      summary: "While your progress is excellent, three critical risks remain that could hinder B1 fluency.",
      items: [
        {
          label: "Phonics & Pronunciation",
          desc: "Confusion between Hard/Soft G & C sounds.",
          risk: "High Risk",
          details: "You still say 'Gym' with a hard G. This requires immediate drill practice to prevent it from fossilizing."
        },
        {
          label: "Listening Speed",
          desc: "Difficulty processing fast native speech.",
          risk: "Medium Risk",
          details: "You often ask for repetition when the speaker uses contractions (e.g., 'gonna', 'wanna')."
        }
      ]
    },
    roadmap: {
      title: "Roadmap: Next 20 Sessions",
      phases: [
        {
          phase: "01",
          title: "Phonics Repair",
          desc: "Sessions 1-10: Rapid Fire Drills",
          visual: "Repair Phase",
          details: "We will focus exclusively on correcting the Hard/Soft G sounds and 'Th' pronunciation through high-repetition drills."
        },
        {
          phase: "02",
          title: "Academic Context",
          desc: "Sessions 11-20: Context Clues",
          visual: "Growth Phase",
          details: "We will introduce BBC news articles to practice extracting meaning from complex text without using a dictionary."
        }
      ]
    },
    cta: "Start B1 Level",
    viewDetails: "View Details",
    hideDetails: "Hide Details"
  };

  // Arabic Mock Data
  const reportDataAr: StudentReport['ar'] = {
    ...reportData,
    summary: "تهانينا لإكمال هذا الفصل المهم! لقد تطورت من طالب يعتمد على الترجمة إلى متعلم واثق يسأل عن قواعد معقدة. أنت الآن تبني هيكل اللغة.",
    cta: "ابدأ المستوى B1",
    viewDetails: "عرض التفاصيل",
    hideDetails: "إخفاء التفاصيل"
  };

  const data = lang === 'en' ? reportData : reportDataAr;
  const isRtl = lang === 'ar';
  const toggleLang = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'));

  return (
    <div 
      className={`min-h-screen bg-[#F6F6F6] pb-32 transition-all duration-300 font-sans ${isRtl ? 'arabic-text' : ''}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-text-secondary">
              <ArrowLeft size={20} className={isRtl ? 'rotate-180' : ''} />
            </Link>
            <span className="font-bold text-text-main text-lg hidden md:block">Lumina Analytics</span>
          </div>
          
          <button 
            onClick={toggleLang}
            className="relative w-24 h-10 bg-gray-100 rounded-full p-1 flex items-center transition-colors hover:bg-gray-200"
          >
            <div 
              className={`absolute top-1 w-11 h-8 bg-white rounded-full shadow-md transition-all duration-300 transform ${isRtl ? 'translate-x-0' : 'translate-x-11 rtl:-translate-x-11'}`}
            />
            <span className={`relative z-10 flex-1 text-center text-xs font-bold ${isRtl ? 'text-primary' : 'text-gray-400'}`}>عربي</span>
            <span className={`relative z-10 flex-1 text-center text-xs font-bold ${!isRtl ? 'text-primary' : 'text-gray-400'}`}>EN</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-8 space-y-12">
        
        {/* Section 1: Hero */}
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#4FB5FF] to-[#26B7FF] p-8 md:p-12 shadow-lg text-white">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-4 py-1 bg-accent text-text-main font-bold text-xs rounded-full uppercase tracking-widest mb-6 shadow-md">
              {data.level} Transition
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              {data.student}
            </h1>
            <p className="text-lg text-blue-50 leading-relaxed font-medium opacity-95">
              {data.summary}
            </p>
          </div>
          {/* Decorative Background Icons */}
          <div className="absolute top-1/2 -right-12 -translate-y-1/2 opacity-10 rotate-12">
            <Icons.GraduationCap size={300} />
          </div>
        </section>

        {/* Section 2: Transformation */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-8 w-1.5 bg-primary rounded-full" />
             <h2 className="text-2xl font-bold text-text-main">{data.transformation.title}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.transformation.items.map((item, idx) => {
              const Icon = item.type === 'vocab' ? Icons.Book : item.type === 'grammar' ? Icons.Puzzle : Icons.Pencil;
              return (
                <Accordion 
                  key={idx} 
                  details={item.details} 
                  lang={lang}
                  viewDetailsLabel={data.viewDetails}
                  hideDetailsLabel={data.hideDetails}
                >
                  <div className="mb-4 bg-primary/10 text-primary w-14 h-14 rounded-2xl flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-text-main">{item.label}</h3>
                  <p className="text-sm text-text-secondary font-medium">
                    {item.summaryText}
                  </p>
                </Accordion>
              );
            })}
          </div>
        </section>

        {/* Section 3: Gap Analysis */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-8 w-1.5 bg-accent rounded-full" />
             <h2 className="text-2xl font-bold text-text-main">{data.gapAnalysis.title}</h2>
          </div>
          
          <p className="text-lg font-bold text-text-main bg-yellow-50 p-6 rounded-xl border-l-4 border-accent rtl:border-l-0 rtl:border-r-4">
            {data.gapAnalysis.summary}
          </p>

          <div className="space-y-4">
            {data.gapAnalysis.items.map((item, idx) => (
              <Accordion 
                key={idx} 
                details={item.details} 
                lang={lang} 
                variant="yellow"
                viewDetailsLabel={data.viewDetails}
                hideDetailsLabel={data.hideDetails}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-accent/20 text-yellow-800 p-2 rounded-lg">
                      <Icons.Warning size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-text-main">{item.label}</h4>
                      <p className="text-text-secondary text-sm">{item.desc}</p>
                    </div>
                  </div>
                  <div className="bg-text-main px-4 py-2 rounded-full text-xs font-bold text-accent self-start md:self-center uppercase tracking-wider">
                    {item.risk}
                  </div>
                </div>
              </Accordion>
            ))}
          </div>
        </section>

        {/* Section 4: Roadmap */}
        <section className="space-y-10">
          <div className="flex items-center gap-3">
             <div className="h-8 w-1.5 bg-primary rounded-full" />
             <h2 className="text-2xl font-bold text-text-main">{data.roadmap.title}</h2>
          </div>

          <div className="relative ps-8 md:ps-12">
            {/* Timeline Line */}
            <div className="absolute top-0 bottom-0 left-4 md:left-6 w-0.5 bg-gray-200 -translate-x-1/2 rtl:right-4 rtl:md:right-6 rtl:left-auto rtl:translate-x-1/2" />
            
            <div className="space-y-12">
              {data.roadmap.phases.map((phase, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline Node */}
                  <div className="absolute -left-4 md:-left-6 top-6 w-10 h-10 bg-white border-4 border-primary rounded-full flex items-center justify-center -translate-x-1/2 z-10 shadow-sm rtl:-right-4 rtl:md:-right-6 rtl:left-auto rtl:translate-x-1/2">
                    <span className="text-primary font-bold text-xs">{phase.phase}</span>
                  </div>

                  <Accordion 
                    details={phase.details} 
                    lang={lang}
                    viewDetailsLabel={data.viewDetails}
                    hideDetailsLabel={data.hideDetails}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold text-primary uppercase tracking-wide">{phase.title}</h4>
                        <p className="text-text-secondary font-medium">{phase.desc}</p>
                      </div>
                      <div className="px-6 py-3 bg-blue-50 rounded-xl border border-dashed border-primary/30 text-primary font-bold text-xs text-center uppercase">
                        {phase.visual}
                      </div>
                    </div>
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-6 z-40">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Icons.GraduationCap size={20} />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-widest">{isRtl ? 'الخطوة التالية' : 'Next Step'}</p>
              <p className="font-bold text-text-main">{data.cta}</p>
            </div>
          </div>
          <button className="w-full md:w-auto bg-primary text-white px-10 py-3 rounded-full font-bold shadow-lg shadow-primary/30 hover:brightness-110 hover:-translate-y-0.5 transition-all active:translate-y-0">
            {data.cta}
          </button>
        </div>
      </footer>
    </div>
  );
}