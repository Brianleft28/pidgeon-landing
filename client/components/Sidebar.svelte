<script lang="ts">
  import { t, lang, openContactModal, openAuthModal, isLoggedIn, currentUser, logout } from '../stores';

  let { isOpen, onClose }: { isOpen: boolean; onClose: () => void } = $props();

  let isVisible = $state(false);

  $effect(() => {
    if (isOpen) {
      isVisible = true;
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => isVisible = false, 500);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  });

  function scrollTo(id: string) {
    onClose();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }

  const navItems = [
    { id: 'about', label: () => $t.navAbout, num: '01' },
    { id: 'services', label: () => $t.navServices, num: '02' },
    { id: 'rdd', label: () => $t.navWork, num: '03' },
    { id: 'team', label: () => $t.navTeam, num: '04' },
    { id: 'faq', label: () => 'FAQ', num: '05' },
  ];
</script>

{#if isVisible || isOpen}
<div class="fixed inset-0 z-[100] flex justify-end">
  <!-- Backdrop -->
  <div
    class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 {isOpen ? 'opacity-100' : 'opacity-0'}"
    onclick={onClose}
    role="presentation"
  ></div>

  <!-- Sidebar Panel -->
  <div
    class="relative w-full max-w-[400px] h-full bg-[#020617]/95 border-l border-slate-800 shadow-2xl flex flex-col transition-transform duration-500 ease-out transform {isOpen ? 'translate-x-0' : 'translate-x-full'}"
  >
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
    <div class="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-emerald-500/0 via-emerald-500/20 to-emerald-500/0"></div>

    <!-- Header -->
    <div class="flex items-center justify-between p-8 border-b border-slate-900 relative z-10">
      <div class="flex items-center gap-3">
        <img src="/assets/logo.png" alt="Pidgeon" class="h-8 w-auto invert brightness-0 filter" />
      </div>
      <button
        onclick={onClose}
        class="group p-2 rounded-full border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all"
        aria-label="Close Menu"
      >
        <svg class="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-y-auto p-8 flex flex-col justify-center relative z-10">
      <div class="text-xs font-mono text-emerald-500 mb-6 tracking-widest">[ SYSTEM_NAVIGATION ]</div>

      <nav class="space-y-2">
        {#each navItems as item}
          <button
            onclick={() => scrollTo(item.id)}
            class="group w-full flex items-center justify-between py-4 border-b border-slate-900 hover:border-emerald-900/50 transition-all text-left"
          >
            <span class="text-3xl font-light text-slate-300 group-hover:text-white transition-colors tracking-tight">
              {item.label()}
            </span>
            <div class="flex items-center gap-3 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <span class="text-xs font-mono text-emerald-500">/{item.num}</span>
              <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </button>
        {/each}
      </nav>

      <!-- Actions -->
      <div class="mt-12 space-y-6">
        <!-- Auth -->
        {#if $isLoggedIn}
          <div class="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span class="text-emerald-400 text-sm font-bold">{$currentUser?.email?.[0]?.toUpperCase()}</span>
              </div>
              <span class="text-sm text-slate-300 truncate max-w-[180px]">{$currentUser?.email}</span>
            </div>
            <button onclick={() => { onClose(); logout(); }} class="text-xs text-slate-500 hover:text-red-400 transition-colors">
              {$t.auth.logoutButton}
            </button>
          </div>
        {:else}
          <button
            onclick={() => { onClose(); openAuthModal(); }}
            class="w-full py-4 border border-slate-700 text-white font-bold rounded-xl hover:border-emerald-500/50 hover:bg-slate-900 transition-all"
          >
            {$t.auth.loginCta}
          </button>
        {/if}

        <button
          onclick={() => { onClose(); openContactModal(); }}
          class="w-full py-4 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          {$t.btnContact}
        </button>

        <div class="grid grid-cols-2 gap-4">
          <button
            onclick={() => lang.set('ES')}
            class="py-3 text-xs font-bold border rounded-lg transition-all {$lang === 'ES' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-slate-800 text-slate-500 hover:border-slate-600'}"
          >
            ESPAÑOL
          </button>
          <button
            onclick={() => lang.set('EN')}
            class="py-3 text-xs font-bold border rounded-lg transition-all {$lang === 'EN' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-slate-800 text-slate-500 hover:border-slate-600'}"
          >
            ENGLISH
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-8 border-t border-slate-900 bg-slate-950/50 relative z-10">
      <div class="flex flex-col gap-2">
        <span class="text-xs text-slate-500 font-mono">Pidgeon Solutions © 2026</span>
        <span class="text-[10px] text-slate-600 font-mono">Enterprise Software Architecture</span>
        <div class="flex items-center gap-2 mt-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-[10px] text-emerald-500 uppercase tracking-widest">System Online</span>
        </div>
      </div>
    </div>
  </div>
</div>
{/if}
