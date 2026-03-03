import Link from 'next/link';
import { getStudents } from '@/lib/db';
import { Plus, FileText, User, ChevronRight } from 'lucide-react';

// 强制动态渲染，确保每次访问首页都能拿到云端最新数据
export const dynamic = 'force-dynamic';

export default async function Home() {
  // 异步获取学生数据
  const students = await getStudents();

  return (
    <main className="min-h-screen p-8 md:py-12 bg-[#F6F6F6]">
      <div className="max-w-[1140px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div>
            <h1 className="text-[41px] font-extrabold text-text-main tracking-tight">Dashboard</h1>
            <p className="text-[16px] text-text-secondary mt-2">Manage Student Milestone Reports</p>
          </div>
          
          {/* Primary CTA Button: Yellow #FDE700 */}
          <Link 
            href="/admin" 
            className="group bg-accent text-text-main text-[16px] font-semibold px-8 py-3 rounded-pill shadow-cta hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>New Report</span>
          </Link>
        </div>

        {/* Empty State */}
        {(!students || students.length === 0) ? (
          <div className="text-center py-24 bg-white rounded-card shadow-card flex flex-col items-center border border-gray-50">
            <div className="bg-bg-secondary p-6 rounded-full mb-6">
              <FileText size={48} className="text-primary opacity-50" />
            </div>
            <h3 className="text-[20px] font-bold text-text-main mb-3">No Reports Yet</h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Start by generating a deep-dive analysis report for your first student.
            </p>
            <Link 
              href="/admin" 
              className="text-primary font-bold hover:underline flex items-center gap-1"
            >
              Create Report <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          /* Card Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {students.map((student) => (
              <div key={student.id} className="bg-bg-primary p-8 rounded-card shadow-card hover:shadow-hover transition-all duration-300 group border border-transparent hover:border-primary/10 relative overflow-hidden">
                
                {/* ID Badge */}
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <User size={24} strokeWidth={2.5} />
                  </div>
                  <span className="text-[14px] font-bold bg-bg-secondary text-text-secondary px-4 py-1 rounded-pill group-hover:bg-accent group-hover:text-text-main transition-colors">
                    {student.studentId}
                  </span>
                </div>
                
                {/* Content */}
                <h3 className="text-[20px] font-bold text-text-main mb-2 truncate">{student.name}</h3>
                <p className="text-[14px] text-text-secondary mb-8 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Generated: {new Date(student.createdAt).toLocaleDateString()}
                </p>

                {/* Secondary Button Style: Border Blue */}
                <Link 
                  href={`/report/${student.id}`}
                  className="w-full border-2 border-primary text-primary font-semibold py-3 rounded-pill flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <FileText size={18} />
                  View Report
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
