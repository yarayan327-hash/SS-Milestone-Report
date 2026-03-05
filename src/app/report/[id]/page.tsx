import React from 'react';
import { getStudents } from '@/lib/db';
import ReportView from '@/components/ReportView'; // 确保路径正确
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function Page({ params }: { params: { id: string } }) {
  const students = await getStudents();
  const student = students.find((s: any) => s.id === params.id);

  if (!student) {
    notFound();
  }

  // 将真实数据传递给客户端组件进行漂亮展示
  return <ReportView student={student} />;
}
