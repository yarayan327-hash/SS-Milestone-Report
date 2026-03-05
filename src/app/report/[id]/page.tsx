import React from 'react';
import Link from 'next/link';
import { getStudents } from '@/lib/db';
import { ArrowLeft, Award, TrendingUp, User, AlertTriangle, Map, GraduationCap } from 'lucide-react';

// 强制不缓存，确保数据实时抓取
export const revalidate = 0;

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  // 1. 从数据库获取真实数据
  const students = await getStudents();
  const student = students.find((s: any) => s.id === params.id);

  // 2. 找不到学员时返回提示
  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <h2 className="text-2xl font-bold text-[#333333]">Report Not Found</h2>
        <Link href="/" className="mt-4 text-[#26B7FF] hover:underline font-bold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // 3. 渲染页面（严格去除 <html> 和 <body> 标签，仅保留组件内容）
  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#333333] pb-20 font-sans">
      
      {/* 顶部 Header：遵循你的品牌蓝色规范 */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-[1140px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-95">
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
          <p className="text-[18px] sm:text-[20px] text-[#666666] leading-relaxed">
            Congratulations on your fantastic progress! Below is the professional analysis of your current English journey.
          </p>
        </section>

        {/* 核心数据展示卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { label: 'Vocabulary', status: 'Advanced', icon: <Award className="text-[#26B7FF]" />, progress: '90%' },
            { label: 'Grammar', status: 'Accurate', icon: <TrendingUp className="text-[#26B7FF]" />, progress: '85%' },
            { label: 'Flow', status: 'Fluent', icon: <User className="text-[#26B7FF]" />, progress: '80%' }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl">{item.icon}</div>
                <h4 className="text-[20px] font-bold">{item.label}</h4>
              </div>
              <div className="h-2 bg-gray-100 rounded-full mb-4">
                <div className="h-full bg-[#26B7FF] rounded-full" style={{ width: item.progress }}></div>
              </div>
              <p className="text-[#26B7FF] font-bold">🚀 {item.status}</p>
            </div>
          ))}
        </div>

        {/* 报告详细内容渲染区 */}
        <section className="bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="prose prose-slate max-w-none whitespace-pre-wrap text-[#333333] leading-relaxed font-poppins">
            {student.reportContent}
          </div>
        </section>

        {/* 底部寄语 */}
        <footer className="bg-[#333333] text-white p-12 rounded-[32px] text-center shadow-lg">
          <h3 className="text-[24px] font-bold mb-4">Final Encouragement</h3>
          <p className="max-w-2xl mx-auto text-[#CCCCCC] mb-8 italic">
            "Your language intuition is a rare gift. Keep trusting your gut and breaking the translation habit!"
          </p>
          <div className="inline-flex items-center gap-2 text-[#FDE700] font-bold px-6 py-3 border border-[#FDE700]/30 rounded-2xl">
            <Award size={20} />
            <span>I am incredibly proud of your results!</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
