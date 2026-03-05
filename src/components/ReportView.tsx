"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ArrowLeft, Award, TrendingUp, User, 
  GraduationCap, CheckCircle2, Star, Sparkles, Languages, Target
} from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRtl = lang === 'ar';

  // --- 核心逻辑 1：智能数据清洗 ---
  const cleanContent = useMemo(() => {
    if (!student.reportContent) return "";
    return student.reportContent
      .replace(/<br\s*\/?>/gi, '\n') 
      .replace(/&nbsp;/g, ' ')
      .replace(/\n{3,}/g, '\n\n');
  }, [student.reportContent]);

  // --- 核心逻辑 2：智能提取可视化卡片数据 ---
  const stats = useMemo(() => {
    const text = cleanContent.toLowerCase();
    return [
      { 
        label: isRtl ? 'المفردات' : 'Vocabulary', 
        status: isRtl ? 'متقدمة' : 'Advanced', 
        icon: <Award className="text-[#26B7FF]" />, 
        p: text.includes('advanced') ? '90%' : '40%' 
      },
      { 
        label: isRtl ? 'بنية الجملة' : 'Structure', 
        status: isRtl ? 'دقيقة' : 'Accurate', 
        icon: <TrendingUp className="text-[#26B7FF]" />, 
        p: text.includes('accurate') ? '85%' : '35%' 
      },
      { 
        label: isRtl ? 'تدفق اللغة' : 'Flow', 
        status: isRtl ? 'طليقة' : 'Complex', 
        icon: <User className="text-[#26B7FF]" />, 
        p: text.includes('complex') ? '80%' : '30%' 
      }
    ];
  }, [cleanContent, isRtl]);

  return (
    <div className={`min-h-screen bg-[#F6F6F6] text-[#333333] pb-24 transition-all duration-500`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 顶部 Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-[1140px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-95">
              <ArrowLeft className={`w-6 h-6 text-[#26B7FF] ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white shadow-lg">
                <GraduationCap size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">{student.name}</h1>
                <p className="text-[12px] text-[#666666] font-medium uppercase tracking-wider">ID: {student.studentId}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 bg-[#26B7FF] text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg shadow-blue-100 hover:scale-105 transition-all"
          >
            <Languages size={16} />
            <span>{isRtl ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1140px] mx-auto px-6 pt-12 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-block px-5 py-1.5 bg-[#FDE700] rounded-full text-[14px] font-bold text-[#333333] uppercase tracking-widest shadow-sm">
            {isRtl ? 'تقرير إنجاز تعليمي' : 'Learning Milestone Report'}
          </div>
          <h2 className="text-[36px] sm:text-[41px] font-extrabold text-[#333333] leading-tight tracking-tight">
            {isRtl ? `تقرير إنجاز ${student.name}` : `${student.name}'s Milestone Report`}
          </h2>
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 border-l-[12px] border-l-[#26B7FF] relative overflow-hidden group text-start">
            <div className="flex items-start gap-4 relative z-10">
              <Sparkles className="text-[#FDE700] shrink-0 mt-1" size={32} />
              <p className="text-[18px] md:text-[20px] text-[#555555] leading-relaxed italic font-medium">
                {isRtl 
                  ? "تهانينا على تقدمك الرائع! لقد انتقلت ببراعة إلى بناء جمل كاملة ومثيرة للإعجاب."
                  : "Congratulations on your fantastic progress! You have transitioned beautifully to building full, impressive sentences."}
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
          </div>
        </section>

        {/* 核心指标可视化卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((item, i) => (
            <div key={i} className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-50 transition-all hover:shadow-xl hover:-translate-y-1 group">
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="p-4 bg-[#F6F6F6] rounded-2xl group-hover:bg-[#26B7FF] group-hover:text-white transition-colors duration-500">
                  {item.icon}
                </div>
                <h4 className="text-[20px] font-bold text-[#333333]">{item.label}</h4>
              </div>
              <div className="h-3 bg-[#F6F6F6] rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-[#26B7FF] rounded-full shadow-[0_0_12px_rgba(38,183,255,0.4)] transition-all duration-1000 ease-out" style={{ width: item.p }}></div>
              </div>
              <p className="text-[#26B7FF] font-extrabold text-center text-sm tracking-wide">🚀 {item.status}</p>
            </div>
          ))}
        </div>

        {/* 智能文字解析区 */}
        <section className="bg-white rounded-[32px] p-8 md:p-16 shadow-card border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#26B7FF] via-[#FDE700] to-[#26B7FF] opacity-30" />
          <div className="prose prose-report max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {cleanContent}
            </ReactMarkdown>
          </div>
        </section>

        {/* 品牌底部卡片 */}
        <footer className="bg-[#333333] text-white p-12 sm:p-20 rounded-[40px] text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#FDE700] rounded-[24px] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
            <Target className="text-[#333333] w-10 h-10" />
          </div>
          <h3 className="text-[28px] sm:text-[32px] font-bold mb-6 tracking-tight">Final Encouragement</h3>
          <p className="max-w-2xl mx-auto text-[#CCCCCC] text-[18px] leading-relaxed mb-10 opacity-90 italic">
             {isRtl 
               ? "زياد، أنت تمتلك حدساً لغوياً رائعاً. لا تدع عادة الترجمة العربية تبطئ عقلك اللامع. ثق بإحساسك، ودعنا نطلق العنان لسرعتك الحقيقية!"
               : "Ziad, you have a brilliant language intuition. Do not let the habit of Arabic translation slow down your bright mind. Trust your feelings and let's unlock your true speaking speed!"}
          </p>
          <div className="inline-flex items-center gap-3 text-[#FDE700] bg-white/5 px-10 py-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <Award size={24} />
            <span className="font-extrabold tracking-widest uppercase">Excellent Progress</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
