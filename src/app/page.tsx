import Link from 'next/link';
import { getStudents } from '@/lib/db';
import { FileText, Plus, User, Calendar, ArrowRight } from 'lucide-react';

// 核心：强制不缓存，确保每次访问首页都能看到最新报告
export const revalidate = 0;

export default async function Dashboard() {
  const students = await getStudents();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="mt-2 text-gray-500 font-medium">Manage Student Milestone Reports</p>
        </div>
        <Link
          href="/new"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-2xl text-black bg-[#FDE700] hover:bg-[#EED600] transition-all shadow-sm hover:shadow-md active:scale-95 gap-2 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          New Report
        </Link>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-[32px] border border-gray-100 p-6 sm:p-10 shadow-sm min-h-[400px]">
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-[#0066FF]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Reports Yet</h3>
            <p className="text-gray-500 max-w-sm mb-8 font-medium">
              Start by generating a deep-dive analysis report for your first student.
            </p>
            <Link
              href="/new"
              className="text-[#0066FF] font-bold flex items-center gap-2 hover:gap-3 transition-all"
            >
              Create Report <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student: any) => (
              <Link 
                key={student.id} 
                href={`/report/${student.id}`}
                className="group bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <User className="w-6 h-6 text-gray-400 group-hover:text-[#0066FF]" />
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-[#0066FF] text-xs font-bold rounded-full">
                    Report
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#0066FF] transition-colors">
                  {student.name}
                </h3>
                <p className="text-gray-400 text-sm font-medium mb-4">ID: {student.studentId}</p>
                <div className="flex items-center text-gray-400 text-xs font-medium gap-2 border-t pt-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(student.createdAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
