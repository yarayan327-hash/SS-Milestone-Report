"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Trophy, TrendingUp, User, GraduationCap, 
  CheckCircle2, Sparkles, Languages, AlertCircle, Map, ChevronRight
} from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [activeModule, setActiveModule] = useState<number | null>(null); // 控制 Roadmap 按钮状态
  const [showFullGap, setShowFullGap] = useState(false); // 控制 Gap Analysis 展开
  const isRtl = lang === 'ar';

  // 1. 结构化数据：穷尽所有案例并支持换行 (\n)
  const reportData = {
    executiveSummary: {
      en: "Congratulations on your fantastic progress during your first year of high school! 🎉 Continuing your studies consistently all the way to Ramadan shows the mindset of a highly successful student. You have transitioned beautifully to building full, impressive sentences.",
      ar: "تهانينا على تقدمك الرائع خلال عامك الأول في المدرسة الثانوية! 🎉 استمرارك في الدراسة بانتظام وصولاً إلى شهر رمضان يثبت أنك تمتلك عقلية طالب ناجح بامتياز. لقد انتقلت ببراعة إلى بناء جمل كاملة ومثيرة للإعجاب."
    },
    transformation: [
      {
        category: { en: "Vocabulary", ar: "المفردات" },
        start: { en: "Basic & Fragmented\n(Simple nouns and numbers)", ar: "أساسي ومجزأ\n(أسماء وأرقام بسيطة)" },
        now: { en: "Advanced & Expressive\n('Confident', 'Generous', 'Receipt' - Knowing the 'p' is silent!)", ar: "متقدم ومعبر\n('Confident', 'Generous', 'Receipt')" }
      },
      {
        category: { en: "Sentence Structure", ar: "بنية الجملة" },
        start: { en: "Word-by-word / Messy\n'Where the water?', 'Ali is a small cat'", ar: "كلمة بكلمة / غير منظم\n'Where the water?'" },
        now: { en: "Accurate & Correct\n'Where is the cat?', 'I gave the book to her'", ar: "دقيق وصحيح\n'Where is the cat?'" }
      },
      {
        category: { en: "Conversational Flow", ar: "تدفق المحادثة" },
        start: { en: "1-word answers\n'10'", ar: "إجابات من كلمة واحدة\n'10'" },
        now: { en: "Complex Future Planning\n'I am going to travel to Riyadh for two days.'", ar: "تخطيط مستقبلي معقد\n'I am going to travel to Riyadh...'" }
      }
    ],
    gapAnalysis: [
      {
        title: { en: "Phonics & Pronunciation Trap", ar: "فخ النطق والصوتيات" },
        desc: { en: "Struggling with vowel sounds, often confusing 'buy' with 'boy'. You also try to pronounce 'Silent Letters' like 'K' in know.", ar: "صعوبة في أصوات الحروف المتحركة ونطق الحروف الصامتة." }
      },
      {
        title: { en: "The 'I Read But Don't Understand' Gap", ar: "فجوة 'أقرأ ولكن لا أفهم'" },
        desc: { en: "Decoding word-by-word instead of contexts. By the end of a sentence, you forget the beginning.", ar: "فك التشفير كلمة بكلمة بدلاً من فهم السياق." }
      },
      {
        title: { en: "Arabic Literal Translation", ar: "الترجمة الحرفية العربية" },
        desc: { en: "Building sentences in Arabic first, causing 'Be' verb drops and slowing flow.", ar: "بناء الجمل بالعربية أولاً، مما يسبب سقوط فعل الكينونة." }
      }
    ]
  };

  const t = (obj: any) => obj[lang];

  return (
    <div className={`min-h-screen bg-[#F6F6F6] ${isRtl ? 'rtl text-right font-arabic' : 'text-left font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1140px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all"><ArrowLeft className="w-6 h-6 text-[#26B7FF]" /></Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white shadow-lg"><Trophy size={24} /></div>
              <span className="font-bold text-xl text-[#333333]">Milestone<span className="text-[#26B7FF]">Report</span></span>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="bg-[#26B7FF] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-[#26B7FF]/20">
             {isRtl ? 'English' : 'العربية'}
          </button>
        </div>
      </nav>

      <main className="max-w-[1140px] mx-auto px-6 py-16 space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <div className="inline-block px-4 py-1.5 bg-[#FDE700] rounded-full text-[12px] font-bold uppercase text-[#333333]">LEARNING MILESTONE REPORT</div>
          <h1 className="text-[36px] md:text-[48px] font-extrabold text-[#333333] tracking-tight">{student.name}'s Milestone Report</h1>
          <div className="max-w-4xl mx-auto bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden text-start">
             <div className="flex items-start gap-6 relative z-10">
                <Sparkles className="text-[#FDE700] shrink-0 mt-1" size={32} />
                <p className="text-xl md:text-2xl text-[#666666] leading-relaxed font-medium italic opacity-95">"{t(reportData.executiveSummary)}"</p>
             </div>
             <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-50/50 rounded-full" />
          </div>
        </section>

        {/* 2. Transformation Section: 穷尽案例 + 换行展示 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#26B7FF]/10 rounded-2xl flex items-center justify-center text-[#26B7FF]"><TrendingUp size={24} /></div>
            <h2 className="text-[28px] font-bold text-[#333333]">{isRtl ? 'التحول: قبل وبعد' : 'The Transformation: Before & After'}</h2>
          </div>
          <div className="grid gap-6">
            {reportData.transformation.map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[24px] shadow-sm grid grid-cols-1 md:grid-cols-10 items-center gap-6 border border-white hover:border-[#26B7FF]/10 transition-all">
                <div className="md:col-span-2 space-y-1">
                  <span className="text-[10px] font-bold text-[#26B7FF] uppercase tracking-[2px]">CATEGORY</span>
                  <p className="text-xl font-bold text-[#333333]">{t(item.category)}</p>
                </div>
                {/* 使用 whitespace-pre-line 实现换行 */}
                <div className="md:col-span-4 bg-[#F6F6F6] p-6 rounded-2xl whitespace-pre-line text-[15px] text-[#666666] font-medium leading-relaxed">{t(item.start)}</div>
                <div className="md:col-span-4 bg-[#26B7FF]/5 p-6 rounded-2xl whitespace-pre-line text-[15px] font-bold text-[#26B7FF] leading-relaxed">🚀 {t(item.now)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Gap Analysis: 点击 View Details 展开内容 */}
        <section className="bg-[#282828] text-white rounded-[40px] p-8 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#26B7FF]/20 blur-[120px] rounded-full opacity-50" />
          <div className="relative z-10 space-y-16">
            <div className="flex justify-between items-end gap-6 text-start">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-4 text-[#FDE700]"><AlertCircle size={36} /><h2 className="text-3xl md:text-4xl font-bold">{isRtl ? 'تحليل الفجوة' : "The 'Gap' Analysis"}</h2></div>
                <p className="text-white/60 text-lg md:text-xl leading-relaxed">{isRtl ? 'يظهر تحليلنا العميق فجوات محددة تعيق تقدمك.' : "Specific 'Gaps' are holding you back. If you pause now, your brain will revert to translation habits."}</p>
              </div>
              <button onClick={() => setShowFullGap(!showFullGap)} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full text-sm font-bold transition-all border border-white/10 shrink-0">
                {showFullGap ? (isRtl ? 'عرض أقل' : 'Show Less') : (isRtl ? 'View Details' : 'View Details')}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-start">
              {reportData.gapAnalysis.map((point, idx) => (
                <div key={idx} className="space-y-6">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-[#FDE700] text-xl">0{idx + 1}</div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">{t(point.title)}</h3>
                  {showFullGap && <p className="text-white/50 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2">{t(point.desc)}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Roadmap Section: 恢复缺失内容 + 按钮点击响应 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#FDE700]/10 rounded-2xl flex items-center justify-center text-[#333333] border border-[#FDE700]/20 shadow-inner"><Map size={24} /></div>
            <h2 className="text-[28px] font-bold text-[#333333]">{isRtl ? 'خارطة الطريق' : 'Custom Learning Roadmap'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
            {[0, 1].map((idx) => (
              <div key={idx} className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border-t-[10px] border-[#FDE700] space-y-8 group transition-all">
                <div className="space-y-2">
                  <h3 className="text-[#26B7FF] font-bold uppercase tracking-[2px] text-xs">PHASE {idx + 1}</h3>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#333333]">{idx === 0 ? '[A0] Knowledge' : '[A1] Skills'}</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-[#26B7FF]/10 rounded-full flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="text-[#26B7FF]" size={16} /></div>
                  <p className="text-[#666666] text-lg leading-relaxed italic opacity-80">{idx === 0 ? 'Fixes sounds confusion and silent letters.' : 'Attacks the comprehension gap using stories.'}</p>
                </div>
                <button 
                  onClick={() => setActiveModule(activeModule === idx ? null : idx)} 
                  className={`w-full py-4 rounded-full border-2 transition-all flex items-center justify-center gap-3 font-bold ${activeModule === idx ? 'bg-[#26B7FF] text-white border-[#26B7FF]' : 'border-[#26B7FF] text-[#26B7FF] hover:bg-[#26B7FF] hover:text-white'}`}
                >
                   {isRtl ? 'تفاصيل الوحدة' : 'Module Details'} <ChevronRight size={18} className={`${activeModule === idx ? 'translate-x-1' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
