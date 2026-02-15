
import React from 'react';
import { useTranslation } from '../contexts';

export const TechEducation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-slate-950 border-b border-slate-900">
       <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.education.title}</h2>
             <p className="text-slate-400 max-w-2xl mx-auto">{t.education.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Card 1: LLM */}
             <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all group">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                   </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t.education.llm.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{t.education.llm.desc}</p>
                <div className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full w-fit">
                  {t.education.llm.tag}
                </div>
             </div>

             {/* Card 2: MCP */}
             <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all group">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                   </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t.education.mcp.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{t.education.mcp.desc}</p>
                 <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                  {t.education.mcp.tag}
                </div>
             </div>

             {/* Card 3: Automation */}
             <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all group">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t.education.auto.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{t.education.auto.desc}</p>
                 <div className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full w-fit">
                  {t.education.auto.tag}
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};
