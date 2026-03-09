<script lang="ts">
  import { t, lang, openContactModal, openAuthModal, isLoggedIn, currentUser, logout } from '../stores';
  import Sidebar from './Sidebar.svelte';

  let isVisible = $state(false);
  let activeSection = $state('');
  let isSidebarOpen = $state(false);

  $effect(() => {
    const handleScroll = () => {
      isVisible = window.scrollY > 10;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  $effect(() => {
    const sections = ['about', 'services', 'rdd', 'team', 'faq', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  });

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<nav
  class="fixed top-0 left-0 w-full z-40 transition-all duration-500 transform {isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}"
>
  <div class="container mx-auto px-6 md:px-12 py-4">
    <div class="flex items-center justify-between px-6 py-3 rounded-full bg-[#0a0a0a]/90 backdrop-blur-md border border-slate-800 shadow-2xl shadow-black/50">
      <!-- Logo -->
      <div class="flex items-center gap-3 cursor-pointer group" role="button" tabindex="0" onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} onkeydown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <img src="/assets/logo.png" alt="Pidgeon Solutions" class="h-8 w-auto brightness-0 invert" />
      </div>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-8">
        <button onclick={() => scrollTo('about')} class="text-sm font-medium transition-colors {activeSection === 'about' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}">
          {$t.navAbout}
        </button>
        <button onclick={() => scrollTo('services')} class="text-sm font-medium transition-colors {activeSection === 'services' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}">
          {$t.navServices}
        </button>
        <button onclick={() => scrollTo('rdd')} class="text-sm font-medium transition-colors {activeSection === 'rdd' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}">
          {$t.navWork}
        </button>
        <button onclick={() => scrollTo('team')} class="text-sm font-medium transition-colors {activeSection === 'team' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}">
          {$t.navTeam}
        </button>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <div class="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-900/50 rounded-lg px-2 py-1 border border-slate-800/50">
          <button onclick={() => lang.set('EN')} class="px-1.5 py-0.5 rounded transition-colors {$lang === 'EN' ? 'text-white bg-slate-800' : 'hover:text-slate-300'}">EN</button>
          <button onclick={() => lang.set('ES')} class="px-1.5 py-0.5 rounded transition-colors {$lang === 'ES' ? 'text-white bg-slate-800' : 'hover:text-slate-300'}">ES</button>
        </div>

        <div class="hidden md:flex items-center">
          {#if $isLoggedIn}
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400 truncate max-w-[120px]">{$currentUser?.email}</span>
              <button onclick={() => logout()} class="text-xs text-slate-500 hover:text-red-400 transition-colors">
                {$t.auth.logoutButton}
              </button>
            </div>
          {:else}
            <button onclick={() => openAuthModal()} class="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              {$t.auth.loginCta}
            </button>
          {/if}
        </div>

        <button onclick={() => openContactModal()} class="hidden md:block px-5 py-2 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          {$t.btnContact}
        </button>

        <button onclick={() => isSidebarOpen = true} class="md:hidden p-2 text-slate-400 hover:text-white transition-colors border-l border-slate-800 pl-4 ml-2" aria-label="Open Menu">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>

<Sidebar isOpen={isSidebarOpen} onClose={() => isSidebarOpen = false} />

<style>
  @keyframes subtlePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  :global(.animate-subtle-pulse) {
    animation: subtlePulse 4s ease-in-out infinite;
  }
</style>
