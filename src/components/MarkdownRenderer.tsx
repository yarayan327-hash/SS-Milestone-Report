import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

interface Props {
  content: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  return (
    <div className="w-full font-sans">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // H1: 隐藏（因为我们在页面顶部已经单独写了更漂亮的大标题）
          h1: () => null,

          // H2: 对应 "The Gap Analysis", "Roadmap" 等板块标题
          h2: ({ children }) => (
            <div className="flex items-center gap-3 mt-12 mb-6 border-l-4 border-primary pl-4">
              <h2 className="text-[24px] font-bold text-gray-800 tracking-tight">
                {children}
              </h2>
            </div>
          ),

          // H3: 子标题
          h3: ({ children }) => (
            <h3 className="text-[18px] font-bold text-gray-700 mt-6 mb-3">
              {children}
            </h3>
          ),

          // 段落 P: 处理各种特殊的提示框 (Gap, Risk, Roadmap)
          p: ({ children }) => {
            const text = String(children);
            
            // ⚠️ 红色/黄色风险警告 (Gap Analysis)
            if (text.includes('⚠️') || text.includes('Critical Risk')) {
              return (
                <div className="bg-[#FFF9E6] border border-[#FFE082] rounded-xl p-6 my-6 flex items-start gap-4 shadow-sm">
                  <div className="bg-[#FFC107] p-2 rounded-full text-white mt-1">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">Critical Insight</h4>
                    <p className="text-gray-700 leading-relaxed m-0">{children}</p>
                  </div>
                </div>
              );
            }
            // 🌟 亮点/摘要 (Executive Summary)
            if (text.includes('🌟') || text.includes('✨') || text.includes('🎓')) {
              return (
                <div className="bg-[#F0F9FF] border border-[#BDE0FE] rounded-xl p-6 my-6 flex items-start gap-4 shadow-sm">
                   <div className="bg-primary p-2 rounded-full text-white mt-1">
                    <Lightbulb size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed m-0 font-medium">{children}</p>
                  </div>
                </div>
              );
            }
            // 🚀 路线图 (Roadmap)
            if (text.includes('🚀')) {
               return (
                <div className="bg-white border-l-4 border-accent p-6 rounded-r-xl my-6 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent-dark font-bold">
                    <CheckCircle size={20} className="text-[#D4AF37]" />
                  </div>
                  <p className="text-gray-800 font-medium m-0">{children}</p>
                </div>
              );
            }

            return <p className="text-[16px] text-[#4A5568] leading-8 mb-6">{children}</p>;
          },

          // 列表 UL
          ul: ({ children }) => <ul className="space-y-3 mb-8">{children}</ul>,
          
          // 列表项 LI: 给每个列表项加个小图标
          li: ({ children }) => (
            <li className="flex items-start gap-3 text-[#4A5568] leading-7">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>{children}</span>
            </li>
          ),

          // 表格 Table: 变成 "卡片网格" 布局 (对应 Transformation 部分)
          table: ({ children }) => (
            <div className="overflow-x-auto my-10">
              <table className="w-full text-left border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-50 border-b-2 border-gray-100">{children}</thead>,
          th: ({ children }) => <th className="px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">{children}</th>,
          tr: ({ children }) => <tr className="border-b border-gray-100 last:border-0 hover:bg-blue-50/30 transition-colors bg-white">{children}</tr>,
          td: ({ children }) => <td className="px-6 py-4 text-sm text-gray-600 border-r border-transparent last:border-0 align-top">{children}</td>,

          // 引用 Blockquote: 变成大号字体样式
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic text-gray-600 text-lg bg-gray-50 rounded-r-lg">
              {children}
            </blockquote>
          ),
          
          strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};