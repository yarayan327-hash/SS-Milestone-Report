"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Award, TrendingUp, User, GraduationCap, CheckCircle2, Star, AlertTriangle } from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRtl = lang === 'ar';

  // --- 核心逻辑：数据清洗与语言切割 ---
  const processedContent = useMemo(() => {
    if (!student.reportContent) return "";

    // 1. 清洗污染标签：将 <br> 还原为换行符，清除多余空格
    let cleanText = student.reportContent
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/\n{3,}/g, '\n\n'); // 压缩多余换行

    // 2. 语言切割逻辑：根据特定的阿拉伯文字符或分隔符拆分
    // 假设数据中英文在前，阿拉伯语在后，通过 "عزيزي زياد" 或 "---" 识别
    const parts = cleanText.split(/---/);
    
    if (lang === 'en') {
      return parts[0] || cleanText;
    } else {
      // 提取包含阿拉伯语的部分
      return parts[1] || cleanText;
    }
  }, [student.reportContent, lang]);

  return (
    <div className={`min-h-screen bg-[#F6F6F6] text-[#333333] pb-24 transition-all duration-500 ${isRtl ? 'font-arabic' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
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
                <p className="text-[12px] text-[#666666] font-medium">ID: {student.studentId}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-6 py-2 border-2 border-[#26B7FF] text-[#26B7FF] rounded-full font-extrabold text-sm hover:bg-[#26B7FF] hover:text-white transition-all shadow-sm active:scale-95"
          >
            {isRtl ? 'English Version' : 'النسخة العربية'}
          </button>
        </div>
      </header>

      <main className="max-w-[1140px] mx-auto px-6 pt-12 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-block px-5 py-1.5 bg-[#FDE700] rounded-full text-[14px] font-extrabold text-[#333333] uppercase tracking-wider shadow-sm">
            <Star size={14} className="inline mr-2 fill-current" />
            {isRtl ? 'ملخص تنفيذي' : 'Executive Summary'}
          </div>
          <h2 className="text-[36px] sm:text-[41px] font-extrabold text-[#333333] leading-tight">
            Learning Milestone Report
          </h2>
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-50 border-s-[12px] border-s-[#FDE700]">
            <p className="text-[20px] text-[#555555] leading-relaxed font-medium italic">
              "Congratulations on your fantastic progress! You have transitioned beautifully to building full, impressive sentences."
            </p>
          </div>
        </section>

        {/* 可视化数据卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: isRtl ? 'المفردات' : 'Vocabulary', status: isRtl ? 'Advanced' : 'Advanced', icon: <Award className="text-[#26B7FF]" />, p: '90%' },
            { label: isRtl ? 'بنية الجملة' : 'Structure', status: isRtl ? 'Accurate' : 'Accurate', icon: <TrendingUp className="text-[#26B7FF]" />, p: '85%' },
            { label: isRtl ? 'تدفق اللغة' : 'Flow', status: isRtl ? 'Complex' : 'Complex', icon: <User className="text-[#26B7FF]" />, p: '80%' }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 transition-all hover:shadow-xl group">
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-[#26B7FF] group-hover:text-white transition-colors duration-500">
                  {item.icon}
                </div>
                <h4 className="text-[20px] font-extrabold text-[#333333]">{item.label}</h4>
              </div>
              <div className="h-3 bg-[#F6F6F6] rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-[#26B7FF] rounded-full shadow-[0_0_12px_rgba(38,183,255,0.4)] transition-all duration-1000" style={{ width: item.p }}></div>
              </div>
              <p className="text-[#26B7FF] font-extrabold text-center text-sm tracking-wide">🚀 {item.status}</p>
            </div>
          ))}
        </div>

        {/* 智能文字解析区 */}
        <section className="bg-white rounded-[32px] p-8 md:p-16 shadow-card border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#26B7FF] via-[#FDE700] to-[#26B7FF] opacity-30" />
          
          <div className="prose-custom">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {processedContent}
            </ReactMarkdown>
          </div>
        </section>

        {/* Final Encouragement */}
        <footer className="bg-[#333333] text-white p-12 sm:p-20 rounded-[40px] text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#FDE700] rounded-[20px] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
            <CheckCircle2 className="text-[#333333] w-10 h-10" />
          </div>
          <h3 className="text-[28px] sm:text-[32px] font-extrabold mb-6 tracking-tight">Final Encouragement</h3>
          <p className="max-w-2xl mx-auto text-[#CCCCCC] text-[18px] leading-relaxed mb-10 opacity-90 italic">
             "Ziad, you have a brilliant language intuition. Do not let the habit of Arabic translation slow down your bright mind. Trust your feelings and let's unlock your true speaking speed!"
          </p>
          <div className="inline-flex items-center gap-3 text-[#FDE700] bg-white/5 px-8 py-3 rounded-2xl border border-white/10 backdrop-blur-sm">
            <Award size={24} />
            <span className="font-extrabold tracking-widest uppercase">Excellent Progress</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
