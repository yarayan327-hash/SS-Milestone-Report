import { kv } from '@vercel/kv';
import { StudentReport } from '@/types';

export interface Student {
  id: string;
  name: string;
  studentId: string;
  reportContent: string;
  createdAt: string;
}

export const getStudents = async (): Promise<Student[]> => {
  try {
    // 尝试从云端 Redis 获取数据
    const students = await kv.get<Student[]>('students');
    return students || [];
  } catch (error) {
    console.error("❌ 数据库连接失败:", error);
    // 即使数据库没连上，也返回空数组，防止网页白屏崩溃
    return [];
  }
};

export const addStudent = async (student: Omit<Student, 'id' | 'createdAt'>) => {
  try {
    const students = await getStudents();
    const newStudent: Student = {
      ...student,
      // 生成 7 位极短的专属链接 ID
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    students.unshift(newStudent);
    // 保存回云端 Redis
    await kv.set('students', students);
    return newStudent;
  } catch (error) {
    console.error("❌ 数据保存失败:", error);
    throw new Error("Failed to save student data");
  }
};

export const getStudentById = async (id: string): Promise<Student | undefined> => {
  try {
    const students = await getStudents();
    return students.find((s) => s.id === id);
  } catch (error) {
    console.error("❌ 获取学生数据失败:", error);
    return undefined;
  }
};
