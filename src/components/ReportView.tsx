"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Award, TrendingUp, User, GraduationCap, CheckCircle2, Star } from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRtl = lang === 'ar';

  return (
    <div className={`min-h-screen bg-[#F6F6F6] text-[#333333] pb-24 transition-all duration-500`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* --- 顶部 Header --- */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-[1140px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all group">
              <ArrowLeft className={`w-6 h-6 text-[#26B7FF] group-hover:-translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white shadow-lg animate-in fade-in zoom-in duration-500">
                <GraduationCap size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">{student.name}</h1>
                <p className="text-[12px] text-[#666666] font-medium tracking-wide">STUDENT ID: {student.studentId}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-6 py-2 border-2 border-[#26B7FF] text-[#26B7FF] rounded-full font-bold text-sm hover:bg-[#26B7FF] hover:text-white transition-all shadow-sm active:scale-95"
          >
            {isRtl ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      <main className="max-w-[1140px] mx-auto px-6 pt-12 space-y-16">
        
        {/* --- Hero 引导区 --- */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-1.5 bg-[#FDE700] rounded-full text-[14px] font-extrabold text-[#333333] uppercase tracking-wider shadow-sm">
            <Star size={14} className="fill-current" />
            {isRtl ? 'ملخص تنفيذي' : 'Executive Summary'}
          </div>
          <h2 className="text-[36px] sm:text-[41px] font-extrabold text-[#333333] leading-[1.1]">
            {isRtl ? 'تقرير إنجاز تعلم الطالب' : 'Learning Milestone Report'}
          </h2>
          <div className="relative p-1 bg-gradient-to-r from-[#26B7FF] to-blue-400 rounded-[32px] shadow-xl">
             <div className="bg-white rounded-[31px] p-10">
                <p className="text-[20px] text-[#555555] leading-relaxed font-medium italic">
                  {isRtl 
                    ? "تهانينا على تقدمك الرائع! لقد انتقلت ببراعة إلى بناء جمل كاملة ومثيرة للإعجاب."
                    : "Congratulations on your fantastic progress! You have transitioned beautifully to building full, impressive sentences."}
                </p>
             </div>
          </div>
        </section>

        {/* --- 核心数据指标卡片 --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: isRtl ? 'المفردات' : 'Vocabulary', status: isRtl ? 'متقدمة' : 'Advanced', icon: <Award className="text-[#26B7FF]" />, p: '90%' },
            { label: isRtl ? 'بنية الجملة' : 'Structure', status: isRtl ? 'دقيقة' : 'Accurate', icon: <TrendingUp className="text-[#26B7FF]" />, p: '85%' },
            { label: isRtl ? 'تدفق اللغة' : 'Flow', status: isRtl ? 'طليقة' : 'Complex', icon: <User className="text-[#26B7FF]" />, p: '80%' }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="text-[20px] font-extrabold">{item.label}</h4>
              </div>
              <div className="h-3 bg-[#F6F6F6] rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-[#26B7FF] rounded-full shadow-[0_0_10px_rgba(38,183,255,0.4)] transition-all duration-1000" style={{ width: item.p }}></div>
              </div>
              <p className="text-[#26B7FF] font-extrabold text-center text-sm tracking-wide">
                🚀 {item.status}
              </p>
            </div>
          ))}
        </div>

        {/* --- 智能内容融合区 (Markdown 动态解析) --- */}
        <section className="bg-white rounded-[32px] p-8 md:p-16 shadow-lg border border-gray-50 relative overflow-hidden">
          {/* 装饰侧边条 */}
          <div className="absolute top-0 left-0 w-2 h-full bg-[#26B7FF] opacity-50"></div>
          
          <div className="prose-report max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {student.reportContent}
            </ReactMarkdown>
          </div>
        </section>

        {/* --- 品牌底部卡片 --- */}
        <footer className="bg-[#333333] text-white p-12 sm:p-20 rounded-[40px] text-center shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#FDE700] rounded-[20px] flex items-center justify-center shadow-lg">
            <CheckCircle2 className="text-[#333333] w-10 h-10" />
          </div>
          <h3 className="text-[28px] sm:text-[32px] font-extrabold mb-6 tracking-tight">
            {isRtl ? 'تشجيع أخير' : 'Final Encouragement'}
          </h3>
          <p className="max-w-2xl mx-auto text-[#CCCCCC] text-[18px] leading-relaxed mb-10 opacity-90">
             {isRtl 
               ? "زياد، أنت تمتلك حدساً لغوياً رائعاً. لا تدع عادة الترجمة العربية تبطئ عقلك اللامع."
               : "Ziad, you have a brilliant language intuition. Do not let the habit of Arabic translation slow down your bright mind. Trust your feelings and let's unlock your true speaking speed!"}
          </p>
          <div className="inline-flex items-center gap-3 text-[#FDE700] bg-white/5 px-8 py-3 rounded-2xl border border-white/10 backdrop-blur-sm shadow-inner">
            <Award size={24} />
            <span className="font-extrabold tracking-widest uppercase">Excellent Progress</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
