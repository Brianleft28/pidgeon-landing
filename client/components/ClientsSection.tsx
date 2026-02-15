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
    <section className="py-12 border-y border-slate-900 bg-slate-950">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-12 gap-y-8 opacity-40">
          <LogoAero className="h-6 w-auto text-slate-400" />
          <LogoClinic className="h-6 w-auto text-slate-400" />
          <LogoGov className="h-6 w-auto text-slate-400" />
          <LogoIndustries className="h-6 w-auto text-slate-400" />
        </div>
      </div>
    </section>
  );
};