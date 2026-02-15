
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesGrid } from './components/ServicesGrid';
import { RDDSection } from './components/RDDSection';
import { TeamSection } from './components/TeamSection';
import { ContactCTA } from './components/TerminalContact';
import { FAQSection } from './components/FAQSection';
import { Language, translations } from './i18n';
import { DynamicBackground } from './components/DynamicBackground';
import { ContactModal } from './components/ContactModal';
import { PaymentModal } from './components/PaymentModal';
import { FloatingActions } from './components/FloatingActions';

import { LanguageContext, ModalContext } from './contexts';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ES'); // Default to ES
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const [contactPlan, setContactPlan] = useState<string | undefined>(undefined);
  const [paymentDetails, setPaymentDetails] = useState<{name: string, amount: number}>({ name: '', amount: 0 });

  const t = translations[lang];

  const openContactModal = (planName?: string) => {
    setContactPlan(planName);
    setIsContactModalOpen(true);
  };

  const openPaymentModal = (planName: string, amount: number) => {
      setPaymentDetails({ name: planName, amount });
      setIsPaymentModalOpen(true);
  }

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      <ModalContext.Provider value={{ openContactModal, openPaymentModal }}>
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-100 scroll-smooth">
          
          <DynamicBackground />
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          </div>

          <Header />
          
          <main className="relative z-10 flex flex-col gap-0">
            {/* 1. Hero (100vh) */}
            <Hero />
            
            {/* 2. About Section (Hablamos tu idioma) */}
            <AboutSection />

            {/* 3. Technology Hub (Education + Terminal + Veo/Nano) */}
            <RDDSection />

            {/* 4. Services */}
            <ServicesGrid />

            {/* 5. Team Section */}
            <TeamSection />
            <FAQSection />
            <ContactCTA />
          </main>

          <FloatingActions />
          
          <ContactModal 
            isOpen={isContactModalOpen} 
            onClose={() => setIsContactModalOpen(false)} 
            preselectedPlan={contactPlan}
          />

          <PaymentModal 
             isOpen={isPaymentModalOpen}
             onClose={() => setIsPaymentModalOpen(false)}
             planName={paymentDetails.name}
             amount={paymentDetails.amount}
          />

          <footer className="relative z-10 py-8 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                 <img src="/assets/logo.png" alt="Pidgeon Solutions" className="h-8 w-auto object-contain invert brightness-0 filter" />
              </div>
              <div className="text-sm text-slate-500">
                © 2026 Pidgeon Solutions.
              </div>
            </div>
          </footer>
        </div>
      </ModalContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;
