import { NextResponse } from 'next/server';
import { addStudent, getStudents } from '@/lib/db';

export async function GET() {
  const students = await getStudents();
  return NextResponse.json(students);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, studentId, reportContent } = body;
    
    if (!name || !studentId || !reportContent) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 注意这里加了 await
    const newStudent = await addStudent({ name, studentId, reportContent });
    return NextResponse.json(newStudent);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}