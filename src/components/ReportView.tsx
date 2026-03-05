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
    const content = raw.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');

    const extract = (tag: string) => {
      const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)(?=\\[|$)`, 'i');
      return content.match(regex)?.[1]?.trim() || null;
    };

    // 1. Summary
    const summaryRaw = extract("SUMMARY");
    let summary = "⚠️ [SUMMARY] 标签未在数据库中找到。请检查文案格式。";
    if (summaryRaw) {
      const arIndex = summaryRaw.search(/عزيزي/);
      summary = arIndex !== -1 
        ? (isRtl ? summaryRaw.substring(arIndex).trim() : summaryRaw.substring(0, arIndex).trim())
        : summaryRaw;
    }

    // 2. Transformation
    const transRaw = extract("TRANSFORMATION");
    let transformation: any[] = [];
    if (transRaw) {
      transformation = transRaw.split(/Category:/i).filter(Boolean).map((block: string) => {
        const lines = block.trim().split('\n').map((l: string) => l.trim()).filter(Boolean);
        const beforeLine = lines.find((l: string) => l.startsWith('Before:')) || "";
        const afterLine = lines.find((l: string) => l.startsWith('After:')) || "";
        
        const bParts = beforeLine.replace('Before:', '').split('|').map((s: string) => s.trim());
        const aParts = afterLine.replace('After:', '').split('|').map((s: string) => s.trim());

        return {
          category: lines[0] || "Unknown",
          beforeTitle: bParts[0] || "",
          beforeSub: bParts[1] || "",
          afterTitle: aParts[0] || "",
          afterSub: aParts[1] || "",
        };
      });
    }

    // 3. Gap
    const gapRaw = extract("GAP");
    let gaps: any[] = [];
    if (gapRaw) {
      gaps = gapRaw.split('\n').filter((l: string) => l.includes('|')).map((line: string) => {
        const p = line.split('|').map((s: string) => s.trim());
        return { id: p[0], title: p[1], desc: p[2] };
      });
    }

    // 4. Roadmap
    const roadmapRaw = extract("ROADMAP");
    let phases: any[] = [];
    if (roadmapRaw) {
      phases = roadmapRaw.split('\n').filter((l: string) => l.includes('|')).map((line: string) => {
        const p = line.split('|').map((s: string) => s.trim());
        return { 
          phaseNum: p[0] || "", 
          phaseName: p[1] || "", 
          moduleName: p[2] || "", 
          whyDesc: p[3] || "" 
        };
      });
    }

    // 5. Encouragement
    const encRaw = extract("ENCOURAGEMENT");
    let encouragement = "⚠️ [ENCOURAGEMENT] 标签未找到";
    if (encRaw) {
      const encArIdx = encRaw.search(/زياد|عزيزي|أشواق/);
      encouragement = encArIdx !== -1 
        ? (isRtl ? encRaw.substring(encArIdx).trim() : encRaw.substring(0, encArIdx).trim())
        : encRaw;
    }

    return { summary, transformation, gaps, phases, encouragement };
  }, [student?.reportContent, isRtl]);

  const t = (en: string, ar: string) => isRtl ? ar : en;

  return (
    <div className={`min-h-screen bg-[#F6F6F6] ${isRtl ? 'rtl text-right font-arabic' : 'text-left font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5 h-20 flex items-center">
        <div className="max-w-[1140px] mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
               <ArrowLeft className={`w-6 h-6 text-[#26B7FF] ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#26B7FF]/20">
                <Trophy size={24} />
              </div>
              <div>
                <span className="font-bold text-lg block leading-tight text-[#333333]">{student.name || "Student"}</span>
                <span className="text-xs text-[#666666] font-medium tracking-tight">ID: {student.studentId || "N/A"}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="bg-[#26B7FF] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-[#26B7FF]/20 hover:scale-105 transition-all">
             {isRtl ? 'English' : 'العربية'}
          </button>
        </div>
      </nav>

      <main className="max-w-
