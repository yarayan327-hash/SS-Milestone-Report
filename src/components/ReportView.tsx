"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Trophy, TrendingUp, User, GraduationCap, 
  CheckCircle2, Sparkles, Languages, AlertCircle, Map, ChevronRight
} from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRtl = lang === 'ar';

  // --- 智能数据提取引擎 (深度优化版) ---
  const reportData = useMemo(() => {
    const text = (student.reportContent || "")
      .replace(/<br\s*\/?>/gi, '\n') // 强制清理文案中残留的 <br> 标签
      .replace(/&nbsp;/g, ' ');

    // 1. 语言段落分离逻辑 (通过识别英文/阿拉伯语关键词定位)
    const enPart = text.split(/عزيزي زياد/)[0]; // 截取英文部分
    const arPart = text.includes('عزيزي زياد') ? 'عزيزي زياد' + text.split(/عزيزي زياد/)[1].split('📈')[0] : ""; // 截取阿拉伯语部分

    // 2. 提取 Executive Summary
    const extractSummary = () => {
      const targetText = isRtl ? arPart : enPart;
      const match = targetText.match(/Dear.*?\n([\s\S]*?)(?=\n\n|\n[A-Z\u0600-\u06FF])/i) || 
                    targetText.match(/عزيزي.*?\n([\s\S]*?)(?=\n\n|\n[A-Z\u0600-\u06FF])/u);
      return match?.[1]?.trim().replace(/\*/g, '') || "Congratulations on your progress!";
    };

    // 3. 提取 Transformation (Before & After)
    // 采用“后置搜索”策略：找到类别名，跳过标题行，取接下来的两行
    const extractTrans = (catEn: string, catAr: string) => {
      const searchKey = isRtl ? catAr : catEn;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const catIdx = lines.findIndex(l => l.includes(searchKey));
      
      if (catIdx !== -1) {
        // 在文案结构中，类别名下方分别是 START 的内容和 NOW 的内容
        return {
          start: lines[catIdx + 1] || "Initial stage",
          now: lines[catIdx + 2] || "Developing..."
        };
      }
      return { start: "Starting out", now: "Making progress" };
    };

    return {
      summary: extractSummary(),
      transformation: [
        { category: t("Vocabulary", "المفردات"), ...extractTrans("Vocabulary", "المفردات") },
        { category: t("Sentence Structure", "بنية الجملة"), ...extractTrans("Sentence Structure", "بنية الجملة") },
        { category: t("Conversational Flow", "تدفق المحادثة"), ...extractTrans("Conversational Flow", "تدفق المحادثة") }
      ],
      encouragement: isRtl 
        ? "زياد، أنت تمتلك حدساً لغوياً رائعاً. ثق بإحساسك، ودعنا نطلق العنان لسرعتك الحقيقية!" 
        : "Trust your feelings, read the full story, and let's unlock your true speaking speed!"
    };
  }, [student.reportContent, isRtl]);

  function t(en: string, ar: string) { return isRtl ? ar : en; }

  return (
    <div className={`min-h-screen bg-[#F6F6F6] selection:bg-[#26B7FF]/30 ${isRtl ? 'rtl text-right font-arabic' : 'text-left font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* --- 顶部导航栏 --- */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1140px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all">
               <ArrowLeft className={`w-6 h-6 text-[#26B7FF] ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100 font-sans">
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
        
        {/* --- Hero Section (修正内容混合问题) --- */}
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
                  "{reportData.summary}"
                </p>
             </div>
             <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-50/50 rounded-full" />
          </div>
        </section>

        {/* --- Transformation (修复数据错乱与 <br> 问题) --- */}
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
                  <p className="text-xl font-bold text-[#333333]">{item.category}</p>
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

        {/* --- Gap Analysis (复刻深色背景版) --- */}
        <section className="bg-[#282828] text-white rounded-[40px] p-8 md:p-20 relative overflow-hidden shadow-2xl font-sans">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#26B7FF]/20 blur-[120px] rounded-full -mr-40 -mt-40" />
          <div className="relative z-10 space-y-16">
            <div className={`space-y-4 max-w-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center gap-4 text-[#FDE700] ${isRtl ? 'flex-row-reverse' : ''}`}>
                <AlertCircle size={36} />
                <h2 className="text-3xl md:text-4xl font-bold">{t("The 'Gap' Analysis", "تحليل الفجوة")}</h2>
              </div>
              <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed">
                {t("Our deep analysis shows specific 'Gaps' holding you back.", "يظهر تحليلنا العميق فجوات محددة تعيق تقدمك.")}
              </p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 ${isRtl ? 'text-right' : 'text-left'}`}>
              {[
                { en: "Phonics Trap", ar: "فخ النطق" },
                { en: "Understanding Gap", ar: "فجوة الفهم" },
                { en: "Translation Habit", ar: "عادة الترجمة" }
              ].map((point, idx) => (
                <div key={idx} className="space-y-6 group">
                  <div className={`w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-[#FDE700] text-xl group-hover:bg-[#FDE700] group-hover:text-[#282828] transition-all ${isRtl ? 'mr-0 ml-auto' : ''}`}>
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">{t(point.en, point.ar)}</h3>
                  <div className="h-0.5 w-12 bg-[#FDE700]/30 group-hover:w-full transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Roadmap --- */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#FDE700]/10 rounded-2xl flex items-center justify-center text-[#333333] border border-[#FDE700]/20 shadow-inner">
              <Map size={24} />
            </div>
            <h2 className="text-[28px] font-bold text-[#333333]">{t("Custom Roadmap", "خارطة الطريق التعليمية")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { en: "Phase 1: Foundation", ar: "المرحلة 1: التأسيس" },
              { en: "Phase 2: Level Up", ar: "المرحلة 2: رفع المستوى" }
            ].map((p, idx) => (
              <div key={idx} className="bg-white p-8 md:p-12 rounded-[32px] shadow-card border-t-[10px] border-[#FDE700] space-y-8 group hover:-translate-y-2 transition-all">
                <div className="space-y-2">
                  <h3 className="text-[#26B7FF] font-bold uppercase tracking-[2px] text-xs">{t(p.en, p.ar)}</h3>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#333333]">
                    {idx === 0 ? t("Language Foundation", "التأسيس اللغوي") : t("Text Analysis", "تحليل النصوص")}
                  </p>
                </div>
                <button className="w-full py-4 rounded-full border-2 border-[#26B7FF] text-[#26B7FF] font-bold hover:bg-[#26B7FF] hover:text-white transition-all flex items-center justify-center gap-3">
                   {t("Module Details", "تفاصيل الوحدة")}
                   <ChevronRight size={18} className={`${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* --- Footer Encouragement --- */}
        <section className="text-center p-12 md:p-24 bg-[#26B7FF] rounded-[48px] text-white space-y-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 blur-[100px] rounded-full -ml-32 -mt-32" />
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
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
