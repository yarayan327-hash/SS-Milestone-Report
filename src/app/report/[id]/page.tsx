import { getStudentById } from '@/lib/db';
import ReportView from '@/components/ReportView';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const student = await getStudentById(resolvedParams.id);

  if (!student) {
    notFound();
  }

  return (
    <ReportView 
      studentName={student.name}
      studentId={student.studentId}
      date={student.createdAt}
    />
  );
}
