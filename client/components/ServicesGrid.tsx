import React, { useState } from 'react';
import { useTranslation } from '../App';

type BillingCycle = 'monthly' | 'yearly';
type Plan = {
  id: string;
  title: string;
  price_mo: string;
  price_yr: string;
  price_unit_mo: string;
  price_unit_yr: string;
  desc: string;
  features: string[];
  recommended?: boolean;
};

const CheckIcon: React.FC = () => (
  <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

export const ServicesGrid: React.FC = () => {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const plans = t.pricing.plans as Plan[];

  const handleSelectPlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) setSelectedPlan(plan);
  };

  const closeModal = () => setSelectedPlan(null);

  const getPriceValue = (priceStr: string) => {
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  return (
    <section id="services" className="min-h-[100dvh] flex flex-col justify-center py-24 sm:py-32 bg-slate-950 relative overflow-hidden">
      {/* Top Banner */}
      <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 p-2 text-center text-sm font-semibold text-white animate-fade-in-down">
        {t.pricing.offerBanner}
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.servicesTitle}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t.pricing.subtitle}</p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={`font-medium transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>{t.pricing.monthly}</span>
          <div className="relative">
            <input 
              type="checkbox" 
              id="billing-toggle" 
              className="sr-only" 
              checked={billingCycle === 'yearly'}
              onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            />
            <label htmlFor="billing-toggle" className="w-12 h-6 rounded-full bg-slate-800 flex items-center p-1 cursor-pointer transition-colors border border-slate-700">
              <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ease-in-out ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`}></div>
            </label>
          </div>
          <span className={`font-medium transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>{t.pricing.yearly}</span>
          <div className="hidden sm:block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">{t.pricing.save} 30%</div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {plans.map((plan) => {
            const monthlyPrice = getPriceValue(plan.price_mo);
            const yearlyPrice = getPriceValue(plan.price_yr);
            const annualCostIfMonthly = monthlyPrice * 12;
            const savings = annualCostIfMonthly - yearlyPrice;
            const hasSavings = savings > 0 && monthlyPrice > 0;

            return (
              <div key={plan.id} className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${
                plan.recommended 
                  ? 'bg-slate-900 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:shadow-[0_0_50px_rgba(16,185,129,0.25)]' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-emerald-500/20">
                    {t.pricing.bestChoice}
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white mb-2">{plan.title}</h3>
                <p className="text-slate-400 text-sm mb-6 min-h-[40px]">{plan.desc}</p>
                
                <div className="my-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      {billingCycle === 'monthly' ? plan.price_mo : plan.price_yr}
                    </span>
                    <span className="text-slate-500">
                      {billingCycle === 'monthly' ? plan.price_unit_mo : plan.price_unit_yr}
                    </span>
                  </div>
                  
                  <div className="h-6 mt-1 text-sm font-medium">
                    {hasSavings && (
                      billingCycle === 'yearly' ? (
                        <span className="text-emerald-400 flex items-center gap-1 animate-pulse">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {t.pricing.saved} ${savings}
                        </span>
                      ) : (
                        <span className="text-emerald-500/70 text-xs">
                           {t.pricing.switchToYearly} <span className="text-emerald-400 font-bold">${savings}/{t.pricing.year}</span>
                        </span>
                      )
                    )}
                  </div>
                </div>
                
                <button onClick={() => handleSelectPlan(plan.id)} className={`w-full py-3 mt-auto rounded-xl font-semibold transition-all ${plan.recommended ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                  {t.pricing.choosePlan}
                </button>
                
                <div className="h-px w-full bg-slate-800 my-8"></div>
                
                <ul className="space-y-4">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                      <CheckIcon />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Automation & Consulting Special Section */}
        <div className="max-w-6xl mx-auto mb-20 bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                         {t.automation.badge}
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">{t.automation.title}</h3>
                    <p className="text-slate-400 max-w-xl leading-relaxed">
                        {t.automation.desc}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-6">
                        {t.automation.tags.map((tag, i) => (
                             <span key={i} className="px-3 py-1 rounded-md bg-slate-950 border border-slate-700 text-slate-400 text-xs font-mono">
                                 {tag}
                             </span>
                        ))}
                    </div>
                </div>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})} className="shrink-0 px-8 py-4 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
                    {t.automation.cta}
                </button>
            </div>
        </div>

      </div>
      
      {/* Modal */}
      {selectedPlan && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn" 
          onClick={closeModal}
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md m-4 shadow-2xl shadow-black/50 animate-fade-in-up flex flex-col max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-white mb-2">{t.pricing.modal.title}</h3>
            <p className="text-slate-400 mb-6">{t.pricing.modal.subtitle}</p>
            <div className="space-y-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{t.pricing.modal.plan}</span>
                    <span className="font-semibold text-white">{selectedPlan.title}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{t.pricing.modal.billingCycle}</span>
                    <span className="font-semibold text-white">{billingCycle === 'monthly' ? t.pricing.monthly : t.pricing.yearly}</span>
                </div>
                <div className="border-t border-slate-700 my-2"></div>
                <div className="flex justify-between items-center text-lg">
                    <span className="text-slate-300 font-medium">{t.pricing.modal.total}</span>
                    <span className="font-bold text-emerald-400">
                        {billingCycle === 'monthly' ? selectedPlan.price_mo : selectedPlan.price_yr}
                    </span>
                </div>
            </div>
            
            <div className="mt-8 flex flex-col gap-3">
                {/* Mercado Pago */}
                <button className="w-full px-6 py-3 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-400 transition-colors shadow-[0_0_20px_rgba(56,189,248,0.2)] flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8zm8-6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm-1 8h2v2h-2v-2zm0-6h2v4h-2V8z"/>
                    </svg>
                    {t.pricing.modal.payButton}
                </button>

                {/* PayPal */}
                <button className="w-full px-6 py-3 rounded-lg bg-[#0070BA] text-white font-semibold hover:bg-[#003087] transition-colors shadow-[0_0_20px_rgba(0,112,186,0.2)] flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.946 5.438-3.158 7.12-6.594 7.12H10.5l-.962 6.032a.641.641 0 0 1-.632.534c-.076.002-.147.008-.22.016zm.18-18.337l-2.43 15.337h3.064l2.43-15.337H7.256z"/>
                    </svg>
                    {t.pricing.modal.payButtonPaypal}
                </button>

                {/* Stripe / Card */}
                <button className="w-full px-6 py-3 rounded-lg bg-[#635BFF] text-white font-semibold hover:bg-[#4338CA] transition-colors shadow-[0_0_20px_rgba(99,91,255,0.2)] flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    {t.pricing.modal.payButtonStripe}
                </button>

                <button onClick={closeModal} className="w-full px-6 py-3 rounded-lg bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-colors mt-2">
                    {t.pricing.modal.close}
                </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </section>
  );
};