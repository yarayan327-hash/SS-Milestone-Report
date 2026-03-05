import { getStudents } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, GraduationCap, Lightbulb, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const revalidate = 0;

export default async function ReportPage({ params }: { params: { id: string } }) {
  const students = await getStudents();
  // 根据 URL 中的 ID 查找对应的学生报告
  const student = students.find((s: any) => s.id === params.id);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-gray-800">Report Not Found</h2>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Calendar className="w-4 h-4" />
          {new Date(student.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* 核心卡片 */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
        {/* 头部装饰 */}
        <div className="bg-[#0066FF] p-8 sm:p-12 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">{student.name}</h1>
                <p className="text-white/80 font-medium mt-1 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Student ID: {student.studentId}
                </p>
              </div>
            </div>
            <div className="px-6 py-3 bg-[#FDE700] text-black font-bold rounded-2xl shadow-lg">
              Milestone Report
            </div>
          </div>
        </div>

        {/* 报告正文渲染区 */}
        <div className="p-8 sm:p-12">
          <div className="prose prose-blue max-w-none 
            prose-headings:font-bold prose-headings:text-gray-900
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-li:text-gray-600
            prose-table:border prose-table:rounded-xl prose-table:overflow-hidden
            prose-th:bg-gray-50 prose-th:p-4
            prose-td:p-4 prose-td:border-t">
            
            {/* 使用 ReactMarkdown 完美还原你输入的所有文案（包括表格和阿拉伯语） */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {student.reportContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100 flex items-start gap-4">
          <Lightbulb className="w-6 h-6 text-[#0066FF] shrink-0 mt-1" />
          <p className="text-sm text-blue-800 leading-relaxed font-medium">
            This report is generated based on deep-dive intuition analysis and official B1 syllabus mapping.
          </p>
        </div>
        <div className="bg-yellow-50/50 p-6 rounded-[32px] border border-yellow-100 flex items-start gap-4">
          <Target className="w-6 h-6 text-yellow-700 shrink-0 mt-1" />
          <p className="text-sm text-yellow-800 leading-relaxed font-medium">
            Next steps: Follow the customized Roadmap sessions to maintain progress consistency.
          </p>
        </div>
      </div>
    </div>
  );
}
