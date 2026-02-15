
import React, { useEffect, useState } from 'react';
import { useTranslation, useModal } from '../contexts';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t, lang, setLang } = useTranslation();
  const { openContactModal } = useModal();
  const [isVisible, setIsVisible] = useState(false);

  // Handle delay for unmount animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500); // Match transition duration
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const scrollTo = (id: string) => {
    onClose();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const navItems = [
    { id: 'about', label: t.navAbout, num: '01' },
    { id: 'services', label: t.navServices, num: '02' },
    { id: 'rdd', label: t.navWork, num: '03' },
    { id: 'team', label: t.navTeam, num: '04' },
    { id: 'faq', label: 'FAQ', num: '05' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar Panel */}
      <div 
        className={`relative w-full max-w-[400px] h-full bg-[#020617]/95 border-l border-slate-800 shadow-2xl flex flex-col transition-transform duration-500 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Background Noise/Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-emerald-500/0 via-emerald-500/20 to-emerald-500/0"></div>

        {/* Header: Logo & Close */}
        <div className="flex items-center justify-between p-8 border-b border-slate-900 relative z-10">
          <div className="flex items-center gap-3">
             <img src="/assets/logo.png" alt="Pidgeon" className="h-8 w-auto invert brightness-0 filter" />
          </div>
          <button 
            onClick={onClose}
            className="group p-2 rounded-full border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all"
            aria-label="Close Menu"
          >
            <svg className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col justify-center relative z-10">
            <div className="text-xs font-mono text-emerald-500 mb-6 tracking-widest">[ SYSTEM_NAVIGATION ]</div>
            
            <nav className="space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollTo(item.id)}
                        className="group w-full flex items-center justify-between py-4 border-b border-slate-900 hover:border-emerald-900/50 transition-all text-left"
                    >
                        <span className="text-3xl font-light text-slate-300 group-hover:text-white transition-colors tracking-tight">
                            {item.label}
                        </span>
                        <div className="flex items-center gap-3 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                             <span className="text-xs font-mono text-emerald-500">/{item.num}</span>
                             <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                    </button>
                ))}
            </nav>

            {/* Actions */}
            <div className="mt-12 space-y-6">
                <button 
                    onClick={() => {
                        onClose();
                        openContactModal();
                    }}
                    className="w-full py-4 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                    {t.btnContact}
                </button>

                <div className="grid grid-cols-2 gap-4">
                     <button 
                        onClick={() => setLang('ES')} 
                        className={`py-3 text-xs font-bold border rounded-lg transition-all ${lang === 'ES' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-slate-800 text-slate-500 hover:border-slate-600'}`}
                     >
                        ESPAÑOL
                     </button>
                     <button 
                        onClick={() => setLang('EN')} 
                        className={`py-3 text-xs font-bold border rounded-lg transition-all ${lang === 'EN' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-slate-800 text-slate-500 hover:border-slate-600'}`}
                     >
                        ENGLISH
                     </button>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-900 bg-slate-950/50 relative z-10">
            <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-500 font-mono">Pidgeon Solutions © 2026</span>
                <span className="text-[10px] text-slate-600 font-mono">Enterprise Software Architecture</span>
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] text-emerald-500 uppercase tracking-widest">System Online</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
