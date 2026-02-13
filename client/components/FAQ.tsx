import React, { useState } from 'react';
import { useTranslation } from '../App';

export const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = t.faq.items;

  return (
    <section id="faq" className="min-h-[100dvh] flex flex-col justify-center py-24 bg-slate-950 relative border-t border-slate-900">
       {/* Ambient glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
       
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">{t.faq.title}</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">{t.faq.subtitle}</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div key={index} className="border border-slate-800 rounded-2xl bg-slate-900/40 overflow-hidden transition-all duration-300 hover:border-slate-700">
                <button 
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-slate-800/30 transition-colors"
                >
                  <span className="font-semibold text-slate-200 text-lg">{item.question}</span>
                  <span className={`transform transition-transform duration-300 text-emerald-500 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-slate-800/50">
                    <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};