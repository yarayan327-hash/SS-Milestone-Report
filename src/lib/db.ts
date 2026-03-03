import { kv } from '@vercel/kv';
import { StudentReport } from '@/types';

export interface Student {
  id: string;
  name: string;
  studentId: string;
  reportContent: string; // 暂时保留这个字段兼容你现有的 API
  createdAt: string;
}

export const getStudents = async (): Promise<Student[]> => {
  // 从云端 Redis 获取数据
  const students = await kv.get<Student[]>('students');
  return students || [];
};

export const addStudent = async (student: Omit<Student, 'id' | 'createdAt'>) => {
  const students = await getStudents();
  const newStudent: Student = {
    ...student,
    // 这里生成的就是极短的专属链接 ID
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
  };
  
  students.unshift(newStudent);
  // 保存回云端 Redis
  await kv.set('students', students);
  return newStudent;
};

export const getStudentById = async (id: string): Promise<Student | undefined> => {
  const students = await getStudents();
  return students.find((s) => s.id === id);
};