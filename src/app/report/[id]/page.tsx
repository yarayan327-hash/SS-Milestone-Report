import React from 'react';
import Link from 'next/link';
import { getStudents } from '@/lib/db';
import { ArrowLeft, Award, TrendingUp, User, AlertTriangle, Map, GraduationCap } from 'lucide-react';

// 强制不缓存，确保每次访问都去数据库拿最新的 Ziad 或其他学生报告
export const revalidate = 0;

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  // 1. 从数据库获取真实数据
  const students = await getStudents();
  const student = students.find((s: any) => s.id === params.id);

  // 2. 如果找不到报告，显示 404
  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold">Report Not Found</h2>
        <Link href="/" className="mt-4 text-[#26B7FF] hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  // 注意：此处移除了 "use client"，因为服务端组件渲染更稳定，不容易报 Hydration 错误
  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#333333] pb-20 font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-[1140px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
          
          <div className="hidden sm:block px-4 py-1.5 bg-blue-50 text-[#26B7FF] rounded-full text-xs font-bold uppercase tracking-wider">
            Verified Milestone
          </div>
        </div>
      </header>

      <main className="max-w-[1140px] mx-auto px-6 pt-10 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1 bg-[#FDE700] rounded-full text-[14px] font-bold text-[#333333] uppercase">
            Executive Summary
          </div>
          <h2 className="text-[32px] sm:text-[41px] font-bold text-[#333333] leading-tight">
            Learning Milestone Report
          </h2>
          <p className="text-[18px] sm:text-[20px] text-[#666666] leading-relaxed italic">
            "Congratulations on your fantastic progress! You have transitioned beautifully to building full, impressive sentences."
          </p>
        </section>

        {/* Transformation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Vocabulary', now: 'Advanced & Expressive', icon: <Award className="text-[#26B7FF]" />, val: '90%' },
            { label: 'Sentence Structure', now: 'Accurate & Correct', icon: <TrendingUp className="text-[#26B7FF]" />, val: '85%' },
            { label: 'Flow', now: 'Complex Planning', icon: <User className="text-[#26B7FF]" />, val: '80%' }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">{item.icon}</div>
                <h4 className="text-[20px] font-bold">{item.label}</h4>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full mb-4">
                <div className="h-full bg-[#26B7FF] rounded-full" style={{ width: item.val }}></div>
              </div>
              <p className="text-[#26B7FF] font-bold">🚀 {item.now}</p>
            </div>
          ))}
        </div>

        {/* 报告正文 (这里展示你输入的 Ziad 详细内容) */}
        <section className="bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-gray-50 prose prose-blue max-w-none">
           <div className="whitespace-pre-wrap text-[#333333] leading-relaxed">
              {student.reportContent}
           </div>
        </section>

        {/* Roadmap */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <Map className="text-[#26B7FF] w-10 h-10" />
            <h3 className="text-[32px] font-bold">Learning Roadmap</h3>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[20px] border-2 border-[#26B7FF] relative">
              <span className="absolute top-0 right-8 -translate-y-1/2 bg-[#26B7FF] text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Phase 1</span>
              <h4 className="text-[20px] font-bold text-[#26B7FF] mb-2">[A0] Knowledge: Foundation Repair</h4>
              <p className="text-[#666666]">Fixing phonics rules to cure confusion between sounds like 'buy' and 'boy'.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#333333] text-white p-12 rounded-[32px] text-center">
          <h3 className="text-[24px] font-bold mb-4">Final Encouragement</h3>
          <p className="max-w-2xl mx-auto text-[#CCCCCC] leading-relaxed mb-8">
            Do not let the habit of Arabic translation slow down your bright mind. Trust your feelings!
          </p>
          <div className="inline-flex items-center gap-2 text-[#FDE700] font-bold px-6 py-3 border border-[#FDE700]/30 rounded-2xl">
            <Award size={20} />
            <span>I am incredibly proud of you!</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
