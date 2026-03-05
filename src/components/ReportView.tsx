"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Trophy, TrendingUp, User, 
  CheckCircle2, Sparkles, Languages, AlertCircle, Map, ChevronRight, Award
} from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRtl = lang === 'ar';

  // --- 智能解析引擎：专门针对“换行式”文本进行匹配 ---
  const report = useMemo(() => {
    const text = (student.reportContent || "")
      .replace(/&nbsp;/g, ' ')
      .replace(/\r\n/g, '\n');

    // 1. 提取 Summary (Dear 之后的第一段)
    const summaryMatch = text.match(/Dear.*?\n\n?([\s\S]*?)\n/);
    
    // 2. 提取 Transformation (Before & After) - 针对你的换行格式优化
    const extractSection = (categoryName: string) => {
      // 匹配类别名称后，提取紧随其后的两段文字
      const regex = new RegExp(`${categoryName}[\\s\\S]*?\\n([\\s\\S]*?)\\n\\n?([\\s\\S]*?)\\n`, 'i');
      const match = text.match(regex);
      return { 
        start: match?.[1]?.trim() || "Initial progress", 
        now: match?.[2]?.trim() || "Improved performance" 
      };
    };

    return {
      summary: summaryMatch?.[1] || "Congratulations on your progress!",
      transformation: [
        { category: "Vocabulary", ...extractSection("Vocabulary") },
        { category: "Sentence Structure", ...extractSection("Sentence Structure") },
        { category: "Conversational Flow", ...extractSection("Conversational Flow") }
      ],
      encouragement: text.split(/✨ Final Encouragement/i)[1]?.split(/\n/)[1]?.trim() || "I am incredibly proud of you!"
    };
  }, [student.reportContent]);

  const t = (en: string, ar: string) => isRtl ? ar : en;

  return (
    <div className={`min-h-screen bg-[#F6F6F6] selection:bg-[#26B7FF]/30 ${isRtl ? 'rtl text-right font-arabic' : 'text-left font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 顶部导航 - 完美复刻参考样式 */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1140px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all">
               <ArrowLeft className={`w-6 h-6 text-[#26B7FF] ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white shadow-lg">
                <Trophy size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#333333]">
                Milestone<span className="text-[#26B7FF]">Report</span>
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 bg-[#26B7FF] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-[#26B7FF]/20 hover:scale-105 transition-transform"
          >
            <Languages size={18} />
            <span>{isRtl ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </nav>

      <main className="max-w-[1140px] mx-auto px-6 py-16 space-y-24">
        
        {/* Hero Section - 带有黄色星星和斜体 Summary */}
        <section className="text-center space-y-8">
          <div className="inline-block px-4 py-1.5 bg-[#FDE700] rounded-full text-[12px] font-bold tracking-widest uppercase text-[#333333]">
            LEARNING MILESTONE REPORT
          </div>
          <h1 className="text-[36px] md:text-[48px] font-extrabold text-[#333333] leading-tight">
             {student.name}{isRtl ? ' تقرير إنجاز' : "'s Milestone Report"}
          </h1>
          
          <div className="max-w-4xl mx-auto bg-white p-10 rounded-[32px] shadow-card relative overflow-hidden text-start border border-gray-100">
             <div className="flex items-start gap-6 relative z-10">
                <div className="p-3 bg-[#FDE700]/10 rounded-2xl shrink-0">
                  <Sparkles className="text-[#FDE700]" size={32} />
                </div>
                <p className="text-xl md:text-2xl text-[#666666] leading-relaxed font-medium italic opacity-90">
                  "{report.summary}"
                </p>
             </div>
             <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-50/50 rounded-full" />
          </div>
        </section>

        {/* Transformation 区 - 横向长条对比卡片 (精准填入数据) */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#26B7FF]/10 rounded-2xl flex items-center justify-center text-[#26B7FF]">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-[28px] font-bold text-[#333333]">{t("The Transformation", "التحول: قبل وبعد")}</h2>
          </div>

          <div className="grid gap-6">
            {report.transformation.map((item, i) => (
              <div key={i} className="bg-white p-4 md:p-8 rounded-[24px] shadow-card grid grid-cols-1 md:grid-cols-10 items-center gap-6 border border-white hover:border-[#26B7FF]/10 transition-all group">
                <div className="md:col-span-2 space-y-1">
                  <span className="text-[10px] font-bold text-[#26B7FF] uppercase tracking-[2px]">CATEGORY</span>
                  <p className="text-xl font-bold text-[#333333]">{t(item.category, item.category === 'Vocabulary' ? 'المفردات' : item.category === 'Sentence Structure' ? 'بنية الجملة' : 'تدفق المحادثة')}</p>
                </div>
                
                <div className="md:col-span-4 bg-[#F6F6F6] p-5 rounded-2xl space-y-1 shadow-inner border border-black/5">
                  <span className="text-[10px] font-bold text-[#666666] uppercase">START</span>
                  <div className="text-[15px] text-[#666666] font-medium leading-relaxed">{item.start}</div>
                </div>

                <div className="md:col-span-4 bg-[#26B7FF]/5 p-5 rounded-2xl space-y-1 border border-[#26B7FF]/10 group-hover:bg-[#26B7FF]/10 transition-colors">
                  <span className="text-[10px] font-bold text-[#26B7FF] uppercase">NOW</span>
                  <div className="text-[15px] font-bold text-[#26B7FF] leading-relaxed">🚀 {item.now}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gap Analysis - 复刻全黑视觉区 */}
        <section className="bg-[#282828] text-white rounded-[40px] p-8 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#26B7FF]/20 blur-[120px] rounded-full -mr-40 -mt-40 opacity-50" />
          <div className="relative z-10 space-y-16">
            <div className="space-y-4 max-w-2xl text-start">
              <div className="flex items-center gap-4 text-[#FDE700]">
                <AlertCircle size={36} />
                <h2 className="text-3xl md:text-4xl font-bold">{t("The 'Gap' Analysis", "تحليل الفجوة")}</h2>
              </div>
              <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed opacity-80">
                While your intuition is great, our deep analysis shows specific 'Gaps' that are holding you back.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-start">
              {[
                { t: "Phonics & Pronunciation", d: "Struggling with vowel sounds and silent letters." },
                { t: "Reading Comprehension", d: "Decoding word-by-word instead of context." },
                { t: "Literal Translation", d: "Building sentences in Arabic first slows flow." }
              ].map((point, idx) => (
                <div key={idx} className="space-y-6 group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-[#FDE700] text-xl group-hover:bg-[#FDE700] group-hover:text-[#282828] transition-all duration-500">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">{t(point.t, "")}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{t(point.d, "")}</p>
                  <div className="h-0.5 w-12 bg-[#FDE700]/30 group-hover:w-full transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap - 顶部黄色粗边框卡片 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#FDE700]/10 rounded-2xl flex items-center justify-center text-[#333333] border border-[#FDE700]/20 shadow-inner">
              <Map size={24} />
            </div>
            <h2 className="text-[28px] font-bold text-[#333333]">{t("Custom Roadmap", "خارطة الطريق التعليمية")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { phase: "Phase 1: Foundation Repair", module: "[A0] Knowledge: Language Foundation", why: "Fixes sounds and silent letters to build speed." },
              { phase: "Phase 2: Level Up", module: "[A1] Skills: Text Analysis", why: "Forces context understanding without translation." }
            ].map((p, idx) => (
              <div key={idx} className="bg-white p-8 md:p-12 rounded-[32px] shadow-card border-t-[10px] border-[#FDE700] space-y-8 group hover:-translate-y-2 transition-all">
                <div className="space-y-2 text-start">
                  <h3 className="text-[#26B7FF] font-bold uppercase tracking-[2px] text-xs">{t(p.phase, "")}</h3>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#333333]">{t(p.module, "")}</p>
                </div>
                <div className="flex gap-4 text-start">
                  <div className="w-6 h-6 bg-[#26B7FF]/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="text-[#26B7FF]" size={16} />
                  </div>
                  <p className="text-[#666666] text-lg leading-relaxed italic opacity-80">{t(p.why, "")}</p>
                </div>
                <button className="w-full py-4 rounded-full border-2 border-[#26B7FF] text-[#26B7FF] font-bold hover:bg-[#26B7FF] hover:text-white transition-all">
                   {t("Module Details", "تفاصيل الوحدة")}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Card - 亮蓝色背景激励 */}
        <section className="text-center p-12 md:p-24 bg-[#26B7FF] rounded-[48px] text-white space-y-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 blur-[100px] rounded-full -ml-32 -mt-32" />
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:rotate-12 transition-transform duration-500">
            <Sparkles size={40} className="text-[#FDE700]" />
          </div>
          <h2 className="text-2xl md:text-[32px] font-bold max-w-3xl mx-auto leading-relaxed italic opacity-95">
             "{report.encouragement}"
          </h2>
          <div className="inline-block px-12 py-4 bg-[#FDE700] text-[#333333] rounded-full font-black text-lg shadow-2xl shadow-black/20 transform hover:scale-105 transition-all">
            EXCELLENT PROGRESS
          </div>
        </section>

      </main>

      <footer className="bg-white border-t border-black/5 py-12 text-center text-sm font-bold text-[#666666] tracking-[1px] uppercase">
        © 2026 SS-Milestone-Report. All Rights Reserved.
      </footer>
    </div>
  );
}
