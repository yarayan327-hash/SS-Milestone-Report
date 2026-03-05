"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Trophy, TrendingUp, User, GraduationCap, 
  CheckCircle2, Sparkles, Languages, AlertCircle, Map, ChevronRight
} from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [showFullGap, setShowFullGap] = useState(false);
  const isRtl = lang === 'ar';

  // --- 动态解析逻辑：将数据库文案转化为结构化对象 ---
  const dynamicData = useMemo(() => {
    const rawText = (student.reportContent || "")
      .replace(/<br\s*\/?>/gi, '\n') // 清理 HTML 换行
      .replace(/&nbsp;/g, ' ');

    // 提取 Summary (Dear 之后到下一个标题之前的内容)
    const summaryMatch = rawText.match(/Dear[\s\S]*?\n\n?([\s\S]*?)(?=\n\n|\n[A-Z\u0600-\u06FF])/i);
    
    // 提取 Transformation 数据
    const extractTrans = (cat: string) => {
      // 匹配类别名称后，提取紧随其后的两段文字（START 和 NOW）
      const regex = new RegExp(`${cat}[\\s\\S]*?\\n(.*?)\\n(.*?)\\n`, 'i');
      const match = rawText.match(regex);
      return {
        start: match?.[1]?.trim() || "Initial progress...",
        now: match?.[2]?.trim() || "Developing skills..."
      };
    };

    return {
      summary: summaryMatch?.[1]?.trim() || "Congratulations on your progress!",
      transformation: [
        { category: "Vocabulary", ...extractTrans("Vocabulary") },
        { category: "Sentence Structure", ...extractTrans("Sentence Structure") },
        { category: "Conversational Flow", ...extractTrans("Conversational Flow") }
      ]
    };
  }, [student.reportContent]);

  const t = (en: string, ar: string) => isRtl ? ar : en;

  return (
    <div className={`min-h-screen bg-[#F6F6F6] ${isRtl ? 'rtl text-right font-arabic' : 'text-left font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 顶部导航：动态显示当前学员 ID */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1140px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all">
               <ArrowLeft className="w-6 h-6 text-[#26B7FF]" />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100 font-sans">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white shadow-lg">
                <Trophy size={24} />
              </div>
              <div>
                <span className="font-bold text-lg block leading-tight text-[#333333]">{student.name}</span>
                <span className="text-xs text-[#666666] font-medium">ID: {student.studentId}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="bg-[#26B7FF] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-[#26B7FF]/20">
             {isRtl ? 'English' : 'العربية'}
          </button>
        </div>
      </nav>

      <main className="max-w-[1140px] mx-auto px-6 py-16 space-y-24">
        
        {/* Hero Section：动态渲染不同学员的 Summary */}
        <section className="text-center space-y-8">
          <div className="inline-block px-4 py-1.5 bg-[#FDE700] rounded-full text-[12px] font-bold uppercase text-[#333333]">LEARNING MILESTONE REPORT</div>
          <h1 className="text-[36px] md:text-[48px] font-extrabold text-[#333333] leading-tight">
             {student.name}{isRtl ? ' تقرير إنجاز' : "'s Milestone Report"}
          </h1>
          <div className="max-w-4xl mx-auto bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden text-start">
             <div className="flex items-start gap-6 relative z-10">
                <Sparkles className="text-[#FDE700] shrink-0 mt-1" size={32} />
                <p className="text-xl md:text-2xl text-[#666666] leading-relaxed font-medium italic opacity-95">
                  "{dynamicData.summary}"
                </p>
             </div>
             <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-50/50 rounded-full" />
          </div>
        </section>

        {/* Transformation Section：自动从数据库文本提取 Before & After */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#26B7FF]/10 rounded-2xl flex items-center justify-center text-[#26B7FF]"><TrendingUp size={24} /></div>
            <h2 className="text-[28px] font-bold text-[#333333]">{t("The Transformation", "التحول: قبل وبعد")}</h2>
          </div>
          <div className="grid gap-6">
            {dynamicData.transformation.map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[24px] shadow-sm grid grid-cols-1 md:grid-cols-10 items-center gap-6 border border-white hover:border-[#26B7FF]/10 transition-all group">
                <div className="md:col-span-2 space-y-1">
                  <span className="text-[10px] font-bold text-[#26B7FF] uppercase tracking-[2px]">CATEGORY</span>
                  <p className="text-xl font-bold text-[#333333]">{t(item.category, item.category === 'Vocabulary' ? 'المفردات' : 'بنية الجملة')}</p>
                </div>
                <div className="md:col-span-4 bg-[#F6F6F6] p-6 rounded-2xl whitespace-pre-line text-[15px] text-[#666666] font-medium leading-relaxed">
                  {item.start}
                </div>
                <div className="md:col-span-4 bg-[#26B7FF]/5 p-6 rounded-2xl whitespace-pre-line text-[15px] font-bold text-[#26B7FF] leading-relaxed">
                  🚀 {item.now}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gap Analysis */}
        <section className="bg-[#282828] text-white rounded-[40px] p-8 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#26B7FF]/20 blur-[120px] rounded-full opacity-50" />
          <div className="relative z-10 space-y-16">
            <div className="flex justify-between items-end gap-6 text-start">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-4 text-[#FDE700]"><AlertCircle size={36} /><h2 className="text-3xl md:text-4xl font-bold">{t("The 'Gap' Analysis", "تحليل الفجوة")}</h2></div>
                <p className="text-white/60 text-lg md:text-xl leading-relaxed opacity-80">
                  {t("Specific 'Gaps' are holding you back.", "يظهر تحليلنا العميق فجوات محددة تعيق تقدمك.")}
                </p>
              </div>
              <button onClick={() => setShowFullGap(!showFullGap)} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full text-sm font-bold transition-all border border-white/10 shrink-0">
                {showFullGap ? t("Show Less", "عرض أقل") : t("View Details", "عرض التفاصيل")}
              </button>
            </div>
            {/* 动态细节展示逻辑 */}
            {showFullGap && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-start animate-in fade-in slide-in-from-top-4">
                 <p className="text-white/50 text-sm leading-relaxed col-span-full border-t border-white/10 pt-8">
                    {student.reportContent.split('Gap" Analysis')[1]?.split('🚀 Custom')[0] || "Details loading..."}
                 </p>
              </div>
            )}
          </div>
        </section>

        {/* Roadmap */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#FDE700]/10 rounded-2xl flex items-center justify-center text-[#333333] border border-[#FDE700]/20 shadow-inner"><Map size={24} /></div>
            <h2 className="text-[28px] font-bold text-[#333333]">{t("Custom Roadmap", "خارطة الطريق")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
            {[0, 1].map((idx) => (
              <div key={idx} className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border-t-[10px] border-[#FDE700] space-y-8 group transition-all">
                <div className="space-y-2">
                  <h3 className="text-[#26B7FF] font-bold uppercase tracking-[2px] text-xs">PHASE {idx + 1}</h3>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#333333]">{idx === 0 ? '[A0] Knowledge' : '[A1] Skills'}</p>
                </div>
                <button 
                  onClick={() => setActiveModule(idx)} 
                  className={`w-full py-4 rounded-full border-2 transition-all flex items-center justify-center gap-3 font-bold ${activeModule === idx ? 'bg-[#26B7FF] text-white' : 'text-[#26B7FF] border-[#26B7FF]'}`}
                >
                   {t("Module Details", "تفاصيل الوحدة")} <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
