"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Trophy, TrendingUp, Sparkles, Languages, 
  AlertCircle, Map, ChevronRight, CheckCircle2 
} from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [showFullGap, setShowFullGap] = useState(false);
  const isRtl = lang === 'ar';

  const reportData = useMemo(() => {
    const raw = student?.reportContent || "";
    // 彻底清洗 HTML 标签，防止干扰解析
    const content = raw.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');

    const extract = (tag: string) => {
      const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)(?=\\[|$)`, 'i');
      return content.match(regex)?.[1]?.trim() || "";
    };

    // 1. Summary: 寻找阿拉伯语问候语起始位置精准切割
    const summaryRaw = extract("SUMMARY");
    const arIndex = summaryRaw.indexOf("عزيزي");
    const summary = arIndex !== -1 
      ? (isRtl ? summaryRaw.substring(arIndex).trim() : summaryRaw.substring(0, arIndex).trim())
      : summaryRaw;

    // 2. Transformation: 结构化提取 START 和 NOW 案例
    const transformation = extract("TRANSFORMATION").split(/Category:/i).filter(Boolean).map((block: string) => {
      const lines = block.trim().split('\n').map((l: string) => l.trim());
      const beforeLine = lines.find((l: string) => l.startsWith('Before:')) || "";
      const afterLine = lines.find((l: string) => l.startsWith('After:')) || "";
      
      const bParts = beforeLine.replace('Before:', '').split('|').map((s: string) => s.trim());
      const aParts = afterLine.replace('After:', '').split('|').map((s: string) => s.trim());

      return {
        category: lines[0] || "Learning",
        beforeTitle: bParts[0] || "",
        beforeSub: bParts[1] || "",
        afterTitle: aParts[0] || "",
        afterSub: aParts[1] || "",
      };
    });

    // 3. Gap: 提取详细描述
    const gaps = extract("GAP").split('\n').filter((l: string) => l.includes('|')).map((line: string) => {
      const p = line.split('|').map((s: string) => s.trim());
      return { id: p[0], title: p[1], desc: p[2] };
    });

    // 4. Roadmap: 修复 Phase/Module 映射错位
    const phases = extract("ROADMAP").split('\n').filter((l: string) => l.includes('|')).map((line: string) => {
      const p = line.split('|').map((s: string) => s.trim());
      return { 
        phaseNum: p[0] || "", 
        phaseName: p[1] || "", 
        moduleName: p[2] || "", 
        whyDesc: p[3] || "" 
      };
    });

    // 5. Encouragement: 精准切割英阿内容
    const encRaw = extract("ENCOURAGEMENT");
    const encArIdx = encRaw.search(/زياد|عزيزي/);
    const encouragement = encArIdx !== -1 
      ? (isRtl ? encRaw.substring(encArIdx).trim() : encRaw.substring(0, encArIdx).trim())
      : encRaw;

    return { summary, transformation, gaps, phases, encouragement };
  }, [student?.reportContent, isRtl]);

  const t = (en: string, ar: string) => isRtl ? ar : en;

  return (
    <div className={`min-h-screen bg-[#F6F6F6] ${isRtl ? 'rtl text-right font-arabic' : 'text-left font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5 h-20 flex items-center">
        <div className="max-w-[1140px] mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
               <ArrowLeft className={`w-6 h-6 text-[#26B7FF] ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100 font-sans text-start">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#26B7FF]/20">
                <Trophy size={24} />
              </div>
              <div>
                <span className="font-bold text-lg block leading-tight text-[#333333]">{student.name}</span>
                <span className="text-xs text-[#666666] font-medium tracking-tight">ID: {student.studentId}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="bg-[#26B7FF] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-[#26B7FF]/20 hover:scale-105 transition-all active:scale-95">
             {isRtl ? 'English' : 'العربية'}
          </button>
        </div>
      </nav>

      <main className="max-w-[1140px] mx-auto px-6 py-16 space-y-24">
        {/* Summary */}
        <section className="text-center space-y-8">
          <div className="inline-block px-4 py-1.5 bg-[#FDE700] rounded-full text-[12px] font-bold uppercase text-[#333333] shadow-sm">LEARNING MILESTONE REPORT</div>
          <h1 className="text-[36px] md:text-[48px] font-extrabold text-[#333333] leading-tight tracking-tight">{student.name}{isRtl ? ' تقرير إنجاز' : "'s Milestone Report"}</h1>
          <div className="max-w-4xl mx-auto bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden text-start">
             <div className="flex items-start gap-6 relative z-10">
                <Sparkles className="text-[#FDE700] shrink-0 mt-1" size={32} />
                <p className="text-xl md:text-2xl text-[#666666] leading-relaxed font-medium italic opacity-95">"{reportData.summary || "Generating..."}"</p>
             </div>
             <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-50/50 rounded-full opacity-30" />
          </div>
        </section>

        {/* Transformation */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#26B7FF]/10 rounded-2xl flex items-center justify-center text-[#26B7FF]"><TrendingUp size={24} /></div>
            <h2 className="text-[28px] font-bold text-[#333333]">{t("The Transformation", "التحول: قبل وبعد")}</h2>
          </div>
          <div className="grid gap-6">
            {reportData.transformation.map((item: any, i: number) => (
              <div key={i} className="bg-white p-8 rounded-[24px] shadow-sm grid grid-cols-1 md:grid-cols-10 items-center gap-6 border border-white transition-all hover:border-[#26B7FF]/20">
                <div className="md:col-span-2 space-y-1">
                  <span className="text-[10px] font-bold text-[#26B7FF] uppercase tracking-[2px]">CATEGORY</span>
                  <p className="text-xl font-bold text-[#333333]">{item.category}</p>
                </div>
                <div className="md:col-span-4 bg-[#F6F6F6] p-6 rounded-2xl">
                  <span className="text-[10px] font-bold text-[#666666] uppercase">START</span>
                  <p className="text-xl font-bold text-[#333333] mt-1 leading-tight">{item.beforeTitle}</p>
                  <p className="text-[14px] text-[#666666] mt-2 whitespace-pre-line leading-relaxed">{item.beforeSub}</p>
                </div>
                <div className="md:col-span-4 bg-[#26B7FF]/5 p-6 rounded-2xl border border-[#26B7FF]/10 shadow-inner">
                  <span className="text-[10px] font-bold text-[#26B7FF] uppercase">NOW</span>
                  <p className="text-xl font-extrabold text-[#26B7FF] mt-1 leading-tight">🚀 {item.afterTitle}</p>
                  <p className="text-[14px] text-[#26B7FF] font-medium mt-2 whitespace-pre-line leading-relaxed">{item.afterSub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gap Analysis */}
        <section className="bg-[#282828] text-white rounded-[40px] p-8 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#26B7FF]/20 blur-[120px] rounded-full opacity-40" />
          <div className="relative z-10 space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-start">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-4 text-[#FDE700]"><AlertCircle size={36} /><h2 className="text-3xl md:text-4xl font-bold">{t("The 'Gap' Analysis", "تحليل الفجوة")}</h2></div>
                <p className="text-white/60 text-lg md:text-xl leading-relaxed opacity-80">{t("Our deep analysis shows specific 'Gaps' holding you back.", "يظهر تحليلنا العميق فجوات محددة تعيق تقدمك.")}</p>
              </div>
              <button onClick={() => setShowFullGap(!showFullGap)} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full text-sm font-bold transition-all border border-white/10 shrink-0">
                {showFullGap ? t("Show Less", "عرض أقل") : t("Show Details", "عرض التفاصيل")}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-start">
              {reportData.gaps.map((gap: any, idx: number) => (
                <div key={idx} className="space-y-6 group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-[#FDE700] text-xl">0{gap.id}</div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide leading-tight">{gap.title}</h3>
                  {showFullGap && <p className="text-white/50 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">{gap.desc}</p>}
                  <div className="h-0.5 w-12 bg-[#FDE700]/30 group-hover:w-full transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#FDE700]/10 rounded-2xl flex items-center justify-center text-[#333333] border border-[#FDE700]/20 shadow-inner"><Map size={24} /></div>
            <h2 className="text-[28px] font-bold text-[#333333]">{t("Custom Learning Roadmap", "خارطة الطريق التعليمية المخصصة")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
            {reportData.phases.map((p: any, idx: number) => (
              <div key={idx} className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border-t-[10px] border-[#FDE700] space-y-8 group transition-all">
                <div className="space-y-2">
                  <h3 className="text-[#26B7FF] font-bold uppercase tracking-[2px] text-xs">{p.phaseNum}</h3>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#333333] leading-tight">{p.phaseName}</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#F6F6F6] p-5 rounded-2xl border-s-4 border-[#26B7FF]">
                    <span className="text-[12px] font-bold text-[#26B7FF] uppercase">Selected Module</span>
                    <p className="text-[#333333] font-extrabold mt-1 text-lg leading-tight">{p.moduleName}</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <CheckCircle2 className="text-[#26B7FF] shrink-0 mt-1" size={20} />
                    <p className="text-[#666666] text-[16px] italic leading-relaxed">{p.whyDesc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Encouragement */}
        <section className="text-center p-12 md:p-24 bg-[#26B7FF] rounded-[48px] text-white space-y-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 blur-[100px] rounded-full -ml-32 -mt-32 opacity-50" />
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:rotate-12 transition-transform duration-500">
            <Sparkles size={40} className="text-[#FDE700]" />
          </div>
          <h2 className="text-2xl md:text-[32px] font-bold max-w-3xl mx-auto leading-relaxed italic opacity-95">
             "{reportData.encouragement || "Unlock your true potential!"}"
          </h2>
          <div className="inline-block px-12 py-4 bg-[#FDE700] text-[#333333] rounded-full font-black text-lg shadow-2xl shadow-black/20 transform hover:scale-105 transition-all uppercase tracking-widest cursor-default">
            {t("Excellent Progress", "إنجاز متميز")}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-black/5 py-12 text-center text-sm font-bold text-[#666666] tracking-[1px] uppercase">
        © 2026 MilestoneReport. All Rights Reserved.
      </footer>
    </div>
  );
}
