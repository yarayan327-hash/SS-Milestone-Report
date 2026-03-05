"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Trophy, TrendingUp, User, GraduationCap, 
  CheckCircle2, Sparkles, Languages, AlertCircle, Map, ChevronRight, Award
} from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [showFullGap, setShowFullGap] = useState(false); // 控制详情展示
  const isRtl = lang === 'ar';

  // --- 终极解析引擎：基于行扫描，彻底杜绝内容错位 ---
  const reportData = useMemo(() => {
    // 1. 深度清洗数据：移除所有 HTML 标签并统一换行符
    const text = (student.reportContent || "")
      .replace(/<[^>]*>?/gm, '') // 移除所有 <br> 等 HTML 标签
      .replace(/&nbsp;/g, ' ')
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);

    // 2. 查找关键索引定位内容块
    const findIdx = (key: string) => text.findIndex((l: string) => l.toLowerCase().includes(key.toLowerCase()));

    // 提取 Summary (Dear 之后的第一句话)
    const dearIdx = findIdx(isRtl ? 'عزيزي' : 'Dear');
    const summaryText = dearIdx !== -1 ? text[dearIdx + 1] : "Congratulations on your progress!";

    // 提取 Transformation 数据 (通过关键词定位 START 和 NOW 后的完整描述)
    const getTrans = (key: string) => {
      const idx = findIdx(key);
      if (idx === -1) return { start: "Initial progress...", now: "Developing..." };
      
      // 逻辑：在类别名下方扫描，获取 START 分隔符之后的内容
      const startLine = text.slice(idx, idx + 10).find((l: string) => l.includes('|')) || "";
      const parts = startLine.split('|').map((p: string) => p.replace(/\*/g, '').trim());
      
      return {
        start: parts[1] || "Building foundation",
        now: parts[2] || "Advanced application"
      };
    };

    return {
      summary: summaryText,
      transformation: [
        { category: "Vocabulary", ...getTrans("Vocabulary") },
        { category: "Sentence Structure", ...getTrans("Sentence Structure") },
        { category: "Conversational Flow", ...getTrans("Conversational Flow") }
      ],
      encouragement: text.find((l: string) => l.includes('Trust your feelings')) || 
                     text.find((l: string) => l.includes('زياد')) || 
                     "I am incredibly proud of you!"
    };
  }, [student.reportContent, isRtl]);

  const t = (en: string, ar: string) => isRtl ? ar : en;

  return (
    <div className={`min-h-screen bg-[#F6F6F6] selection:bg-[#26B7FF]/30 ${isRtl ? 'rtl text-right font-arabic' : 'text-left font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1140px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all">
               <ArrowLeft className={`w-6 h-6 text-[#26B7FF] ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100 font-sans">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#26B7FF]/20">
                <Trophy size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#333333]">
                Milestone<span className="text-[#26B7FF]">Report</span>
              </span>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="flex items-center gap-2 bg-[#26B7FF] text-white px-6 py-2.5 rounded-full font-semibold hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-[#26B7FF]/20">
            <Languages size={18} />
            <span>{isRtl ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </nav>

      <main className="max-w-[1140px] mx-auto px-6 py-16 space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <div className="inline-block px-4 py-1.5 bg-[#FDE700] rounded-full text-[12px] font-bold tracking-widest uppercase text-[#333333] shadow-sm">
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
                <p className="text-xl md:text-2xl text-[#666666] leading-relaxed font-medium italic opacity-95">
                  "{reportData.summary}"
                </p>
             </div>
             <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-50/50 rounded-full" />
          </div>
        </section>

        {/* Transformation Section - 复刻横向拉伸对比卡片 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#26B7FF]/10 rounded-2xl flex items-center justify-center text-[#26B7FF]">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-[28px] font-bold text-[#333333]">{t("The Transformation", "التحول: قبل وبعد")}</h2>
          </div>

          <div className="grid gap-6">
            {reportData.transformation.map((item, i) => (
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

        {/* Gap Analysis - 实现折叠/展开功能 */}
        <section className="bg-[#282828] text-white rounded-[40px] p-8 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#26B7FF]/20 blur-[120px] rounded-full -mr-40 -mt-40 opacity-50" />
          <div className="relative z-10 space-y-16">
            <div className="flex justify-between items-end gap-6 text-start">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-4 text-[#FDE700]">
                  <AlertCircle size={36} />
                  <h2 className="text-3xl md:text-4xl font-bold">{t("The 'Gap' Analysis", "تحليل الفجوة")}</h2>
                </div>
                <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed opacity-80">
                  {t("Our deep analysis shows specific 'Gaps' holding you back.", "يظهر تحليلنا العميق فجوات محددة تعيق تقدمك.")}
                </p>
              </div>
              <button onClick={() => setShowFullGap(!showFullGap)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-sm font-bold transition-all border border-white/10">
                {showFullGap ? t("Show Less", "عرض أقل") : t("View Details", "عرض التفاصيل")}
              </button>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 text-start transition-all duration-500 ${showFullGap ? 'opacity-100 scale-100' : 'opacity-60 scale-[0.98]'}`}>
              {[
                { t: "Phonics & Pronunciation", d: "Struggling with vowel sounds and silent letters like 'K' in know." },
                { t: "Reading Comprehension", d: "Decoding word-by-word instead of context, forgetting sentence beginnings." },
                { t: "Literal Translation", d: "Building sentences in Arabic first, causing 'Be' verb drops and slow speed." }
              ].map((point, idx) => (
                <div key={idx} className="space-y-6 group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-[#FDE700] text-xl group-hover:bg-[#FDE700] group-hover:text-[#282828] transition-all">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">{t(point.t, "")}</h3>
                  {showFullGap && <p className="text-white/50 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2">{t(point.d, "")}</p>}
                  <div className="h-0.5 w-12 bg-[#FDE700]/30 group-hover:w-full transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#FDE700]/10 rounded-2xl flex items-center justify-center text-[#333333] border border-[#FDE700]/20 shadow-inner">
              <Map size={24} />
            </div>
            <h2 className="text-[28px] font-bold text-[#333333]">{t("Custom Roadmap", "خارطة الطريق التعليمية")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
            {[
              { phase: "PHASE 1", module: "Language Foundation", why: "Fixes sounds confusion and silent letters to build reading speed." },
              { phase: "PHASE 2", module: "Text Analysis", why: "Attacks the comprehension gap using engaging stories and context guessing." }
            ].map((p, idx) => (
              <div key={idx} className="bg-white p-8 md:p-12 rounded-[32px] shadow-card border-t-[10px] border-[#FDE700] space-y-8 group hover:-translate-y-2 transition-all">
                <div className="space-y-2">
                  <h3 className="text-[#26B7FF] font-bold uppercase tracking-[2px] text-xs">{p.phase}</h3>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#333333]">{p.module}</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-[#26B7FF]/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="text-[#26B7FF]" size={16} />
                  </div>
                  <p className="text-[#666666] text-lg leading-relaxed italic opacity-80">{p.why}</p>
                </div>
                <button className="w-full py-4 rounded-full border-2 border-[#26B7FF] text-[#26B7FF] font-bold hover:bg-[#26B7FF] hover:text-white transition-all flex items-center justify-center gap-3">
                   {t("Module Details", "تفاصيل الوحدة")}
                   <ChevronRight size={18} className={`${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Encouragement */}
        <section className="text-center p-12 md:p-24 bg-[#26B7FF] rounded-[48px] text-white space-y-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 blur-[100px] rounded-full -ml-32 -mt-32" />
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:rotate-12 transition-transform duration-500">
            <Sparkles size={40} className="text-[#FDE700]" />
          </div>
          <h2 className="text-2xl md:text-[32px] font-bold max-w-3xl mx-auto leading-relaxed italic opacity-95">
             "{reportData.encouragement}"
          </h2>
          <div className="inline-block px-12 py-4 bg-[#FDE700] text-[#333333] rounded-full font-black text-lg shadow-2xl shadow-black/20 transform hover:scale-105 transition-all">
            EXCELLENT PROGRESS
          </div>
        </section>

      </main>
    </div>
  );
}
