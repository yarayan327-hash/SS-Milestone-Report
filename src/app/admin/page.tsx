'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        studentId: formData.get('studentId'),
        reportContent: formData.get('reportContent'),
      };

      const res = await fetch('/api/students', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        alert('Failed to save report');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary p-8 md:py-12">
      <div className="max-w-[800px] mx-auto">
        <Link href="/" className="inline-flex items-center text-text-secondary hover:text-primary mb-8 transition-colors font-semibold">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </Link>

        <div className="bg-bg-primary rounded-card shadow-card p-8 md:p-12 border-t-8 border-primary">
          <div className="flex items-center gap-4 mb-10">
             <div className="p-4 bg-accent rounded-full text-text-main shadow-lg">
                <Sparkles size={28} strokeWidth={2.5} />
             </div>
             <h1 className="text-[32px] font-bold text-text-main tracking-tight">Generate New Report</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[14px] font-bold text-text-main mb-3 uppercase tracking-wide">Student Name</label>
                <input 
                  name="name" 
                  required 
                  className="w-full bg-bg-secondary border-2 border-transparent focus:border-primary rounded-xl p-4 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                  placeholder="e.g. Ahmed Ali"
                />
              </div>
              <div>
                <label className="block text-[14px] font-bold text-text-main mb-3 uppercase tracking-wide">Student ID</label>
                <input 
                  name="studentId" 
                  required 
                  className="w-full bg-bg-secondary border-2 border-transparent focus:border-primary rounded-xl p-4 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                  placeholder="e.g. STU-711"
                />
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-bold text-text-main mb-3 uppercase tracking-wide">
                Report Content (Markdown)
              </label>
              <textarea 
                name="reportContent" 
                required 
                className="w-full h-[400px] bg-bg-secondary border-2 border-transparent focus:border-primary rounded-xl p-6 focus:ring-4 focus:ring-primary/10 outline-none font-mono text-[14px] leading-relaxed resize-none text-text-main"
                placeholder="# Paste the Gemini markdown content here..."
              />
            </div>

            {/* Primary CTA Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent text-text-main text-[16px] font-bold py-4 rounded-pill shadow-cta hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (
                <>
                  <Save size={20} strokeWidth={2.5} />
                  Save & Publish Report
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}