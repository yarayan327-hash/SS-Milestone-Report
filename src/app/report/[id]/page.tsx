import { getStudentById } from '@/lib/db';
import ReportView from '@/components/ReportView';
import { notFound } from 'next/navigation';

// 移除静态生成，因为现在是连接云端动态数据库
export const dynamic = 'force-dynamic';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. 异步解析路由参数
  const resolvedParams = await params;
  
  // 2. 异步从云端数据库获取该学生的数据
  const student = await getStudentById(resolvedParams.id);

  // 3. 如果没找到，返回 404 页面
  if (!student) {
    notFound();
  }

  // 4. 将提取的数据传递给 Lumina 风格的客户端组件渲染
  return (
    <ReportView 
      studentName={student.name}
      studentId={student.studentId}
      date={student.createdAt}
    />
  );
}