import React from 'react';

// New, more professional placeholder logos
const LogoAero: React.FC<{className?: string}> = ({className}) => (
  <svg viewBox="0 0 170 30" className={className} fill="currentColor">
    <path d="M0 15 L20 5 L20 25 Z" />
    <text x="30" y="21" fontSize="16" fontWeight="bold" fontFamily="sans-serif">AeroLogistics</text>
  </svg>
);

const LogoClinic: React.FC<{className?: string}> = ({className}) => (
  <svg viewBox="0 0 130 30" className={className} fill="currentColor">
    <circle cx="12" cy="15" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 10 V 20 M 7 15 H 17" stroke="currentColor" strokeWidth="2" />
    <text x="32" y="21" fontSize="16" fontWeight="bold" fontFamily="sans-serif">ClinicNet</text>
  </svg>
);

const LogoGov: React.FC<{className?: string}> = ({className}) => (
  <svg viewBox="0 0 130 30" className={className} fill="currentColor">
    <path d="M5 25 V 5 L 12.5 10 L 20 5 V 25 H 5 Z" />
    <text x="30" y="21" fontSize="16" fontWeight="bold" fontFamily="sans-serif">InfraGov</text>
  </svg>
);

const LogoIndustries: React.FC<{className?: string}> = ({className}) => (
  <svg viewBox="0 0 180 30" className={className} fill="currentColor">
    <path d="M10 2.5 L20 7.5 L20 17.5 L10 22.5 L0 17.5 L0 7.5 Z" />
    <text x="30" y="21" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Axon Industries</text>
  </svg>
);


export const ClientsSection: React.FC = () => {
  return (
    <section className="py-12 border-y border-slate-900 bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-12 gap-y-8">
          
          {/* Logo 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <LogoAero className="h-6 w-auto text-slate-500 transition-all duration-300 group-hover:text-emerald-100 group-hover:scale-110 relative z-10" />
          </div>

          {/* Logo 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <LogoClinic className="h-6 w-auto text-slate-500 transition-all duration-300 group-hover:text-cyan-100 group-hover:scale-110 relative z-10" />
          </div>

          {/* Logo 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <LogoGov className="h-6 w-auto text-slate-500 transition-all duration-300 group-hover:text-violet-100 group-hover:scale-110 relative z-10" />
          </div>

          {/* Logo 4 */}
          <div className="group relative">
             <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <LogoIndustries className="h-6 w-auto text-slate-500 transition-all duration-300 group-hover:text-amber-100 group-hover:scale-110 relative z-10" />
          </div>

        </div>
      </div>
    </section>
  );
};