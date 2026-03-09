<script lang="ts">
  import { t, setAuth, parseJwtPayload, closeAuthModal } from '../stores';

  let { isOpen, onClose }: {
    isOpen: boolean;
    onClose: () => void;
  } = $props();

  const API_URL = (import.meta as any).env?.VITE_API_URL
    ?? process.env.VITE_API_URL
    ?? 'http://localhost:3000';

  let activeTab = $state<'login' | 'register'>('login');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let error = $state('');
  let isSubmitting = $state(false);
  let modalRef = $state<HTMLDivElement>();

  $effect(() => {
    if (!isOpen) {
      email = '';
      password = '';
      confirmPassword = '';
      error = '';
      activeTab = 'login';
      isSubmitting = false;
    }
  });

  $effect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab' && modalRef) {
        const focusable = modalRef.querySelectorAll<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])');
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

  async function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    if (isSubmitting) return;
    error = '';
    isSubmitting = true;
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) {
        error = $t.auth.errorInvalidCredentials;
      } else if (data.access_token) {
        const payload = parseJwtPayload(data.access_token);
        if (payload) {
          setAuth(data.access_token, { id: payload.sub, email: payload.email, roles: payload.roles });
        }
        onClose();
      }
    } catch {
      error = $t.auth.errorGeneric;
    } finally {
      isSubmitting = false;
    }
  }

  async function handleRegister(e: SubmitEvent) {
    e.preventDefault();
    if (isSubmitting) return;
    if (password !== confirmPassword) {
      error = $t.auth.errorPasswordMismatch;
      return;
    }
    error = '';
    isSubmitting = true;
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 401) {
        error = $t.auth.errorUserExists;
        return;
      }
      const data = await res.json();
      if (data.access_token) {
        const payload = parseJwtPayload(data.access_token);
        if (payload) {
          setAuth(data.access_token, { id: payload.sub, email: payload.email, roles: payload.roles });
        }
        onClose();
      }
    } catch {
      error = $t.auth.errorGeneric;
    } finally {
      isSubmitting = false;
    }
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
    role="dialog"
    aria-modal="true"
    aria-labelledby="auth-modal-title"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      bind:this={modalRef}
      class="bg-[#0f172a] border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
      onclick={(e: MouseEvent) => e.stopPropagation()}
    >
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
        <div>
          <h3 id="auth-modal-title" class="text-xl font-bold text-white">
            {activeTab === 'login' ? $t.auth.loginTitle : $t.auth.registerTitle}
          </h3>
        </div>
        <button onclick={onClose} class="text-slate-500 hover:text-white transition-colors" aria-label="Close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="p-6">
        <!-- Tabs -->
        <div class="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-lg mb-6">
          <button
            onclick={() => { activeTab = 'login'; error = ''; }}
            class="py-2 text-sm font-bold rounded-md transition-all {activeTab === 'login' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}"
          >
            {$t.auth.loginTab}
          </button>
          <button
            onclick={() => { activeTab = 'register'; error = ''; }}
            class="py-2 text-sm font-bold rounded-md transition-all {activeTab === 'register' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}"
          >
            {$t.auth.registerTab}
          </button>
        </div>

        {#if activeTab === 'login'}
          <form onsubmit={handleLogin} class="space-y-4">
            <div>
              <label for="auth-email" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{$t.auth.emailLabel}</label>
              <input
                id="auth-email"
                type="email"
                required
                bind:value={email}
                class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder={$t.auth.emailPlaceholder}
              />
            </div>
            <div>
              <label for="auth-password" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{$t.auth.passwordLabel}</label>
              <input
                id="auth-password"
                type="password"
                required
                bind:value={password}
                class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder={$t.auth.passwordPlaceholder}
              />
            </div>

            {#if error}
              <div class="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            {/if}

            <button
              type="submit"
              disabled={isSubmitting}
              class="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? $t.auth.loggingIn : $t.auth.loginButton}
            </button>
          </form>
        {:else}
          <form onsubmit={handleRegister} class="space-y-4">
            <div>
              <label for="reg-email" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{$t.auth.emailLabel}</label>
              <input
                id="reg-email"
                type="email"
                required
                bind:value={email}
                class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder={$t.auth.emailPlaceholder}
              />
            </div>
            <div>
              <label for="reg-password" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{$t.auth.passwordLabel}</label>
              <input
                id="reg-password"
                type="password"
                required
                bind:value={password}
                class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder={$t.auth.passwordPlaceholder}
              />
            </div>
            <div>
              <label for="reg-confirm" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{$t.auth.confirmPasswordLabel}</label>
              <input
                id="reg-confirm"
                type="password"
                required
                bind:value={confirmPassword}
                class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder={$t.auth.confirmPasswordPlaceholder}
              />
            </div>

            {#if error}
              <div class="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            {/if}

            <button
              type="submit"
              disabled={isSubmitting}
              class="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? $t.auth.registering : $t.auth.registerButton}
            </button>
          </form>
        {/if}
      </div>
    </div>
  </div>
{/if}
