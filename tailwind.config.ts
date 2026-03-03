import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // ⚠️ 关键修复：确保这里指向了 src 目录
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 你的视觉规范定义的颜色系统
        primary: "#26B7FF",      // 主蓝色
        accent: "#FDE700",       // 辅助黄色 (CTA)
        text: {
          main: "#333333",       // 主文字色
          secondary: "#666666",  // 次要文字
          white: "#FFFFFF",      // 反白文字
        },
        bg: {
          primary: "#FFFFFF",    // 卡片/内容背景
          secondary: "#F6F6F6",  // 页面灰底
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"], // 绑定 Poppins
      },
      borderRadius: {
        'card': '20px',    // 卡片圆角
        'pill': '50px',    // 按钮胶囊形状
      },
      boxShadow: {
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        'cta': '0 4px 15px rgba(253, 231, 0, 0.4)', // 黄色按钮光晕
        'hover': '0 20px 40px -10px rgba(38, 183, 255, 0.15)', // 蓝色悬停光晕
      },
      spacing: {
        'section': '80px', // 模块留白
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;