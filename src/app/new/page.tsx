"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, User, Hash, FileText, Loader2 } from 'lucide-react';

export default function NewReport() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    reportContent: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // 成功后强制刷新并返回首页
        router.push('/');
        router.refresh();
      } else {
        alert('Failed to save report');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Report</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" /> Student Name
            </label>
            <input
              required
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g. Dalia"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Hash className="w-4 h-4" /> Student ID
            </label>
            <input
              required
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g. 60377857"
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Milestone Report (Markdown)
          </label>
          <textarea
            required
            rows={12}
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
            placeholder="Paste your analysis report here..."
            value={formData.reportContent}
            onChange={(e) => setFormData({...formData, reportContent: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#FDE700] hover:bg-[#EED600] disabled:opacity-50 text-black font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {loading ? 'Generating...' : 'Generate & Save Report'}
        </button>
      </form>
    </div>
  );
}
