import React, { useState, useEffect } from 'react';
import { useTranslation } from '../App';

interface HeaderProps {
  onOpenContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenContact }) => {
  const { lang, t, setLang } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Scroll Spy & Navbar Visibility Logic
  useEffect(() => {
    const handleScroll = () => {
      // Navbar appears only after scrolling past 75% of the viewport (Hero section)
      const heroThreshold = window.innerHeight * 0.75;
      setIsVisible(window.scrollY > heroThreshold);

      // Simple Scroll Spy
      const sections = ['about', 'services', 'rdd', 'team', 'faq'];
      let current = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the section is within the viewport (with some offset)
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const NavItem = ({ id, label }: { id: string, label: string }) => (
    <button 
      onClick={() => scrollTo(id)} 
      className={`text-sm font-medium transition-all duration-300 relative group ${
        activeSection === id ? 'text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'text-slate-400 hover:text-white'
      }`}
    >
      {label}
      <span className={`absolute -bottom-1 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${activeSection === id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
    </button>
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 transform ${
          isVisible
            ? "translate-y-0 opacity-100 py-4"
            : "-translate-y-full opacity-0 py-6 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between px-6 py-3 rounded-full bg-[#0a0a0a]/80 backdrop-blur-md border border-slate-800/50 shadow-lg shadow-black/5">
            {/* Brand Logo - Animated */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full opacity-50 animate-pulse"></div>
                <img
                  src="/assets/team/logos/logo.png"
                  alt="Pidgeon Solutions"
                  onError={(e) => (e.currentTarget.src = '/logo.png')}
                  className="relative h-10 w-auto invert brightness-0 saturate-0 opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110"
                />
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <NavItem id="about" label={t.navAbout} />
              <NavItem id="services" label={t.navServices} />
              <NavItem id="rdd" label={t.navWork} />
              <NavItem id="team" label={t.navTeam} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-900/50 rounded-lg px-2 py-1 border border-slate-800/50">
                <button
                  onClick={() => setLang("EN")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${lang === "EN" ? "text-white bg-slate-800" : "hover:text-slate-300"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang("ES")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${lang === "ES" ? "text-white bg-slate-800" : "hover:text-slate-300"}`}
                >
                  ES
                </button>
              </div>

              <button
                onClick={onOpenContact}
                className="px-5 py-2 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                {t.btnContact}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Scroll To Top Arrow */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-40 p-3 rounded-full bg-slate-900 border border-emerald-500/50 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-500 transform hover:bg-emerald-500 hover:text-slate-950 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </>
  );
};