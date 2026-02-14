import React, { useState } from 'react';
import { useTranslation } from '../App';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-800">
      <button 
        className="w-full py-6 flex items-center justify-between text-left group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-emerald-400' : 'text-slate-300 group-hover:text-white'}`}>
          {question}
        </span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : 'text-slate-500'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
      >
        <div 
            className="text-slate-400 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </div>
  );
};

export const FAQSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="faq" className="min-h-screen flex flex-col justify-center py-24 bg-slate-950">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.faq.title}</h2>
          <p className="text-slate-400">{t.faq.subtitle}</p>
        </div>
        
        <div className="bg-slate-900/40 rounded-3xl p-8 md:p-12 border border-slate-800">
          {t.faq.items.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};