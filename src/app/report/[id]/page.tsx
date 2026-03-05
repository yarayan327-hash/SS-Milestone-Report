import React from 'react';
import Link from 'next/link';
import { getStudents } from '@/lib/db';
import { ArrowLeft, GraduationCap, Award, TrendingUp, User, Map, AlertTriangle } from 'lucide-react';

// 核心设置：强制不缓存，确保每次访问都能从数据库读取 Ziad 的真实最新数据
export const revalidate = 0;

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  // 1. 获取数据库真实数据
  const students = await getStudents();
  const student = students.find((s: any) => s.id === params.id);

  // 2. 找不到数据时的友好提示
  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#333333]">
        <h2 className="text-2xl font-bold">Report Not Found</h2>
        <Link href="/" className="mt-4 text-[#26B7FF] hover:underline font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // 3. 返回渲染内容（严格禁止包含 <html> 或 <body>）
  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#333333] pb-20 font-sans">
      
      {/* 顶部 Header：遵循你的品牌蓝色视觉规范 */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-[1140px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90">
              <ArrowLeft className="w-6 h-6 text-[#26B7FF]" />
            </Link>
            <div className="flex items-center gap-3 border-s ps-4 border-gray-100">
              <div className="w-10 h-10 bg-[#26B7FF] rounded-xl flex items-center justify-center text-white shadow-sm">
                <GraduationCap size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">{student.name}</h1>
                <p className="text-[12px] text-[#666666]">ID: {student.studentId}</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-1.5 bg-blue-50 text-[#26B7FF] rounded-full text-xs font-bold uppercase tracking-wider">
            Verified Milestone
          </div>
        </div>
      </header>

      <main className="max-w-[1140px] mx-auto px-6 pt-10 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1 bg-[#FDE700] rounded-full text-[14px] font-bold text-[#333333] uppercase shadow-sm">
            Executive Summary
          </div>
          <h2 className="text-[32px] sm:text-[41px] font-bold text-[#333333] leading-tight">
            Learning Milestone Report
          </h2>
          <p className="text-[18px] sm:text-[20px] text-[#666666] leading-relaxed italic border-s-4 border-[#FDE700] ps-6 py-2">
            "Congratulations on your fantastic progress! You have transitioned beautifully to building full, impressive sentences."
          </p>
        </section>

        {/* 关键数据卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { label: 'Vocabulary', now: 'Advanced', icon: <Award className="text-[#26B7FF]" />, progress: '90%' },
            { label: 'Structure', now: 'Accurate', icon: <TrendingUp className="text-[#26B7FF]" />, progress: '85%' },
            { label: 'Flow', now: 'Complex', icon: <User className="text-[#26B7FF]" />, progress: '80%' }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl">{item.icon}</div>
                <h4 className="text-[20px] font-bold">{item.label}</h4>
              </div>
              <div className="h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-[#26B7FF] rounded-full" style={{ width: item.progress }}></div>
              </div>
              <p className="text-[#26B7FF] font-bold">🚀 {item.now}</p>
            </div>
          ))}
        </div>

        {/* 报告主体：将完整显示 Ziad 的详情文案 */}
        <section className="bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="prose prose-slate max-w-none whitespace-pre-wrap text-[#333333] leading-relaxed font-poppins text-[16px]">
            {student.reportContent}
          </div>
        </section>

        {/* Roadmap 提示 */}
        <section className="bg-white p-8 rounded-[20px] border-2 border-[#26B7FF] flex items-start gap-6">
          <Map className="text-[#26B7FF] w-10 h-10 shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-2">Upcoming Roadmap</h3>
            <p className="text-[#666666] leading-relaxed">
              Phase 1: Foundation Repair (Sessions 1-8). We will focus exclusively on Advanced Phonics Rules to eliminate specific phonetic confusions.
            </p>
          </div>
        </section>

        {/* 底部语 */}
        <footer className="bg-[#333333] text-white p-12 rounded-[32px] text-center shadow-lg">
          <h3 className="text-[24px] font-bold mb-4 tracking-tight">Final Encouragement</h3>
          <p className="max-w-2xl mx-auto text-[#CCCCCC] mb-8 leading-relaxed italic">
            "Ziad, you have a brilliant language intuition. Do not let the habit of Arabic translation slow down your bright mind. I am incredibly proud of you!"
          </p>
          <div className="inline-flex items-center gap-2 text-[#FDE700] font-bold px-6 py-3 border border-[#FDE700]/30 rounded-2xl">
            <Award size={20} />
            <span>EXCELLENT PROGRESS</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
