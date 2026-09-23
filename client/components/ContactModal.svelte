<script lang="ts">
  import { t } from '../stores';

  let { isOpen, onClose, preselectedPlan = '' }: {
    isOpen: boolean;
    onClose: () => void;
    preselectedPlan?: string;
  } = $props();

  let name = $state('');
  let email = $state('');
  let company = $state('');
  let message = $state('');
  let isLoading = $state(false);
  let status = $state<'idle' | 'success' | 'error'>('idle');
  let errorMessage = $state('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  $effect(() => {
    if (isOpen) {
      status = 'idle';
      name = '';
      email = '';
      company = '';
      message = preselectedPlan ? `Hola, estoy interesado en el plan: ${preselectedPlan}.` : '';
    }
  });

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    isLoading = true;
    status = 'idle';

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, message }),
      });

      if (!res.ok) throw new Error('Error al enviar el mensaje');
      
      status = 'success';
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      status = 'error';
      errorMessage = 'Hubo un error al enviar el mensaje. Intenta nuevamente.';
    } finally {
      isLoading = false;
    }
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="bg-[#0f172a] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
      onclick={(e: MouseEvent) => e.stopPropagation()}
    >
      <div class="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
        <div>
          <h3 class="text-xl font-bold text-white">{$t.contactModal.title}</h3>
          <p class="text-sm text-slate-400">{$t.contactModal.subtitle}</p>
        </div>
        <button onclick={onClose} class="text-slate-500 hover:text-white transition-colors" aria-label="Close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <form onsubmit={handleSubmit} class="p-6 space-y-4">
        {#if status === 'success'}
          <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-medium text-center">
            ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
          </div>
        {/if}
        
        {#if status === 'error'}
          <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium text-center">
            {errorMessage}
          </div>
        {/if}

        <div>
          <label for="contact-name" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{$t.contactModal.nameLabel}</label>
          <input id="contact-name" type="text" bind:value={name} required disabled={isLoading || status === 'success'} class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50" placeholder="Juan Pérez" />
        </div>

        <div>
          <label for="contact-email" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{$t.contactModal.emailLabel}</label>
          <input id="contact-email" type="email" bind:value={email} required disabled={isLoading || status === 'success'} class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50" placeholder="juan@miempresa.com" />
        </div>

        <div>
          <label for="contact-company" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{$t.contactModal.companyLabel}</label>
          <input id="contact-company" type="text" bind:value={company} disabled={isLoading || status === 'success'} class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50" placeholder="Mi Negocio SRL" />
        </div>

        <div>
          <label for="contact-message" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{$t.contactModal.messageLabel}</label>
          <textarea
            id="contact-message"
            rows="4"
            bind:value={message}
            required
            disabled={isLoading || status === 'success'}
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none disabled:opacity-50"
            placeholder={$t.contactModal.messagePlaceholder}
          ></textarea>
        </div>

        <button type="submit" disabled={isLoading || status === 'success'} class="w-full flex items-center justify-center py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none">
          {#if isLoading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Enviando...
          {:else}
            {$t.contactModal.sendButton}
          {/if}
        </button>
      </form>
    </div>
  </div>
{/if}

<style>
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  :global(.animate-fadeIn) { animation: fadeIn 0.2s ease-out forwards; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  :global(.animate-slideUp) { animation: slideUp 0.3s ease-out forwards; }
</style>
