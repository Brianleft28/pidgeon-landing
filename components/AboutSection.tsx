import React from 'react';
import { useTranslation } from '../App';

export const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="min-h-[50vh] flex items-center bg-slate-950 relative overflow-hidden py-16">
      {/* Background Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-80"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Removed mx-auto and md:text-center to align left */}
        <div className="max-w-3xl text-left">
          
          {/* Badge Removed as requested */}

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
            {t.aboutTitle}
          </h2>
          
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light mb-12">
            {t.aboutBody}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
             {/* Pillars as compact features */}
             <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition-colors">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{t.pillars.clarity.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{t.pillars.clarity.desc}</p>
                </div>
             </div>

             <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition-colors">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{t.pillars.efficiency.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{t.pillars.efficiency.desc}</p>
                </div>
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};