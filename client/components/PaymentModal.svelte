<script lang="ts">
  import { t } from '../stores';

  let { isOpen, onClose, planName, amount }: {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
    amount: number;
  } = $props();

  let selectedMethod = $state<'mp' | 'paypal' | 'card'>('mp');
  let closeButtonRef = $state<HTMLButtonElement>();
  let modalRef = $state<HTMLDivElement>();
  let methodBtns = $state<(HTMLButtonElement | null)[]>([null, null, null]);

  const methods = [
    { id: 'mp' as const, labelKey: 'mp', colorClass: 'text-sky-500', bgClass: 'bg-sky-500/10', borderClass: 'border-sky-500', disabled: false },
    { id: 'paypal' as const, labelKey: 'paypal', colorClass: 'text-blue-600', bgClass: 'bg-blue-600/10', borderClass: 'border-blue-600', disabled: true, tooltip: 'En desarrollo / Coming Soon' },
    { id: 'card' as const, labelKey: 'card', colorClass: 'text-indigo-400', bgClass: 'bg-indigo-500/10', borderClass: 'border-indigo-400', disabled: true, tooltip: 'En desarrollo / Coming Soon' },
  ];

  $effect(() => {
    if (isOpen) {
      setTimeout(() => closeButtonRef?.focus(), 100);
    }
  });

  $effect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab' && modalRef) {
        const focusable = modalRef.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { last.focus(); e.preventDefault(); }
        } else {
          if (document.activeElement === last) { first.focus(); e.preventDefault(); }
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  function handlePayment() {
    alert(`Initiating payment for ${planName} ($${amount}) via ${selectedMethod.toUpperCase()}`);
    onClose();
  }

  function handleMethodKeyDown(e: KeyboardEvent, index: number) {
    let nextIndex = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      nextIndex = (index + 1) % methods.length;
      e.preventDefault();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + methods.length) % methods.length;
      e.preventDefault();
    }
    if (nextIndex !== -1 && !methods[nextIndex].disabled) {
      selectedMethod = methods[nextIndex].id;
      methodBtns[nextIndex]?.focus();
    }
  }

  function getMethodLabel(key: string): string {
    if (key === 'card') return 'Stripe / Card';
    const m = ($t.paymentModal?.methods as Record<string, string>) ?? {};
    return m[key] ?? key;
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
    role="dialog"
    aria-modal="true"
    aria-labelledby="payment-modal-title"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      bind:this={modalRef}
      class="bg-[#0f172a] border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slideUp relative"
      onclick={(e: MouseEvent) => e.stopPropagation()}
    >
      <button
        bind:this={closeButtonRef}
        onclick={onClose}
        class="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full p-1"
        aria-label="Close modal"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div class="p-8 text-center border-b border-slate-800 bg-slate-900/50">
        <h3 id="payment-modal-title" class="text-xl font-bold text-white mb-1">{$t.paymentModal.title}</h3>
        <p class="text-xs text-slate-400 uppercase tracking-wide">{$t.paymentModal.subtitle}</p>
      </div>

      <div class="p-6">
        <!-- Plan info -->
        <div class="flex justify-between items-center bg-slate-900 rounded-lg p-4 mb-6 border border-slate-800">
          <div>
            <span class="block text-xs text-slate-500 uppercase">{$t.paymentModal.selectedPlan}</span>
            <span class="font-bold text-white">{planName}</span>
          </div>
          <div class="text-right">
            <span class="block text-xs text-slate-500 uppercase">{$t.paymentModal.total}</span>
            <span class="font-bold text-emerald-400 text-xl" aria-label="{amount} US Dollars">US$ {amount}</span>
          </div>
        </div>

        <!-- Payment methods -->
        <div class="space-y-3 mb-8" role="radiogroup" aria-label="Select Payment Method">
          {#each methods as method, index}
            {@const isSelected = selectedMethod === method.id}
            {@const label = getMethodLabel(method.labelKey)}
            <div class="relative group/tooltip">
              <button
                bind:this={methodBtns[index]}
                role="radio"
                aria-checked={isSelected}
                aria-disabled={method.disabled}
                tabindex={isSelected && !method.disabled ? 0 : -1}
                disabled={method.disabled}
                onclick={() => { if (!method.disabled) selectedMethod = method.id; }}
                onkeydown={(e) => { if (!method.disabled) handleMethodKeyDown(e, index); }}
                class="w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 group
                  {method.disabled
                    ? 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed grayscale'
                    : isSelected
                      ? `${method.bgClass} ${method.borderClass} shadow-lg`
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800'}"
                aria-label={label}
              >
                <span class="flex items-center gap-4 text-white font-medium">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden {isSelected && !method.disabled ? 'bg-white/10' : 'bg-slate-800 group-hover:bg-slate-700'}">
                    {#if method.id === 'mp'}
                      <!-- Mercado Pago Logo -->
                      <svg class="w-full h-full p-2 {isSelected ? method.colorClass : 'text-slate-400 group-hover:text-white'} transition-colors" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                        <path style="fill:#FFFFFF" d="M475,241.439c0-81.074-100.726-147.162-224.988-147.162c-124.256,0-224.983,66.087-224.983,147.162c0,2.091-0.029,7.878-0.029,8.616c0,86.005,88.043,155.668,224.979,155.668C387.769,405.723,475,336.079,475,250.071C475,247.063,475,245.334,475,241.439z"/>
                        <path style="fill:#3FB6E9" d="M466.386,241.367c0,76.431-96.855,138.391-216.334,138.391c-119.481,0-216.326-61.96-216.326-138.391c0-76.439,96.846-138.402,216.326-138.402C369.53,102.964,466.386,164.927,466.386,241.367z"/>
                      </svg>
                    {:else if method.id === 'paypal'}
                      <!-- PayPal Logo -->
                      <svg class="w-full h-full p-2 {isSelected ? method.colorClass : 'text-slate-400 group-hover:text-white'} transition-colors" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PayPal Logo">
                        <path d="M19.64 5.92c-.36-1.57-1.63-2.38-3.79-2.38H6.5c-.5 0-.91.37-.99.86L2.68 20.9c-.04.25.15.48.41.48h3.33c.4 0 .74-.29.81-.68l.9-5.71h2.57c3.9 0 6.64-1.92 7.37-6.23.09-.54.12-1.04.12-1.51 0-2.32-.98-3.74-2.55-4.33z"/>
                        <path d="M17.06 6.3c-.36-1.57-1.63-2.38-3.79-2.38H6.5c-.5 0-.91.37-.99.86L4 14.5h2.5l.65-4.14c.07-.4.41-.68.81-.68h3.75c3.55 0 6.09-1.74 6.78-5.32.08-.43.12-.86.12-1.28 0-1.89-.62-3.08-1.55-3.78z" class="opacity-40"/>
                      </svg>
                    {:else}
                      <!-- Stripe / Card Logo -->
                      <svg class="w-full h-full p-2 {isSelected ? method.colorClass : 'text-slate-400 group-hover:text-white'} transition-colors" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stripe/Card Logo">
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                      </svg>
                    {/if}
                  </div>
                  <span>{label}</span>
                </span>

                <div class="w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                  {method.disabled ? 'border-slate-700' : isSelected ? `border-current ${method.colorClass}` : 'border-slate-600 group-hover:border-slate-500'}">
                  {#if isSelected && !method.disabled}
                    <div class="w-2.5 h-2.5 rounded-full bg-current"></div>
                  {/if}
                </div>
              </button>

              {#if method.disabled && method.tooltip}
                <div role="tooltip" class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-md border border-slate-700 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-xl z-20 text-center select-none">
                  {method.tooltip}
                  <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-800"></div>
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <button
          onclick={handlePayment}
          class="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label="Pay {amount} US Dollars with {selectedMethod === 'mp' ? 'Mercado Pago' : selectedMethod === 'paypal' ? 'PayPal' : 'Credit Card'}"
        >
          {$t.paymentModal.cta}
        </button>

        <div class="flex items-center justify-center gap-2 text-[10px] text-slate-500">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          {$t.paymentModal.secure}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  :global(.animate-fadeIn) { animation: fadeIn 0.2s ease-out forwards; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  :global(.animate-slideUp) { animation: slideUp 0.3s ease-out forwards; }
</style>
