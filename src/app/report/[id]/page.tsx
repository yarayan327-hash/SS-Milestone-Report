"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, TrendingUp, User, AlertTriangle, Map, GraduationCap } from 'lucide-react';

export default function ReportDetailPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRtl = lang === 'ar';

  // 模拟 Ziad 的数据
  const data = {
    name: "Ziad",
    studentId: "62283399",
    content: {
      en: {
        title: "Ziad Learning Milestone Report",
        summary: "Congratulations on your fantastic progress! You have transitioned beautifully from giving one-word answers to building full, impressive sentences.",
        gapTitle: "The Gap Analysis",
        roadmapTitle: "Learning Roadmap",
        encouragement: "Ziad, you have a brilliant language intuition. Do not let the habit of Arabic translation slow down your bright mind."
      },
      ar: {
        title: "تقرير إنجاز تعلم زياد",
        summary: "تهانينا على تقدمك الرائع! لقد انتقلت ببراعة من إعطاء إجابات مكونة من كلمة واحدة إلى بناء جمل كاملة ومثيرة للإعجاب.",
        gapTitle: "تحليل الفجوة",
        roadmapTitle: "خارطة الطريق التعليمية",
        encouragement: "زياد، أنت تمتلك حدساً لغوياً رائعاً. لا تدع عادة الترجمة العربية تبطئ عقلك اللامع."
      }
    }
  };

  const t = isRtl ? data.content.ar : data.content.en;

  return (
    // 注意：这里不再包含 html/body 标签，只保留内容容器
    <div className="min-h-screen bg-[#F6F6F6] text-[#333333] pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-[1140px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90">
              <ArrowLeft className={`w-6 h-6 text-[#26B7FF] ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white">
                <GraduationCap size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">{data.name}</h1>
                <p className="text-[12px] text-[#666666]">ID: {data.studentId}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-5 py-2 border-2 border-[#26B7FF] text-[#26B7FF] rounded-[50px] font-semibold text-sm hover:bg-[#26B7FF] hover:text-white transition-all shadow-sm"
          >
            {isRtl ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      <main className="max-w-[1140px] mx-auto px-6 pt-10 space-y-16 font-poppins">
        
        {/* 核心视觉：主标题 */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1 bg-[#FDE700] rounded-full text-[14px] font-bold text-[#333333] uppercase shadow-sm">
            Executive Summary
          </div>
          <h2 className="text-[32px] sm:text-[41px] font-bold text-[#333333] leading-tight">
            {t.title}
          </h2>
          <p className="text-[18px] sm:text-[20px] text-[#666666] leading-relaxed">
            {t.summary}
          </p>
        </section>

        {/* 转换卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: isRtl ? 'المفردات' : 'Vocabulary', now: isRtl ? 'متقدمة ومعبرة' : 'Advanced & Expressive', icon: <Award className="text-[#26B7FF]" /> },
            { label: isRtl ? 'بنية الجملة' : 'Sentence Structure', now: isRtl ? 'دقيقة وصحيحة' : 'Accurate & Correct', icon: <TrendingUp className="text-[#26B7FF]" /> },
            { label: isRtl ? 'تدفق المحادثة' : 'Conversational Flow', now: isRtl ? 'تخطيط معقد' : 'Complex Planning', icon: <User className="text-[#26B7FF]" /> }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-50 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">{item.icon}</div>
                <h4 className="text-[20px] font-bold">{item.label}</h4>
              </div>
              <div className="h-2 bg-gray-100 rounded-full mb-4">
                <div className="h-full bg-[#26B7FF] rounded-full w-[90%]"></div>
              </div>
              <p className="text-[#26B7FF] font-bold">🚀 {item.now}</p>
            </div>
          ))}
        </div>

        {/* 风险分析 */}
        <section className="bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-gray-50">
          <div className="flex items-center gap-4 mb-8">
            <AlertTriangle className="text-[#FDE700] w-10 h-10" />
            <h3 className="text-[28px] sm:text-[32px] font-bold">{t.gapTitle}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[14px]">
            <div className="p-6 bg-[#F6F6F6] rounded-[20px] border-s-8 border-[#FDE700] hover:bg-white hover:shadow-inner transition-all">
              <h5 className="font-bold mb-2">Phonics Trap</h5>
              <p className="text-[#666666]">Struggling with vowel sounds and silent letters.</p>
            </div>
            <div className="p-6 bg-[#F6F6F6] rounded-[20px] border-s-8 border-[#FDE700] hover:bg-white hover:shadow-inner transition-all">
              <h5 className="font-bold mb-2">Understanding Gap</h5>
              <p className="text-[#666666]">Decoding words instead of full context.</p>
            </div>
            <div className="p-6 bg-[#F6F6F6] rounded-[20px] border-s-8 border-[#FDE700] hover:bg-white hover:shadow-inner transition-all">
              <h5 className="font-bold mb-2">Translation Crutch</h5>
              <p className="text-[#666666]">Building sentences in Arabic first.</p>
            </div>
          </div>
        </section>

        {/* 学习路线 */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <Map className="text-[#26B7FF] w-10 h-10" />
            <h3 className="text-[28px] sm:text-[32px] font-bold">{t.roadmapTitle}</h3>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[20px] border-2 border-[#26B7FF] relative">
              <span className="absolute top-0 right-8 -translate-y-1/2 bg-[#26B7FF] text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Phase 1</span>
              <h4 className="text-[20px] font-bold text-[#26B7FF] mb-2">[A0] Knowledge: Foundation Repair</h4>
              <p className="text-[#666666]">Focus on fixing phonics rules to cure confusion between sounds.</p>
            </div>
            <div className="bg-white p-8 rounded-[20px] border border-gray-100 opacity-60">
              <h4 className="text-[20px] font-bold mb-2">[A1] Skills: Text Analysis</h4>
              <p className="text-[#666666]">Moving to short stories and detailed context grabbing.</p>
            </div>
          </div>
        </section>

        {/* 底部语 */}
        <footer className="bg-[#333333] text-white p-12 rounded-[32px] text-center shadow-lg">
          <h3 className="text-[24px] font-bold mb-4">Final Encouragement</h3>
          <p className="max-w-2xl mx-auto text-[#CCCCCC] leading-relaxed mb-8">{t.encouragement}</p>
          <div className="inline-flex items-center gap-2 text-[#FDE700] font-bold px-6 py-3 border border-[#FDE700]/30 rounded-2xl">
            <Award size={20} />
            <span>I am incredibly proud of you!</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
