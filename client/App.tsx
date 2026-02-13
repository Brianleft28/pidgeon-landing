import React, { createContext, useContext, useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesGrid } from './components/ServicesGrid';
import { RDDSection } from './components/RDDSection';
import { TeamSection } from './components/TeamSection';
import { FAQ } from './components/FAQ';
// import { VeoDemo } from './components/VeoDemo'; // Lab Disabled
import { ContactCTA } from './components/TerminalContact';
import { ContactModal } from './components/ContactModal';
import { Language, translations } from './i18n';
import { DynamicBackground } from './components/DynamicBackground';

interface LanguageContextType {
  lang: Language;
  t: typeof translations.EN;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within LanguageProvider");
  return context;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('EN');
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  // Language Auto-detection
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0].toUpperCase();
    if (browserLang === 'ES') {
      setLang('ES');
    }
  }, []);

  const t = translations[lang];

  const handleOpenContact = () => setIsContactOpen(true);
  const handleCloseContact = () => setIsContactOpen(false);

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-100">
        
        <DynamicBackground />
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        <Header onOpenContact={handleOpenContact} />
        
        <main className="relative z-10">
          <Hero onOpenContact={handleOpenContact} />
          <AboutSection />
          <ServicesGrid />
          <RDDSection />
          {/* <VeoDemo /> Lab temporarily disabled */}
          <TeamSection />
          <FAQ />
          <ContactCTA />
        </main>

        <ContactModal isOpen={isContactOpen} onClose={handleCloseContact} />

        <footer className="relative z-10 py-12 border-t border-slate-900 bg-slate-950/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
               {/* Logo Icon - See README for asset placement */}
               <img src="/assets/logo-icon.png" alt="Pidgeon Logo" className="w-8 h-8 object-contain opacity-80" />
               <span className="font-bold tracking-tight text-white">Pidgeon<span className="text-emerald-500 font-normal">Solutions</span></span>
            </div>
            <div className="text-sm text-slate-500">
              © 2025 Pidgeon Solutions. Your Digital Partner.
            </div>
          </div>
        </footer>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;