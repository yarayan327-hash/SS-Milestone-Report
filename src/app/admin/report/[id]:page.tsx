import { getStudentById } from '@/lib/db';
import ReportView from '@/components/ReportView';
import { notFound } from 'next/navigation';

// 强制动态渲染，适配云端数据库
export const dynamic = 'force-dynamic';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. 等待解析 URL 里的 ID
  const resolvedParams = await params;
  
  // 2. 加上 await，去云端数据库查询这个学生
  const student = await getStudentById(resolvedParams.id);

  // 3. 没查到就显示 404
  if (!student) {
    notFound();
  }

  // 4. 查到了就渲染页面
  return (
    <ReportView 
      studentName={student.name}
      studentId={student.studentId}
      date={student.createdAt}
    />
  );
}
