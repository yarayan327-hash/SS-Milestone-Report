"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, TrendingUp, User, AlertTriangle, Map, GraduationCap } from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: "Learning Milestone Report",
      gapTitle: "The Gap Analysis",
      roadmapTitle: "Learning Roadmap",
    },
    ar: {
      title: "تقرير إنجاز تعلم الطالب",
      gapTitle: "تحليل الفجوة",
      roadmapTitle: "خارطة الطريق التعليمية",
    }
  }[lang];

  return (
    <div className="min-h-screen pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-[1140px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className={`w-6 h-6 text-[#26B7FF] ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white">
                <GraduationCap size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold">{student.name}</h1>
                <p className="text-[12px] text-[#666666]">ID: {student.studentId}</p>
              </div>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="px-5 py-2 border-2 border-[#26B7FF] text-[#26B7FF] rounded-full font-bold text-sm hover:bg-[#26B7FF] hover:text-white transition-all">
            {isRtl ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      <main className="max-w-[1140px] mx-auto px-6 pt-10 space-y-16">
        <section className="text-center space-y-4">
          <div className="inline-block px-4 py-1 bg-[#FDE700] rounded-full text-[14px] font-bold">Executive Summary</div>
          <h2 className="text-[41px] font-bold text-[#333333] leading-tight">{t.title}</h2>
        </section>

        {/* 核心报告内容区 */}
        <section className="bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-gray-50">
          <div className="prose prose-slate max-w-none whitespace-pre-wrap text-[#333333] leading-relaxed text-[16px]">
            {student.reportContent}
          </div>
        </section>

        <footer className="bg-[#333333] text-white p-12 rounded-[32px] text-center shadow-xl">
          <h3 className="text-[24px] font-bold mb-4">Final Encouragement</h3>
          <div className="flex justify-center items-center gap-2 text-[#FDE700] font-bold">
            <Award size={20} />
            <span>EXCELLENT PROGRESS</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
