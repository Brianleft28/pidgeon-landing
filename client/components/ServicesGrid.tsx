
import React, { useState } from 'react';
import { useTranslation, useModal } from '../contexts';
import { PricingBackground } from './PricingBackground';
import { IconStarter, IconBusiness, IconEnterprise } from './PlanIcons';

type BillingCycle = 'monthly' | 'yearly';
type Feature = { name: string; tooltip?: string; };
type Plan = {
  id: string;
  title: string;
  price_mo_num: number;
  price_yr_num: number;
  price_unit_mo: string;
  price_unit_yr: string;
  currency: string;
  desc: string;
  ctaTooltip?: string;
  features: Feature[];
  notIncluded?: Feature[];
  recommended?: boolean;
};

const CheckIcon: React.FC = () => (
  <svg className="w-4 h-4 text-emerald-500 shrink-0 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
);

const XIcon: React.FC = () => (
  <svg className="w-4 h-4 text-slate-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
);

const InfoIcon: React.FC = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const FeatureItem: React.FC<{ name: string, tooltip?: string, included: boolean }> = ({ name, tooltip, included }) => (
    <li className="flex items-start gap-3 text-xs md:text-sm relative group/item">
        <div className="mt-0.5" aria-hidden="true">{included ? <CheckIcon /> : <XIcon />}</div>
        <div className="relative w-full flex items-center flex-wrap gap-1">
             <span 
                className={`block ${included ? 'text-slate-300' : 'text-slate-600 line-through decoration-slate-700'}`}
             >
                {name}
             </span>
             {tooltip && (
                <div className="relative inline-flex items-center">
                    <button 
                        type="button"
                        className="text-slate-600 hover:text-emerald-400 focus:text-emerald-400 transition-colors cursor-help ml-1 outline-none"
                        aria-label={`Info about ${name}`}
                        aria-describedby={`tooltip-${name.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                        <InfoIcon />
                    </button>
                    
                    <div 
                        id={`tooltip-${name.replace(/\s+/g, '-').toLowerCase()}`}
                        role="tooltip"
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 px-3 py-2 bg-slate-900/95 backdrop-blur-md text-slate-200 text-xs rounded-md border border-slate-700 opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100 transition-opacity pointer-events-none shadow-xl z-50 text-center select-none"
                    >
                        {tooltip}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-900"></div>
                    </div>
                </div>
             )}
        </div>
        <span className="sr-only">{included ? 'Included' : 'Not included'}: {name} {tooltip ? `- ${tooltip}` : ''}</span>
    </li>
);

export const ServicesGrid: React.FC = () => {
  const { t } = useTranslation();
  const { openPaymentModal, openContactModal } = useModal();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const plans = t.pricing.plans as Plan[];

  const schema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "Pidgeon Solutions Pricing Plans",
    "description": t.pricing.subtitle,
    "itemListElement": plans.map((plan, index) => ({
      "@type": "Offer",
      "position": index + 1,
      "name": plan.title,
      "description": plan.desc,
      "price": plan.id === 'enterprise' ? plan.price_mo_num : (billingCycle === 'monthly' ? plan.price_mo_num : plan.price_yr_num),
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": plan.id === 'enterprise' ? plan.price_mo_num : (billingCycle === 'monthly' ? plan.price_mo_num : plan.price_yr_num),
        "priceCurrency": "USD",
        "referenceQuantity": {
          "@type": "QuantitativeValue",
          "value": "1",
          "unitCode": plan.id === 'enterprise' ? "C62" : (billingCycle === 'monthly' ? "MON" : "ANN")
        }
      },
      "url": "https://pidgeonsolutions.com/#services"
    }))
  };

  const getIcon = (id: string) => {
    switch(id) {
        case 'starter': return <IconStarter className="w-16 h-16" />;
        case 'business': return <IconBusiness className="w-16 h-16" />;
        case 'enterprise': return <IconEnterprise className="w-16 h-16" />;
        default: return <IconStarter className="w-16 h-16" />;
    }
  };

  // Helper to calculate savings percentage based on Starter plan logic (usually 100 vs 1000)
  const calculateDiscount = () => {
    const starter = plans.find(p => p.id === 'starter');
    if (!starter) return 17; // Default approx
    const monthlyCostYearly = starter.price_mo_num * 12;
    const yearlyCost = starter.price_yr_num;
    const savings = ((monthlyCostYearly - yearlyCost) / monthlyCostYearly) * 100;
    return Math.round(savings);
  }

  return (
    <section id="services" className="min-h-screen flex flex-col justify-center py-24 bg-slate-950 relative overflow-hidden" aria-label="Pricing Plans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      {/* A) Background Video (Veo) Simulation */}
      <PricingBackground />
      {/* Depth Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Centered Header Block */}
        <div className="flex flex-col items-center text-center mb-12 gap-8">
            <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">{t.servicesTitle}</h2>
                <p className="text-slate-400 text-lg font-light">{t.pricing.subtitle}</p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
                {/* High-Tech Toggle Switch */}
                <div className="relative inline-flex items-center bg-black/40 border border-slate-700 rounded-full p-1 cursor-pointer" role="group" aria-label="Billing Cycle Selection">
                    {/* Active Pill Background */}
                    <div 
                        className={`absolute top-1 bottom-1 rounded-full bg-emerald-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)] ${billingCycle === 'monthly' ? 'left-1 w-[100px]' : 'left-[104px] w-[90px]'}`} 
                    ></div>

                    <button 
                        onClick={() => setBillingCycle('monthly')}
                        aria-pressed={billingCycle === 'monthly'}
                        className={`relative z-10 w-[100px] py-2 text-xs font-bold uppercase tracking-wider transition-colors ${billingCycle === 'monthly' ? 'text-slate-950' : 'text-slate-500 hover:text-white'}`}
                    >
                        {t.pricing.monthly}
                    </button>
                    <button 
                        onClick={() => setBillingCycle('yearly')}
                        aria-pressed={billingCycle === 'yearly'}
                        className={`relative z-10 w-[90px] py-2 text-xs font-bold uppercase tracking-wider transition-colors ${billingCycle === 'yearly' ? 'text-slate-950' : 'text-slate-500 hover:text-white'}`}
                    >
                        {t.pricing.yearly}
                    </button>
                </div>

                {/* Discount Indicator Bar */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                        {billingCycle === 'yearly' ? `AHORRASTE ${calculateDiscount()}%` : `AHORRÁ ${calculateDiscount()}% EN EL ANUAL`}
                    </span>
                </div>
            </div>
        </div>

        {/* Pricing Cards - High Density Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-20" role="list">
          {plans.map((plan) => {
            // Enterprise logic: Fixed price, ignore toggle
            const isEnterprise = plan.id === 'enterprise';
            const currentPrice = isEnterprise ? plan.price_mo_num : (billingCycle === 'monthly' ? plan.price_mo_num : plan.price_yr_num);
            const currentUnit = isEnterprise ? '' : (billingCycle === 'monthly' ? plan.price_unit_mo : plan.price_unit_yr);

            return (
              <article key={plan.id} role="listitem" 
                className={`
                    relative flex flex-col p-8 rounded-2xl border backdrop-blur-xl transition-all duration-500
                    ${plan.recommended 
                        ? 'bg-black/40 border-emerald-500/50 shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)] scale-[1.02] z-10' 
                        : 'bg-black/20 border-white/10 hover:border-emerald-500/30 hover:bg-black/40'
                    }
                `}
              >
                {/* Floating 3D Icon (Nano Banana) */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20">
                    {getIcon(plan.id)}
                </div>

                {/* Content */}
                <div className="mt-8 text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                    <p className="text-slate-400 text-xs min-h-[32px]">{plan.desc}</p>
                </div>
                
                {/* Monospaced Price */}
                <div className="text-center mb-8 border-y border-white/5 py-4 bg-white/5 rounded-lg" aria-label={`${plan.currency}${currentPrice} ${currentUnit}`}>
                  <div className="flex items-baseline justify-center gap-1 font-mono tracking-tighter">
                      <span className="text-lg text-emerald-500">{plan.currency}</span>
                      <span className="text-4xl font-bold text-white">{currentPrice}</span>
                      <span className="text-slate-500 text-sm">{currentUnit}</span>
                  </div>
                </div>
                
                <div className="relative group/tooltip w-full mb-8">
                    <button 
                        onClick={() => openPaymentModal(plan.title, currentPrice)} 
                        aria-label={`${t.pricing.choosePlan} ${plan.title}`}
                        className={`w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all 
                        ${plan.recommended 
                            ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                        }`}
                    >
                      {t.pricing.choosePlan}
                    </button>
                    {plan.ctaTooltip && (
                      <div role="tooltip" className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] px-3 py-1.5 bg-slate-800 text-emerald-400 text-xs font-semibold rounded-md border border-slate-700 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-xl z-20 text-center select-none">
                          {plan.ctaTooltip}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-800"></div>
                      </div>
                    )}
                </div>
                
                {/* High Density List */}
                <ul className="space-y-3 flex-1" aria-label={`Features of ${plan.title}`}>
                  {plan.features.map((feat, i) => <FeatureItem key={`inc-${i}`} name={feat.name} tooltip={feat.tooltip} included={true} />)}
                  {plan.notIncluded?.map((feat, i) => <FeatureItem key={`exc-${i}`} name={feat.name} tooltip={feat.tooltip} included={false} />)}
                </ul>

                 {plan.recommended && (
                  <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
                )}
              </article>
            );
          })}
        </div>

        {/* Integrated Automation Strip - Glassmorphism */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">{t.automation.title}</h3>
                    <p className="text-sm text-slate-400 max-w-md">{t.automation.desc}</p>
                </div>
            </div>
            <button 
                onClick={() => openContactModal('Consulting')} 
                className="relative z-10 px-8 py-3 bg-white text-slate-950 text-sm font-bold rounded-xl hover:bg-cyan-50 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap"
            >
                {t.automation.cta}
            </button>
        </div>
      </div>
    </section>
  );
};
