"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Trophy, TrendingUp, User, 
  GraduationCap, CheckCircle2, Star, Sparkles, Languages, Award
} from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRtl = lang === 'ar';

  // 核心数据手动映射：将 Ziad 文本版报告转换为参考样式的结构化数据
  const reportData = {
    name: "Ziad",
    studentId: "62283399",
    summary: {
      en: "Congratulations on your fantastic progress during your first year of high school! 🎉 You have transitioned beautifully from giving one-word answers to building full, impressive sentences like 'I am going to travel to Riyadh for two days.'",
      ar: "تهانينا على تقدمك الرائع خلال عامك الأول في المدرسة الثانوية! 🎉 لقد انتقلت ببراعة من إعطاء إجابات مكونة من كلمة واحدة إلى بناء جمل كاملة ومثيرة للإعجاب."
    },
    transformation: [
      {
        cat: { en: "Vocabulary", ar: "المفردات" },
        start: { en: "Basic & Fragmented", ar: "أساسي ومجزأ" },
        now: { en: "Advanced & Expressive", ar: "متقدم ومعبر" },
        progress: '90%'
      },
      {
        cat: { en: "Structure", ar: "بنية الجملة" },
        start: { en: "Word-by-word / Messy", ar: "كلمة بكلمة / غير منظم" },
        now: { en: "Accurate & Correct", ar: "دقيق وصحيح" },
        progress: '85%'
      },
      {
        cat: { en: "Flow", ar: "تدفق المحادثة" },
        start: { en: "1-word answers", ar: "إجابات من كلمة واحدة" },
        now: { en: "Complex Future Planning", ar: "تخطيط مستقبلي معقد" },
        progress: '80%'
      }
    ],
    encouragement: {
      en: "Ziad, you have a brilliant language intuition. Trust your feelings and let's unlock your true speaking speed! I am incredibly proud of you!",
      ar: "زياد، أنت تمتلك حدساً لغوياً رائعاً. ثق بإحساسك، ودعنا نطلق العنان لسرعتك الحقيقية في التحدث. أنا فخور بك جداً!"
    }
  };

  const t = (en: string, ar: string) => isRtl ? ar : en;

  return (
    <div className={`min-h-screen bg-[#F6F6F6] selection:bg-[#26B7FF]/30 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1140px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all">
               <ArrowLeft className={`w-6 h-6 text-[#26B7FF] ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white shadow-lg">
                <GraduationCap size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight">Milestone<span className="text-[#26B7FF]">Report</span></span>
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
        
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <div className="inline-block px-4 py-1.5 bg-[#FDE700] rounded-full text-sm font-bold tracking-wide uppercase">
            LEARNING MILESTONE REPORT
          </div>
          <h1 className="text-[34px] md:text-[41px] font-bold leading-tight">
            {reportData.name}'s Milestone Report
          </h1>
          
          <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-[24px] shadow-sm border-s-8 border-[#26B7FF] relative overflow-hidden text-start">
             <div className="flex items-start gap-5">
                <Sparkles className="text-[#FDE700] shrink-0 mt-1" size={32} />
                <p className="text-lg md:text-xl text-[#666666] leading-relaxed font-medium">
                  "{t(reportData.summary.en, reportData.summary.ar)}"
                </p>
             </div>
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 rounded-full opacity-40" />
          </div>
        </section>

        {/* Transformation Section */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#26B7FF]/10 rounded-2xl flex items-center justify-center text-[#26B7FF]">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-2xl font-bold">{t("The Transformation", "التحول: قبل وبعد")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reportData.transformation.map((item, i) => (
              <div key={i} className="bg-white rounded-[24px] p-8 shadow-sm border border-white hover:border-[#26B7FF]/20 transition-all group">
                <div className="flex flex-col items-center gap-4 mb-8 text-center">
                   <div className="p-4 bg-[#F6F6F6] rounded-2xl group-hover:bg-[#26B7FF] group-hover:text-white transition-colors duration-500">
                     {i === 0 ? <Award /> : i === 1 ? <TrendingUp /> : <User />}
                   </div>
                   <h4 className="text-xl font-bold">{t(item.cat.en, item.cat.ar)}</h4>
                </div>
                <div className="h-3 bg-[#F6F6F6] rounded-full mb-4 overflow-hidden">
                  <div 
                    className="h-full bg-[#26B7FF] rounded-full transition-all duration-1000" 
                    style={{ width: item.progress }}
                  />
                </div>
                <p className="text-[#26B7FF] font-bold text-center text-sm tracking-wide uppercase">🚀 {t(item.now.en, item.now.ar)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final Encouragement */}
        <section className="text-center p-12 md:p-20 bg-[#26B7FF] rounded-[40px] text-white space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -ml-16 -mt-16" />
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
            <Sparkles size={32} className="text-[#FDE700]" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold max-w-2xl mx-auto leading-relaxed italic">
            "{t(reportData.encouragement.en, reportData.encouragement.ar)}"
          </h2>
          <div className="inline-block px-10 py-3 bg-[#FDE700] text-[#333333] rounded-full font-bold shadow-xl">
            EXCELLENT PROGRESS
          </div>
        </section>

      </main>

      <footer className="bg-white border-t border-black/5 py-12 text-center">
        <p className="text-[#666666] text-sm">© 2026 MilestoneReport. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
