"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Trophy, TrendingUp, User, GraduationCap, 
  CheckCircle2, Sparkles, Languages, AlertCircle, Map, ChevronRight, Award
} from 'lucide-react';

export default function ReportView({ student }: { student: any }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [showFullGap, setShowFullGap] = useState(false);
  const isRtl = lang === 'ar';

  const reportData = {
    executiveSummary: {
      en: "Congratulations on your fantastic progress during your first year of high school! 🎉 Continuing your studies consistently all the way to Ramadan shows the mindset of a highly successful student. You have transitioned beautifully from giving one-word answers to building full, impressive sentences.",
      ar: "تهانينا على تقدمك الرائع خلال عامك الأول في المدرسة الثانوية! 🎉 استمرارك في الدراسة بانتظام وصولاً إلى شهر رمضان يثبت أنك تمتلك عقلية طالب ناجح بامتياز. لقد انتقلت ببراعة من إعطاء إجابات مكونة من كلمة واحدة إلى بناء جمل كاملة ومثيرة للإعجاب."
    },
    transformation: [
      {
        category: { en: "Vocabulary", ar: "المفردات" },
        start: { en: "Basic & Fragmented (Simple nouns and numbers)", ar: "أساسي ومجزأ (أسماء وأرقام بسيطة)" },
        now: { en: "Advanced & Expressive ('Confident', 'Generous', 'Receipt' - Knowing the 'p' is silent!)", ar: "متقدم ومعبر ('Confident', 'Generous', 'Receipt')" }
      },
      {
        category: { en: "Sentence Structure", ar: "بنية الجملة" },
        start: { en: "Word-by-word / Messy ('Where the water?', 'Ali is a small cat')", ar: "كلمة بكلمة / غير منظم ('Where the water?')" },
        now: { en: "Accurate & Correct ('Where is the cat?', 'I gave the book to her')", ar: "دقيق وصحيح ('Where is the cat?')" }
      },
      {
        category: { en: "Conversational Flow", ar: "تدفق المحادثة" },
        start: { en: "1-word answers ('10')", ar: "إجابات من كلمة واحدة ('10')" },
        now: { en: "Complex Future Planning ('I am going to travel to Riyadh for two days.')", ar: "تخطيط مستقبلي معقد ('I am going to travel to Riyadh...')" }
      }
    ],
    gapAnalysis: {
      points: [
        {
          title: { en: "Phonics & Pronunciation Trap", ar: "فخ النطق والصوتيات" },
          description: { 
            en: "You are still struggling with vowel sounds, often confusing 'buy' with 'boy', or 'some' with a different sound. You also try to pronounce 'Silent Letters' (like the 'W' in write or 'K' in know).", 
            ar: "لا تزال تعاني من أصوات الحروف المتحركة، وغالباً ما تخلط بين 'buy' و 'boy'. كما تحاول نطق 'الأحرف الصامتة'." 
          }
        },
        {
          title: { en: "The 'I Read But Don't Understand' Gap", ar: "فجوة 'أقرأ ولكن لا أفهم'" },
          description: { 
            en: "You decode English word-by-word. This means by the time you finish reading a sentence, you have forgotten the meaning of the beginning. You are reading letters, not contexts.", 
            ar: "تقوم بفك تشفير اللغة الإنجليزية كلمة بكلمة. هذا يعني أنك بحلول الوقت الذي تنتهي فيه من قراءة الجملة، تكون قد نسيت معنى البداية." 
          }
        },
        {
          title: { en: "Arabic Literal Translation", ar: "الترجمة الحرفية العربية" },
          description: { 
            en: "When you speak, you build the sentence in Arabic first. This causes you to drop the 'Be' verb entirely (Copula drop) and severely slows down your ability to speak smoothly.", 
            ar: "عندما تتحدث، تقوم ببناء الجملة باللغة العربية أولاً. يؤدي هذا إلى إسقاط فعل 'الكينونة' تماماً ويبطئ قدرتك على التحدث بسلاسة." 
          }
        }
      ]
    }
  };

  const t = (obj: any) => obj[lang];

  return (
    <div className={`min-h-screen bg-[#F6F6F6] ${isRtl ? 'rtl text-right font-arabic' : 'text-left font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5 font-sans">
        <div className="max-w-[1140px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all">
               <ArrowLeft className={`w-6 h-6 text-[#26B7FF] ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white shadow-lg">
                <Trophy size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#333333]">Milestone<span className="text-[#26B7FF]">Report</span></span>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="flex items-center gap-2 bg-[#26B7FF] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-[#26B7FF]/20 hover:scale-105 transition-transform">
            <Languages size={18} />
            <span>{isRtl ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </nav>

      <main className="max-w-[1140px] mx-auto px-6 py-16 space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <div className="inline-block px-4 py-1.5 bg-[#FDE700] rounded-full text-[12px] font-bold tracking-widest uppercase text-[#333333]">LEARNING MILESTONE REPORT</div>
          <h1 className="text-[36px] md:text-[48px] font-extrabold text-[#333333] leading-tight">
             {student.name}'s Milestone Report
          </h1>
          <div className="max-w-4xl mx-auto bg-white p-10 rounded-[32px] shadow-card relative overflow-hidden text-start border border-gray-100">
             <div className="flex items-start gap-6 relative z-10">
                <Sparkles className="text-[#FDE700] shrink-0 mt-1" size={32} />
                <p className="text-xl md:text-2xl text-[#666666] leading-relaxed font-medium italic opacity-95">"{t(reportData.executiveSummary)}"</p>
             </div>
             <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-50/50 rounded-full" />
          </div>
        </section>

        {/* Transformation Section */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#26B7FF]/10 rounded-2xl flex items-center justify-center text-[#26B7FF]"><TrendingUp size={24} /></div>
            <h2 className="text-[28px] font-bold text-[#333333]">{isRtl ? 'التحول: قبل وبعد' : 'The Transformation: Before & After'}</h2>
          </div>
          <div className="grid gap-6">
            {reportData.transformation.map((item, i) => (
              <div key={i} className="bg-white p-4 md:p-8 rounded-[24px] shadow-card grid grid-cols-1 md:grid-cols-10 items-center gap-6 border border-white transition-all group">
                <div className="md:col-span-2 space-y-1">
                  <span className="text-[10px] font-bold text-[#26B7FF] uppercase tracking-[2px]">CATEGORY</span>
                  <p className="text-xl font-bold text-[#333333]">{t(item.category)}</p>
                </div>
                <div className="md:col-span-4 bg-[#F6F6F6] p-5 rounded-2xl space-y-1 shadow-inner border border-black/5">
                  <span className="text-[10px] font-bold text-[#666666] uppercase">START</span>
                  <div className="text-[15px] text-[#666666] font-medium leading-relaxed">{t(item.start)}</div>
                </div>
                <div className="md:col-span-4 bg-[#26B7FF]/5 p-5 rounded-2xl space-y-1 border border-[#26B7FF]/10">
                  <span className="text-[10px] font-bold text-[#26B7FF] uppercase">NOW</span>
                  <div className="text-[15px] font-bold text-[#26B7FF] leading-relaxed">🚀 {t(item.now)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gap Analysis - 修复按钮点击显示更多案例 */}
        <section className="bg-[#282828] text-white rounded-[40px] p-8 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#26B7FF]/20 blur-[120px] rounded-full opacity-50" />
          <div className="relative z-10 space-y-16">
            <div className="flex justify-between items-end gap-6 text-start">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-4 text-[#FDE700]"><AlertCircle size={36} /><h2 className="text-3xl md:text-4xl font-bold">{isRtl ? 'تحليل الفجوة' : "The 'Gap' Analysis"}</h2></div>
                <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed opacity-80">{isRtl ? 'يظهر تحليلنا العميق فجوات محددة تعيق تقدمك.' : "Our deep analysis shows specific 'Gaps' that are holding you back."}</p>
              </div>
              <button 
                onClick={() => setShowFullGap(!showFullGap)} 
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full text-sm font-bold transition-all border border-white/10 shrink-0"
              >
                {showFullGap ? (isRtl ? 'عرض أقل' : 'Show Less') : (isRtl ? 'View Details' : 'View Details')}
              </button>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 text-start`}>
              {reportData.gapAnalysis.points.map((point, idx) => (
                <div key={idx} className={`space-y-6 group transition-all duration-500`}>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-[#FDE700] text-xl">0{idx + 1}</div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">{t(point.title)}</h3>
                  {/* 点击 View Details 后展示详细文案 */}
                  {showFullGap && <p className="text-white/50 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2">{t(point.description)}</p>}
                  <div className="h-0.5 w-12 bg-[#FDE700]/30 group-hover:w-full transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap - 修复 Module Details 按钮点击效果 */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#FDE700]/10 rounded-2xl flex items-center justify-center text-[#333333] border border-[#FDE700]/20 shadow-inner"><Map size={24} /></div>
            <h2 className="text-[28px] font-bold text-[#333333]">{isRtl ? 'خارطة الطريق' : 'Custom Learning Roadmap'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
            {[0, 1].map((idx) => (
              <div key={idx} className="bg-white p-8 md:p-12 rounded-[32px] shadow-card border-t-[10px] border-[#FDE700] space-y-8 group transition-all">
                <div className="space-y-2">
                  <h3 className="text-[#26B7FF] font-bold uppercase tracking-[2px] text-xs">PHASE {idx + 1}</h3>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#333333]">{idx === 0 ? '[A0] Knowledge' : '[A1] Skills'}</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-[#26B7FF]/10 rounded-full flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="text-[#26B7FF]" size={16} /></div>
                  <p className="text-[#666666] text-lg leading-relaxed italic opacity-80">{idx === 0 ? 'Fixes sounds confusion.' : 'Attacks the comprehension gap.'}</p>
                </div>
                <button 
                  onClick={() => setActiveModule(activeModule === idx ? null : idx)} 
                  className={`w-full py-4 rounded-full border-2 transition-all flex items-center justify-center gap-3 font-bold ${activeModule === idx ? 'bg-[#26B7FF] text-white border-[#26B7FF]' : 'border-[#26B7FF] text-[#26B7FF] hover:bg-[#26B7FF] hover:text-white'}`}
                >
                   {isRtl ? 'تفاصيل الوحدة' : 'Module Details'}
                   <ChevronRight size={18} className={`${isRtl ? 'rotate-180' : ''} ${activeModule === idx ? 'translate-x-1' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
