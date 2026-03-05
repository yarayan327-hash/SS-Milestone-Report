"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ArrowLeft, Award, TrendingUp, User, 
  GraduationCap, CheckCircle2, Star, Sparkles, Languages
} from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRtl = lang === 'ar';

  // 核心逻辑：自动清洗数据并提取对应语言
  const processedContent = useMemo(() => {
    if (!student.reportContent) return "";
    // 清洗 HTML 标签如 <br>
    let text = student.reportContent.replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/g, ' ');
    
    // 如果文案中包含中英分隔符，则进行切割，否则显示全文
    const parts = text.split(/---/);
    if (lang === 'en') return parts[0];
    return parts[1] || parts[0];
  }, [student.reportContent, lang]);

  return (
    <div className={`min-h-screen bg-[#F6F6F6] text-[#333333] pb-24 transition-all duration-500`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 顶部 Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-[1140px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className={`w-6 h-6 text-[#26B7FF] ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white shadow-lg">
                <GraduationCap size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">{student.name}</h1>
                <p className="text-[12px] text-[#666666]">ID: {student.studentId}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 bg-[#26B7FF] text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg shadow-blue-200 hover:scale-105 transition-all"
          >
            <Languages size={16} />
            <span>{isRtl ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1140px] mx-auto px-6 pt-12 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-block px-5 py-1.5 bg-[#FDE700] rounded-full text-[14px] font-bold text-[#333333] uppercase tracking-wider shadow-sm">
            {isRtl ? 'تقرير إنجاز تعليمي' : 'Learning Milestone Report'}
          </div>
          <h2 className="text-[36px] sm:text-[41px] font-extrabold text-[#333333] leading-tight">
            {isRtl ? `تقرير إنجاز ${student.name}` : `${student.name}'s Milestone Report`}
          </h2>
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 border-l-[12px] border-l-[#26B7FF] text-start">
            <div className="flex items-start gap-4">
              <Sparkles className="text-[#FDE700] shrink-0 mt-1" size={28} />
              <p className="text-[18px] md:text-[20px] text-[#555555] leading-relaxed italic">
                {isRtl ? 'تهانينا على تقدمك الرائع! لقد انتقلت ببراعة إلى بناء جمل كاملة ومثيرة للإعجاب.' : 'Congratulations on your fantastic progress! You have transitioned beautifully to building full, impressive sentences.'}
              </p>
            </div>
          </div>
        </section>

        {/* 核心指标可视化卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: isRtl ? 'المفردات' : 'Vocabulary', status: 'Advanced', icon: <Award className="text-[#26B7FF]" />, p: '90%' },
            { label: isRtl ? 'بنية الجملة' : 'Structure', status: 'Accurate', icon: <TrendingUp className="text-[#26B7FF]" />, p: '85%' },
            { label: isRtl ? 'تدفق اللغة' : 'Flow', status: 'Complex', icon: <User className="text-[#26B7FF]" />, p: '80%' }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-50 transition-all hover:shadow-md">
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-2xl">{item.icon}</div>
                <h4 className="text-[20px] font-bold">{item.label}</h4>
              </div>
              <div className="h-3 bg-[#F6F6F6] rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-[#26B7FF] rounded-full shadow-[0_0_12px_rgba(38,183,255,0.4)]" style={{ width: item.p }}></div>
              </div>
              <p className="text-[#26B7FF] font-bold text-center text-sm">🚀 {item.status}</p>
            </div>
          ))}
        </div>

        {/* 智能文字解析区 */}
        <section className="bg-white rounded-[32px] p-8 md:p-16 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#26B7FF] opacity-30" />
          <div className="prose prose-report max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {processedContent}
            </ReactMarkdown>
          </div>
        </section>

        {/* 品牌底部卡片 */}
        <footer className="bg-[#333333] text-white p-12 sm:p-20 rounded-[40px] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#FDE700] rounded-[24px] flex items-center justify-center shadow-lg">
            <CheckCircle2 className="text-[#333333] w-10 h-10" />
          </div>
          <h3 className="text-[28px] sm:text-[32px] font-bold mb-6 tracking-tight">Final Encouragement</h3>
          <p className="max-w-2xl mx-auto text-[#CCCCCC] text-[18px] leading-relaxed mb-12">
             {isRtl ? "زياد، أنت تمتلك حدساً لغوياً رائعاً. لا تدع عادة الترجمة العربية تبطئ عقلك اللامع." : "Ziad, you have a brilliant language intuition. Do not let the habit of Arabic translation slow down your bright mind. Trust your feelings and let's unlock your true speaking speed!"}
          </p>
          <div className="inline-flex items-center gap-3 text-[#FDE700] font-bold border-b border-[#FDE700]/30 pb-2">
            <Award size={24} />
            <span className="tracking-widest uppercase font-bold">Excellent Progress</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
