<script lang="ts">
  import { t } from '../stores';

  let { isOpen, onClose, preselectedPlan = '' }: {
    isOpen: boolean;
    onClose: () => void;
    preselectedPlan?: string;
  } = $props();

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    alert('Mensaje enviado (Simulación). Nos contactaremos pronto.');
    onClose();
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
        <div>
          <label for="contact-name" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{$t.contactModal.nameLabel}</label>
          <input id="contact-name" type="text" required class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Juan Pérez" />
        </div>

        <div>
          <label for="contact-email" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{$t.contactModal.emailLabel}</label>
          <input id="contact-email" type="email" required class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="juan@miempresa.com" />
        </div>

        <div>
          <label for="contact-company" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{$t.contactModal.companyLabel}</label>
          <input id="contact-company" type="text" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Mi Negocio SRL" />
        </div>

        <div>
          <label for="contact-message" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{$t.contactModal.messageLabel}</label>
          <textarea
            id="contact-message"
            rows="4"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            placeholder={$t.contactModal.messagePlaceholder}
            value={preselectedPlan ? `Hola, estoy interesado en el plan: ${preselectedPlan}.` : ''}
          ></textarea>
        </div>

        <button type="submit" class="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          {$t.contactModal.sendButton}
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
