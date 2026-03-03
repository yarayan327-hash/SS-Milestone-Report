import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// 配置 Poppins 字体，包含 400, 600, 800 字重
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Student Milestone Reporting System",
  description: "Advanced Learning Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans bg-bg-secondary text-text-main antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}