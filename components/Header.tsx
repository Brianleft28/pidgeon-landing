
import React, { useState, useEffect } from 'react';
import { useTranslation, useModal } from '../App';
import { Sidebar } from './Sidebar';

export const Header: React.FC = () => {
  const { lang, t, setLang } = useTranslation();
  const { openContactModal } = useModal();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle Scroll Visibility (Show immediately after scrolling)
  useEffect(() => {
    const handleScroll = () => {
      // Show navbar as soon as user scrolls 10px
      setIsVisible(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Active Section Highlighting
  useEffect(() => {
    const sections = ['about', 'services', 'rdd', 'team', 'faq', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 } // Trigger when 40% of section is visible
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center justify-between px-6 py-3 rounded-full bg-[#0a0a0a]/90 backdrop-blur-md border border-slate-800 shadow-2xl shadow-black/50">
            
            {/* Logo - Inverted for dark mode compatibility with black asset */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img 
                src="/logo.png" 
                alt="Pidgeon Solutions" 
                className="h-8 w-auto object-contain invert brightness-0 filter animate-subtle-pulse" 
              />
            </div>

            {/* Desktop Nav - Hidden on smaller screens, can be enabled if preferred, but Sidebar covers all */}
            <div className="hidden lg:flex items-center gap-8">
              <button 
                  onClick={() => scrollTo('about')} 
                  className={`text-sm font-medium transition-colors ${activeSection === 'about' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
              >
                  {t.navAbout}
              </button>
              <button 
                  onClick={() => scrollTo('services')} 
                  className={`text-sm font-medium transition-colors ${activeSection === 'services' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
              >
                  {t.navServices}
              </button>
              <button 
                  onClick={() => scrollTo('rdd')} 
                  className={`text-sm font-medium transition-colors ${activeSection === 'rdd' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
              >
                  {t.navWork}
              </button>
               <button 
                  onClick={() => scrollTo('team')} 
                  className={`text-sm font-medium transition-colors ${activeSection === 'team' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
              >
                  {t.navTeam}
              </button>
            </div>

            {/* Actions & Sidebar Toggle */}
            <div className="flex items-center gap-4">
              {/* Language Switcher - Desktop */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-900/50 rounded-lg px-2 py-1 border border-slate-800/50">
                <button 
                  onClick={() => setLang('EN')} 
                  className={`px-1.5 py-0.5 rounded transition-colors ${lang === 'EN' ? 'text-white bg-slate-800' : 'hover:text-slate-300'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang('ES')} 
                  className={`px-1.5 py-0.5 rounded transition-colors ${lang === 'ES' ? 'text-white bg-slate-800' : 'hover:text-slate-300'}`}
                >
                  ES
                </button>
              </div>
              
              {/* CTA - Hidden on very small screens to make room for menu */}
              <button 
                onClick={() => openContactModal()}
                className="hidden sm:block px-5 py-2 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                {t.btnContact}
              </button>

              {/* Sidebar Hamburger Button */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-slate-400 hover:text-white transition-colors border-l border-slate-800 pl-4 ml-2"
                aria-label="Open Menu"
              >
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                 </svg>
              </button>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes subtlePulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          .animate-subtle-pulse {
            animation: subtlePulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </nav>

      {/* Render Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};
