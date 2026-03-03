// src/app/page.tsx
// 找到组件定义的这一行，加上 async
export default async function Home() {
  // 加上 await
  const students = await getStudents();

  return (
    // ... 下面的 JSX 代码完全保持不变 ...