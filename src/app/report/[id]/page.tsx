import { notFound } from 'next/navigation';
import ReportView from '@/components/ReportView';
import { getStudents } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
  const reportId = decodeURIComponent(params.id || '').trim();

  if (!reportId) {
    notFound();
  }

  const students = await getStudents();
  const student = students.find((item: any) => String(item.id) === reportId);

  if (!student) {
    notFound();
  }

  return <ReportView student={student} />;
}
