"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Trophy, TrendingUp, User, GraduationCap, 
  CheckCircle2, Sparkles, Languages, AlertCircle, Map, ChevronRight, Award
} from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRtl = lang === 'ar';

  // --- 智能解析引擎：将混乱的长文本拆解为模板 UI 结构 ---
  const report = useMemo(() => {
    const text = (student.reportContent || "")
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/&nbsp;/g, ' ');

    // 1. 提取 Summary
    const summaryMatch = text.match(/Dear.*?\n(.*?)\n/s);
    
    // 2. 提取 Transformation (Before & After)
    const extractTrans = (cat: string) => {
      const regex = new RegExp(`${cat}.*?\\|\\s*(.*?)\\s*\\|\\s*(.*?)\\n`, 'i');
      const match = text.match(regex);
      return { 
        start: match?.[1]?.replace(/\*/g, '') || "Initial Stage", 
        now: match?.[2]?.replace(/\*/g, '') || "Improving" 
      };
    };

    return {
      summary: summaryMatch?.[1] || "Congratulations on your progress!",
      transformation: [
        { category: "Vocabulary", ...extractTrans("Vocabulary") },
        { category: "Sentence Structure", ...extractTrans("Sentence Structure") },
        { category: "Conversational Flow", ...extractTrans("Conversational Flow") }
      ]
    };
  }, [student.reportContent]);

  const t = (en: string, ar: string) => isRtl ? ar : en;

  return (
    <div className={`min-h-screen bg-bg-secondary selection:bg-primary-blue/30 ${isRtl ? 'rtl text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 顶部导航 - 完美复刻 Screenshot 1.59.54 PM */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1140px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all">
               <ArrowLeft className={`w-6 h-6 text-primary-blue ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100">
              <div className="w-10 h-10 bg-primary-blue rounded-xl flex items-center justify-center text-white shadow-lg">
                <Trophy size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-text-primary">
                Milestone<span className="text-primary-blue">Report</span>
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 bg-primary-blue text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary-blue/20 hover:scale-105 transition-transform"
          >
            <Languages size={18} />
            <span>{isRtl ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </nav>

      <main className="max-w-[1140px] mx-auto px-6 py-16 space-y-24">
        
        {/* Hero Section - 完美复刻 Screenshot 2.19.24 PM */}
        <section className="text-center space-y-8">
          <div className="inline-block px-4 py-1.5 bg-accent-yellow rounded-full text-[12px] font-bold tracking-widest uppercase text-text-primary shadow-sm">
            LEARNING MILESTONE REPORT
          </div>
          <h1 className="text-[36px] md:text-[48px] font-extrabold text-text-primary leading-tight">
            {student.name}{isRtl ? ' تقرير إنجاز' : "'s Milestone Report"}
          </h1>
          
          <div className="max-w-4xl mx-auto bg-white p-10 rounded-[32px] shadow-card relative overflow-hidden text-start group border border-gray-50">
             <div className="flex items-start gap-6 relative z-10">
                <div className="p-3 bg-accent-yellow/10 rounded-2xl shrink-0">
                  <Sparkles className="text-accent-yellow" size={32} />
                </div>
                <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-medium italic opacity-90">
                  "{report.summary}"
                </p>
             </div>
             <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-50/50 rounded-full transition-transform duration-1000 group-hover:scale-110" />
          </div>
        </section>

        {/* Transformation 区 - 复刻横向对比长卡片 Screenshot 2.31.46 PM */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-primary-blue/10 rounded-2xl flex items-center justify-center text-primary-blue shadow-inner">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-[28px] font-bold text-text-primary">
              {t("The Transformation", "التحول: قبل وبعد")}
            </h2>
          </div>

          <div className="grid gap-6">
            {report.transformation.map((item, i) => (
              <div key={i} className="bg-white p-4 md:p-8 rounded-[24px] shadow-card grid grid-cols-1 md:grid-cols-10 items-center gap-6 border border-white hover:border-primary-blue/10 transition-all group">
                <div className="md:col-span-2 space-y-1">
                  <span className="text-[10px] font-bold text-primary-blue uppercase tracking-[2px]">CATEGORY</span>
                  <p className="text-xl font-bold text-text-primary">{t(item.category, item.category === 'Vocabulary' ? 'المفردات' : item.category === 'Sentence Structure' ? 'بنية الجملة' : 'تدفق المحادثة')}</p>
                </div>
                
                <div className="md:col-span-4 bg-bg-secondary p-5 rounded-2xl space-y-1 shadow-inner border border-black/5">
                  <span className="text-[10px] font-bold text-text-secondary uppercase">START</span>
                  <div className="text-[16px] text-text-secondary font-medium opacity-80">{item.start}</div>
                </div>

                <div className="md:col-span-4 bg-primary-blue/5 p-5 rounded-2xl space-y-1 border border-primary-blue/10 group-hover:bg-primary-blue/10 transition-colors">
                  <span className="text-[10px] font-bold text-primary-blue uppercase">NOW</span>
                  <div className="text-[16px] font-bold text-primary-blue">🚀 {item.now}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gap Analysis - 复刻深色背景区 Screenshot 2.31.52 PM */}
        <section className="bg-[#282828] text-white rounded-[40px] p-8 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-blue/20 blur-[120px] rounded-full -mr-40 -mt-40" />
          <div className="relative z-10 space-y-16">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-4 text-accent-yellow">
                <AlertCircle size={36} />
                <h2 className="text-3xl md:text-4xl font-bold">{t("The 'Gap' Analysis", "تحليل الفجوة")}</h2>
              </div>
              <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed">
                {t("Our analysis shows specific 'Gaps' holding you back. If you pause now, your brain will revert to translation habits.", "يظهر تحليلنا العميق فجوات محددة تعيق تقدمك. إذا توقفت الآن، سيعود عقلك إلى عادات الترجمة.")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1, 2, 3].map((num) => (
                <div key={num} className="space-y-6 group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-accent-yellow text-xl group-hover:bg-accent-yellow group-hover:text-[#282828] transition-all duration-500">
                    0{num}
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                    {num === 1 ? t("Phonics Trap", "فخ النطق") : num === 2 ? t("Understanding Gap", "فجوة الفهم") : t("Translation habit", "عادة الترجمة")}
                  </h3>
                  <div className="h-0.5 w-12 bg-accent-yellow/30 group-hover:w-full transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap - 复刻黄条卡片 Screenshot 2.31.56 PM */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-accent-yellow/10 rounded-2xl flex items-center justify-center text-text-primary shadow-inner border border-accent-yellow/20">
              <Map size={24} />
            </div>
            <h2 className="text-[28px] font-bold text-text-primary">{t("Custom Roadmap", "خارطة الطريق التعليمية")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((phase) => (
              <div key={phase} className="bg-white p-8 md:p-12 rounded-[32px] shadow-card border-t-[10px] border-accent-yellow space-y-8 group hover:-translate-y-2 transition-all">
                <div className="space-y-2">
                  <h3 className="text-primary-blue font-bold uppercase tracking-[2px] text-xs">PHASE {phase}</h3>
                  <p className="text-2xl md:text-3xl font-extrabold text-text-primary">
                    {phase === 1 ? t("[A0] Knowledge: Foundation", "[A0] التأسيس اللغوي") : t("[A1] Skills: Text Analysis", "[A1] تحليل النصوص")}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-primary-blue/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="text-primary-blue" size={16} />
                  </div>
                  <p className="text-text-secondary text-lg leading-relaxed italic opacity-80">
                    {phase === 1 ? t("Fixes sounds confusion and silent letters.", "يصلح الارتباك في الأصوات والحروف الصامتة.") : t("Attacks the comprehension gap using short stories.", "يهاجم فجوة الفهم باستخدام القصص القصيرة.")}
                  </p>
                </div>
                <button className="w-full py-4 rounded-full border-2 border-primary-blue text-primary-blue font-bold hover:bg-primary-blue hover:text-white transition-all flex items-center justify-center gap-3 group/btn">
                   {t("Module Details", "تفاصيل الوحدة")}
                   <ChevronRight className={`transition-transform ${isRtl ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Card - 复刻天蓝色激励 Screenshot 2.32.01 PM */}
        <section className="text-center p-12 md:p-24 bg-primary-blue rounded-[48px] text-white space-y-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 blur-[100px] rounded-full -ml-32 -mt-32 animate-pulse" />
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:rotate-12 transition-transform duration-500">
            <Sparkles size={40} className="text-accent-yellow shadow-sm" />
          </div>
          <h2 className="text-2xl md:text-[32px] font-bold max-w-3xl mx-auto leading-relaxed italic opacity-95">
            "{student.name}, you have a brilliant language intuition. Trust your feelings and let's unlock your true speaking speed!"
          </h2>
          <div className="inline-block px-12 py-4 bg-accent-yellow text-text-primary rounded-full font-black text-lg shadow-2xl shadow-black/20 transform hover:scale-105 transition-all cursor-default">
            EXCELLENT PROGRESS
          </div>
        </section>

      </main>

      <footer className="bg-white border-t border-black/5 py-12 text-center text-sm font-bold text-text-secondary tracking-[1px] uppercase">
        © 2026 SS-Milestone-Report. All Rights Reserved.
      </footer>
    </div>
  );
}
