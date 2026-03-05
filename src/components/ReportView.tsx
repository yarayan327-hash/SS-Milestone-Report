"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, TrendingUp, User, AlertTriangle, Map, GraduationCap } from 'lucide-react';

interface ReportViewProps {
  student: {
    name: string;
    studentId: string;
    reportContent: string;
  };
}

export default function ReportView({ student }: ReportViewProps) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: "Learning Milestone Report",
      gapTitle: "The Gap Analysis",
      roadmapTitle: "Learning Roadmap",
      encouragement: "Ziad, you have a brilliant language intuition. Do not let the habit of Arabic translation slow down your bright mind."
    },
    ar: {
      title: "تقرير إنجاز تعلم زياد",
      gapTitle: "تحليل الفجوة",
      roadmapTitle: "خارطة الطريق التعليمية",
      encouragement: "زياد، أنت تمتلك حدساً لغوياً رائعاً. لا تدع عادة الترجمة العربية تبطئ عقلك اللامع."
    }
  }[lang];

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#333333] pb-20 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-[1140px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className={`w-6 h-6 text-[#26B7FF] ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white shadow-sm">
                <GraduationCap size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">{student.name}</h1>
                <p className="text-[12px] text-[#666666]">ID: {student.studentId}</p>
              </div>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="px-5 py-2 border-2 border-[#26B7FF] text-[#26B7FF] rounded-[50px] font-semibold text-sm hover:bg-[#26B7FF] hover:text-white transition-all">
            {isRtl ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      <main className="max-w-[1140px] mx-auto px-6 pt-10 space-y-16">
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1 bg-[#FDE700] rounded-full text-[14px] font-bold uppercase tracking-tight">Executive Summary</div>
          <h2 className="text-[32px] sm:text-[41px] font-bold leading-tight">{t.title}</h2>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-50">
                <Award className="text-[#26B7FF] mx-auto mb-4" />
                <h4 className="font-bold text-xl">{isRtl ? 'المفردات' : 'Vocabulary'}</h4>
                <div className="h-1.5 bg-gray-100 rounded-full my-4"><div className="h-full bg-[#26B7FF] w-[90%] rounded-full"></div></div>
                <p className="text-[#26B7FF] font-bold">🚀 {isRtl ? 'متقدمة' : 'Advanced'}</p>
            </div>
            {/* ... 重复结构用于 Grammar 和 Flow */}
        </div>

        <section className="bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-gray-50 prose prose-slate max-w-none">
          <div className="whitespace-pre-wrap text-[#333333] leading-relaxed">
            {student.reportContent}
          </div>
        </section>

        <footer className="bg-[#333333] text-white p-12 rounded-[32px] text-center">
          <h3 className="text-[24px] font-bold mb-4">Final Encouragement</h3>
          <p className="max-w-2xl mx-auto text-[#CCCCCC] mb-8">{t.encouragement}</p>
          <div className="inline-flex items-center gap-2 text-[#FDE700] font-bold px-6 py-3 border border-[#FDE700]/30 rounded-2xl">
            <Award size={20} />
            <span>EXCELLENT PROGRESS</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
