<script lang="ts">
  import { t } from '../stores';

  declare const MercadoPago: any;

  let { isOpen, onClose, planName, amount }: {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
    amount: number;
  } = $props();

  const API_URL = (import.meta as any).env?.VITE_API_URL
    ?? process.env.VITE_API_URL
    ?? 'http://localhost:3000';

  const MP_PUBLIC_KEY = (import.meta as any).env?.VITE_MP_PUBLIC_KEY
    ?? process.env.VITE_MP_PUBLIC_KEY
    ?? '';

  let closeButtonRef = $state<HTMLButtonElement>();
  let modalRef = $state<HTMLDivElement>();
  let cardFormContainerRef = $state<HTMLDivElement>();

  let isProcessing = $state(false);
  let paymentError = $state('');
  let paymentSuccess = $state(false);
  let paymentStep = $state<'select' | 'mp-form' | 'paypal-soon'>('select');
  let cardFormInstance: any = null;

  // Initialize MP CardForm when modal opens AND step is mp-form
  $effect(() => {
    if (isOpen && paymentStep === 'mp-form' && cardFormContainerRef && MP_PUBLIC_KEY) {
      setTimeout(() => initCardForm(), 200);
    }
    if (isOpen && paymentStep !== 'mp-form') {
      destroyCardForm();
    }
    if (isOpen) {
      setTimeout(() => closeButtonRef?.focus(), 100);
    }
    if (!isOpen) {
      destroyCardForm();
      isProcessing = false;
      paymentError = '';
      paymentSuccess = false;
      paymentStep = 'select';
    }
  });

  // Keyboard trap for modal
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

  function initCardForm() {
    if (typeof MercadoPago === 'undefined' || !MP_PUBLIC_KEY) return;
    try {
      const mp = new MercadoPago(MP_PUBLIC_KEY, { locale: 'es-AR' });
      cardFormInstance = mp.cardForm({
        amount: String(amount),
        iframe: true,
        form: {
          id: 'mp-card-form',
          cardNumber: { id: 'mp-card-number', placeholder: '0000 0000 0000 0000' },
          expirationDate: { id: 'mp-expiration-date', placeholder: 'MM/YY' },
          securityCode: { id: 'mp-security-code', placeholder: '123' },
          cardholderName: { id: 'mp-cardholder-name', placeholder: 'JOHN DOE' },
          issuer: { id: 'mp-issuer', placeholder: 'Issuer' },
          installments: { id: 'mp-installments', placeholder: 'Installments' },
          identificationType: { id: 'mp-doc-type', placeholder: 'Doc Type' },
          identificationNumber: { id: 'mp-doc-number', placeholder: '12345678' },
        },
        callbacks: {
          onFormMounted: (error: any) => {
            if (error) console.warn('CardForm mount error:', error);
          },
          onSubmit: async (event: Event) => {
            event.preventDefault();
            await processPayment();
          },
          onFetching: (resource: string) => {
            isProcessing = true;
            return () => { isProcessing = false; };
          },
        },
      });
    } catch (err) {
      console.error('Error initializing MercadoPago CardForm:', err);
    }
  }

  function destroyCardForm() {
    if (cardFormInstance) {
      try { cardFormInstance.unmount(); } catch { /* ignore */ }
      cardFormInstance = null;
    }
  }

  async function processPayment() {
    if (!cardFormInstance) return;
    isProcessing = true;
    paymentError = '';

    try {
      const formData = cardFormInstance.getCardFormData();
      const res = await fetch(`${API_URL}/mercado-pago/process-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: formData.token,
          transaction_amount: amount,
          description: planName,
          installments: Number(formData.installments),
          payment_method_id: formData.paymentMethodId,
          payer: {
            email: formData.cardholderEmail || 'customer@pidgeonsolutions.com',
            identification: {
              type: formData.identificationType,
              number: formData.identificationNumber,
            },
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      const result = await res.json();
      if (result.status === 'approved') {
        paymentSuccess = true;
      } else {
        paymentError = result.status_detail || 'Payment was not approved. Please try again.';
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      paymentError = err.message || 'Payment processing failed.';
    } finally {
      isProcessing = false;
    }
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
      class="bg-[#0f172a] border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slideUp relative max-h-[90vh] overflow-y-auto"
      onclick={(e: MouseEvent) => e.stopPropagation()}
    >
      <button
        bind:this={closeButtonRef}
        onclick={onClose}
        class="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full p-1 z-10"
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

        {#if paymentSuccess}
          <!-- Success state -->
          <div class="text-center py-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h4 class="text-lg font-bold text-white mb-2">{$t.paymentModal.approved}</h4>
            <p class="text-slate-400 text-sm mb-6">{$t.paymentModal.approvedDesc} {planName}.</p>
            <button
              onclick={onClose}
              class="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all"
            >
              {$t.paymentModal.close}
            </button>
          </div>
        {:else if paymentStep === 'select'}
          <!-- Step 1: Payment Method Selection -->
          <h4 class="text-sm font-bold text-white mb-1">{$t.paymentModal.selectMethod}</h4>
          <p class="text-xs text-slate-400 mb-4">{$t.paymentModal.selectMethodSubtitle}</p>

          <div class="space-y-3">
            <!-- Mercado Pago -->
            <button
              onclick={() => paymentStep = 'mp-form'}
              class="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all group text-left"
            >
              <div class="w-12 h-12 rounded-lg bg-[#009ee3]/10 flex items-center justify-center shrink-0">
                <svg class="w-8 h-6" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="32" rx="4" fill="#009ee3"/>
                  <path d="M18.5 8c-2.5 0-4.5 1.2-5.5 3.2-.8 1.6-.5 3.5.7 4.8 1.2 1.3 3 1.8 4.8 1.5l.5-.1c.3-.1.5-.2.8-.4l3-2c.5-.3 1-.5 1.5-.5h2.5c1 0 2-.5 2.5-1.3.5-.8.5-1.8 0-2.5C27.5 9 23 8 18.5 8z" fill="white" opacity="0.9"/>
                  <path d="M22.5 14c-2.5 0-4.5 1.2-5.5 3.2-.8 1.6-.5 3.5.7 4.8 1.2 1.3 3 1.8 4.8 1.5l.5-.1c.3-.1.5-.2.8-.4l3-2c.5-.3 1-.5 1.5-.5h2.5c1 0 2-.5 2.5-1.3.5-.8.5-1.8 0-2.5C31.5 15 27 14 22.5 14z" fill="white" opacity="0.6"/>
                </svg>
              </div>
              <div class="flex-1">
                <span class="block text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{$t.paymentModal.mercadoPago}</span>
                <span class="block text-xs text-slate-500">{$t.paymentModal.mercadoPagoDesc}</span>
              </div>
              <svg class="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>

            <!-- PayPal -->
            <button
              onclick={() => paymentStep = 'paypal-soon'}
              class="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-slate-600 transition-all group text-left"
            >
              <div class="w-12 h-12 rounded-lg bg-[#003087]/10 flex items-center justify-center shrink-0">
                <svg class="w-8 h-6" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="32" rx="4" fill="#003087"/>
                  <path d="M16 10h5c2.5 0 4 1.5 3.5 4-.5 2.5-2.5 4-5 4h-1.5l-1 4h-3l2-12z" fill="#009cde"/>
                  <path d="M19 10h5c2.5 0 4 1.5 3.5 4-.5 2.5-2.5 4-5 4h-1.5l-1 4h-3l2-12z" fill="white" opacity="0.8"/>
                </svg>
              </div>
              <div class="flex-1">
                <span class="block text-sm font-bold text-white">{$t.paymentModal.paypal}</span>
                <span class="block text-xs text-slate-500">{$t.paymentModal.paypalDesc}</span>
              </div>
              <span class="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">{$t.paymentModal.comingSoon}</span>
            </button>
          </div>
        {:else if paymentStep === 'paypal-soon'}
          <!-- PayPal Coming Soon -->
          <div class="text-center py-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
              <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h4 class="text-lg font-bold text-white mb-2">{$t.paymentModal.comingSoon}</h4>
            <p class="text-slate-400 text-sm mb-6">{$t.paymentModal.comingSoonDesc}</p>
            <button
              onclick={() => paymentStep = 'select'}
              class="px-6 py-3 border border-slate-700 text-white font-bold rounded-lg hover:border-emerald-500/50 transition-all"
            >
              {$t.paymentModal.backToMethods}
            </button>
          </div>
        {:else if paymentStep === 'mp-form'}
          {#if !MP_PUBLIC_KEY}
            <!-- No public key configured -->
            <div class="text-center py-8">
              <p class="text-slate-400 text-sm mb-4">{$t.paymentModal.noKey}</p>
              <a
                href="https://wa.me/5411315536315"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all"
              >
                {$t.paymentModal.contactWhatsApp}
              </a>
            </div>
          {:else}
            <!-- Back button -->
            <button
              onclick={() => paymentStep = 'select'}
              class="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors mb-4"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              {$t.paymentModal.backToMethods}
            </button>

            <!-- Card form (MP Checkout API) -->
            <div bind:this={cardFormContainerRef}>
              <form id="mp-card-form" onsubmit={(e) => e.preventDefault()}>
                <div class="space-y-4">
                  <div>
                    <label for="mp-card-number" class="block text-xs text-slate-400 mb-1.5">{$t.paymentModal.cardNumber}</label>
                    <div id="mp-card-number" class="h-10 rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden"></div>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label for="mp-expiration-date" class="block text-xs text-slate-400 mb-1.5">{$t.paymentModal.expMonth}/{$t.paymentModal.expYear}</label>
                      <div id="mp-expiration-date" class="h-10 rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden"></div>
                    </div>
                    <div>
                      <label for="mp-security-code" class="block text-xs text-slate-400 mb-1.5">{$t.paymentModal.cvc}</label>
                      <div id="mp-security-code" class="h-10 rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden"></div>
                    </div>
                  </div>

                  <div>
                    <label for="mp-cardholder-name" class="block text-xs text-slate-400 mb-1.5">{$t.paymentModal.cardholderName}</label>
                    <input id="mp-cardholder-name" type="text" class="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm outline-none focus:border-emerald-500/50 transition-colors" />
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label for="mp-doc-type" class="block text-xs text-slate-400 mb-1.5">{$t.paymentModal.docType}</label>
                      <select id="mp-doc-type" class="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm outline-none focus:border-emerald-500/50 transition-colors"></select>
                    </div>
                    <div>
                      <label for="mp-doc-number" class="block text-xs text-slate-400 mb-1.5">{$t.paymentModal.docNumber}</label>
                      <input id="mp-doc-number" type="text" class="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm outline-none focus:border-emerald-500/50 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label for="mp-issuer" class="block text-xs text-slate-400 mb-1.5">Issuer</label>
                    <select id="mp-issuer" class="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm outline-none focus:border-emerald-500/50 transition-colors"></select>
                  </div>

                  <div>
                    <label for="mp-installments" class="block text-xs text-slate-400 mb-1.5">{$t.paymentModal.installments}</label>
                    <select id="mp-installments" class="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white text-sm outline-none focus:border-emerald-500/50 transition-colors"></select>
                  </div>
                </div>

                {#if paymentError}
                  <div class="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {paymentError}
                  </div>
                {/if}

                <button
                  type="submit"
                  disabled={isProcessing}
                  class="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
                  aria-label="Pay {amount} US Dollars"
                >
                  {isProcessing ? $t.paymentModal.processing : $t.paymentModal.cta}
                </button>
              </form>
            </div>

            <p class="mt-4 text-[10px] text-slate-500 text-center">{$t.paymentModal.disclaimer}</p>
          {/if}
        {/if}

        <div class="flex items-center justify-center gap-2 text-[10px] text-slate-500 mt-3">
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
