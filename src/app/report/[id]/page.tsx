import { getStudents } from '@/lib/db';
import ReportView from '@/components/ReportView';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function Page({ params }: { params: { id: string } }) {
  const students = await getStudents();
  const student = students.find((s: any) => s.id === params.id);

  if (!student) {
    notFound();
  }

  return <ReportView student={student} />;
}
