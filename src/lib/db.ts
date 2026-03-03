import { createClient } from '@supabase/supabase-js';

export interface Student {
  id: string;
  name: string;
  studentId: string;
  reportContent: string;
  createdAt: string;
}

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 初始化 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseKey);

export const getStudents = async (): Promise<Student[]> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Supabase 连接失败:", error);
    return [];
  }
};

export const addStudent = async (student: Omit<Student, 'id' | 'createdAt'>) => {
  try {
    const newStudent: Student = {
      ...student,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('students')
      .insert([newStudent])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("❌ 数据保存失败:", error);
    throw new Error("Failed to save student data");
  }
};

export const getStudentById = async (id: string): Promise<Student | undefined> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ 获取学生数据失败:", error);
    return undefined;
  }
};
