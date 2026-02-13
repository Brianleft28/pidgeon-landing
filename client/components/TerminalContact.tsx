import React from 'react';
import { useTranslation } from '../App';

export const ContactCTA: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-slate-900/20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r from-cyan-500/10 to-violet-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
            {t.ctaTitle}
          </h2>
          <p className="text-lg text-slate-400 mb-12 font-light">
            {t.ctaSubtitle}
          </p>
          
          <a 
            href="mailto:hello@pidgeon.solutions"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-lg hover:bg-cyan-50 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            {t.btnContact}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};