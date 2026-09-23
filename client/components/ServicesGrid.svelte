<script lang="ts">
  import { t, openContactModal } from '../stores';
  import PricingBackground from './PricingBackground.svelte';
  import IconStarter from './icons/IconStarter.svelte';
  import IconBusiness from './icons/IconBusiness.svelte';
  import IconEnterprise from './icons/IconEnterprise.svelte';

  type BillingCycle = 'monthly' | 'yearly';
  type Feature = { name: string; tooltip?: string };
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

  let billingCycle = $state<BillingCycle>('monthly');

  let plans = $derived($t.pricing.plans as Plan[]);

  function calculateDiscount(): number {
    const starter = plans.find(p => p.id === 'starter');
    if (!starter) return 17;
    const monthlyCostYearly = starter.price_mo_num * 12;
    const yearlyCost = starter.price_yr_num;
    const savings = ((monthlyCostYearly - yearlyCost) / monthlyCostYearly) * 100;
    return Math.round(savings);
  }
</script>

<section id="services" class="min-h-screen flex flex-col justify-center py-24 bg-slate-950 relative overflow-hidden" aria-label="Pricing Plans">
  <PricingBackground />
  <div class="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>

  <div class="container mx-auto px-6 md:px-12 relative z-10">

    <!-- Header -->
    <div class="flex flex-col items-center text-center mb-12 gap-8">
      <div class="max-w-2xl">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">{$t.servicesTitle}</h2>
        <p class="text-slate-400 text-lg font-light">{$t.pricing.subtitle}</p>
      </div>

      <div class="flex flex-col items-center gap-4">
        <!-- Toggle -->
        <div class="relative inline-flex items-center bg-black/40 border border-slate-700 rounded-full p-1 cursor-pointer" role="group" aria-label="Billing Cycle Selection">
          <div
            class="absolute top-1 bottom-1 rounded-full bg-emerald-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)] {billingCycle === 'monthly' ? 'left-1 w-[100px]' : 'left-[104px] w-[90px]'}"
          ></div>
          <button
            onclick={() => billingCycle = 'monthly'}
            aria-pressed={billingCycle === 'monthly'}
            class="relative z-10 w-[100px] py-2 text-xs font-bold uppercase tracking-wider transition-colors {billingCycle === 'monthly' ? 'text-slate-950' : 'text-slate-500 hover:text-white'}"
          >
            {$t.pricing.monthly}
          </button>
          <button
            onclick={() => billingCycle = 'yearly'}
            aria-pressed={billingCycle === 'yearly'}
            class="relative z-10 w-[90px] py-2 text-xs font-bold uppercase tracking-wider transition-colors {billingCycle === 'yearly' ? 'text-slate-950' : 'text-slate-500 hover:text-white'}"
          >
            {$t.pricing.yearly}
          </button>
        </div>

        <div class="bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            {billingCycle === 'yearly' ? `AHORRASTE ${calculateDiscount()}%` : `AHORRÁ ${calculateDiscount()}% EN EL ANUAL`}
          </span>
        </div>
      </div>
    </div>

    <!-- Plans Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-20" role="list">
      {#each plans as plan}
        {@const isEnterprise = plan.id === 'enterprise'}
        {@const currentPrice = isEnterprise ? plan.price_mo_num : (billingCycle === 'monthly' ? plan.price_mo_num : plan.price_yr_num)}
        {@const currentUnit = isEnterprise ? '' : (billingCycle === 'monthly' ? plan.price_unit_mo : plan.price_unit_yr)}

        <article role="listitem"
          class="relative flex flex-col p-8 rounded-2xl border backdrop-blur-xl transition-all duration-500
            {plan.recommended
              ? 'bg-black/40 border-emerald-500/50 shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)] scale-[1.02] z-10'
              : 'bg-black/20 border-white/10 hover:border-emerald-500/30 hover:bg-black/40'}"
        >
          <!-- Icon -->
          <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20">
            {#if plan.id === 'starter'}
              <IconStarter class="w-16 h-16" />
            {:else if plan.id === 'business'}
              <IconBusiness class="w-16 h-16" />
            {:else}
              <IconEnterprise class="w-16 h-16" />
            {/if}
          </div>

          <div class="mt-8 text-center mb-6">
            <h3 class="text-xl font-bold text-white mb-2">{plan.title}</h3>
            <p class="text-slate-400 text-xs min-h-[32px]">{plan.desc}</p>
          </div>

          <!-- Price -->
          <div class="text-center mb-8 border-y border-white/5 py-4 bg-white/5 rounded-lg" aria-label="{plan.currency}{currentPrice} {currentUnit}">
            <div class="flex items-baseline justify-center gap-1 font-mono tracking-tighter">
              <span class="text-lg text-emerald-500">{plan.currency}</span>
              <span class="text-4xl font-bold text-white">{currentPrice}</span>
              <span class="text-slate-500 text-sm">{currentUnit}</span>
            </div>
          </div>

          <!-- CTA -->
          <div class="relative group/tooltip w-full mb-8">
            <button
              onclick={() => openContactModal(plan.title)}
              aria-label="{$t.pricing.choosePlan} {plan.title}"
              class="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all
                {plan.recommended
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}"
            >
              {$t.pricing.choosePlan}
            </button>
            {#if plan.ctaTooltip}
              <div role="tooltip" class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] px-3 py-1.5 bg-slate-800 text-emerald-400 text-xs font-semibold rounded-md border border-slate-700 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-xl z-20 text-center select-none">
                {plan.ctaTooltip}
                <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-800"></div>
              </div>
            {/if}
          </div>

          <!-- Features -->
          <ul class="space-y-3 flex-1" aria-label="Features of {plan.title}">
            {#each plan.features as feat}
              <li class="flex items-start gap-3 text-xs md:text-sm relative group/item">
                <div class="mt-0.5">
                  <svg class="w-4 h-4 text-emerald-500 shrink-0 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div class="relative w-full flex items-center flex-wrap gap-1">
                  <span class="block text-slate-300">{feat.name}</span>
                  {#if feat.tooltip}
                    <div class="relative inline-flex items-center">
                      <button type="button" class="text-slate-600 hover:text-emerald-400 transition-colors cursor-help ml-1 outline-none" aria-label="Info about {feat.name}">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </button>
                      <div role="tooltip" class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 px-3 py-2 bg-slate-900/95 backdrop-blur-md text-slate-200 text-xs rounded-md border border-slate-700 opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none shadow-xl z-50 text-center select-none">
                        {feat.tooltip}
                        <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  {/if}
                </div>
              </li>
            {/each}
            {#if plan.notIncluded}
              {#each plan.notIncluded as feat}
                <li class="flex items-start gap-3 text-xs md:text-sm relative group/item">
                  <div class="mt-0.5">
                    <svg class="w-4 h-4 text-slate-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </div>
                  <div class="relative w-full flex items-center flex-wrap gap-1">
                    <span class="block text-slate-600 line-through decoration-slate-700">{feat.name}</span>
                  </div>
                </li>
              {/each}
            {/if}
          </ul>

          {#if plan.recommended}
            <div class="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
          {/if}
        </article>
      {/each}
    </div>

    <!-- Automation Strip -->
    <div class="max-w-4xl mx-auto rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div class="flex items-center gap-6 relative z-10">
        <div class="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-white mb-1">{$t.automation.title}</h3>
          <p class="text-sm text-slate-400 max-w-md">{$t.automation.desc}</p>
        </div>
      </div>
      <button
        onclick={() => openContactModal('Consulting')}
        class="relative z-10 px-8 py-3 bg-white text-slate-950 text-sm font-bold rounded-xl hover:bg-cyan-50 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap"
      >
        {$t.automation.cta}
      </button>
    </div>
  </div>
</section>
