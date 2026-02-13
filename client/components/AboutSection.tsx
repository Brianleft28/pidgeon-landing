import React from 'react';
import { useTranslation } from '../App';

export const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  const PillarItem = ({ title, desc, icon, delay }: { title: string, desc: string, icon: React.ReactNode, delay: string }) => (
    <div className={`relative p-6 pt-10 group transition-all duration-500 hover:bg-slate-800/50 rounded-xl ${delay}`}>
      
      {/* Connector Line (Visual) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-emerald-500/50 to-slate-800/0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>

      <div className="mb-4 w-12 h-12 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">{desc}</p>
    </div>
  );

  return (
    <section id="about" className="min-h-[100dvh] flex flex-col justify-center py-24 bg-slate-900 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_#0f172a_50%,_#020617_100%)]"></div>
      <div className="absolute inset-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Main "Motherboard" Container */}
        <div className="max-w-5xl mx-auto border border-slate-800 bg-slate-950/50 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
          
          {/* Top Section: The "CPU" / Main Text */}
          <div className="relative p-8 md:p-16 text-center border-b border-slate-800 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.1)]">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
               {t.aboutBadge}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              {t.aboutTitle}
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light max-w-3xl mx-auto">
              {t.aboutBody}
            </p>

            {/* Visual Circuit Traces extending down */}
            <div className="absolute bottom-0 left-0 w-full flex justify-around px-4 md:px-16 pointer-events-none opacity-20">
                <div className="w-px h-8 bg-emerald-500"></div>
                <div className="w-px h-8 bg-emerald-500"></div>
                <div className="w-px h-8 bg-emerald-500"></div>
            </div>
          </div>

          {/* Bottom Section: The Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-slate-950/80">
            <PillarItem 
              delay=""
              title={t.pillars.clarity.title}
              desc={t.pillars.clarity.desc}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              }
            />
            <PillarItem 
              delay="delay-100"
              title={t.pillars.control.title}
              desc={t.pillars.control.desc}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              }
            />
            <PillarItem 
              delay="delay-200"
              title={t.pillars.efficiency.title}
              desc={t.pillars.efficiency.desc}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              }
            />
          </div>
        </div>

      </div>
    </section>
  );
};