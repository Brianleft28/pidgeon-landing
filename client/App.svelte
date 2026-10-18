<script lang="ts">
  import { lang, t, isContactModalOpen, contactPlan } from './stores';
  import Header from './components/Header.svelte';
  import Hero from './components/Hero.svelte';
  import AboutSection from './components/AboutSection.svelte';
  import ServicesGrid from './components/ServicesGrid.svelte';
  import RDDSection from './components/RDDSection.svelte';
  import ChatbotShowcase from './components/ChatbotShowcase.svelte';
  import TeamSection from './components/TeamSection.svelte';
  import ContactCTA from './components/TerminalContact.svelte';
  import FAQSection from './components/FAQSection.svelte';
  import DynamicBackground from './components/DynamicBackground.svelte';
  import ContactModal from './components/ContactModal.svelte';
  import FloatingActions from './components/FloatingActions.svelte';
  import ChatWidget from './components/ChatWidget.svelte';
</script>

<div class="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-100 scroll-smooth">
  <DynamicBackground />
  <div class="fixed inset-0 pointer-events-none z-0">
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
  </div>

  <Header />

  <main class="relative z-10 flex flex-col gap-0">
    <Hero />
    <AboutSection />
    <RDDSection />
    <ChatbotShowcase />
    <ServicesGrid />
    <TeamSection />
    <FAQSection />
    <ContactCTA />
  </main>

  <FloatingActions />
  <ChatWidget />

  <ContactModal
    isOpen={$isContactModalOpen}
    onClose={() => isContactModalOpen.set(false)}
    preselectedPlan={$contactPlan}
  />

  <footer class="relative z-10 py-8 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
    <div class="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-2">
        <img src="/assets/logo.png" alt="Pidgeon Solutions" class="h-8 w-auto object-contain invert brightness-0 filter" />
      </div>
      <div class="text-sm text-slate-500">
        © 2026 Pidgeon Solutions.
      </div>
    </div>
  </footer>
</div>
