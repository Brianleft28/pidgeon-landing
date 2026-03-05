<script lang="ts">
  import { t, openContactModal } from '../stores';
  import VeoHeroBackground from './VeoHeroBackground.svelte';

  let wordIndex = $state(0);
  let text = $state('');
  let isDeleting = $state(false);

  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseDuration = 2000;

  $effect(() => {
    const rotatingWords = $t.heroRotatingWords as string[];
    const currentWord = rotatingWords[wordIndex];

    const handleTyping = () => {
      const updatedText = isDeleting
        ? currentWord.substring(0, text.length - 1)
        : currentWord.substring(0, text.length + 1);

      text = updatedText;

      if (!isDeleting && updatedText === currentWord) {
        setTimeout(() => { isDeleting = true; }, pauseDuration);
      } else if (isDeleting && updatedText === '') {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % rotatingWords.length;
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  });

  function handleImgError(e: Event) {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    target.parentElement?.classList.add('border', 'border-dashed', 'border-slate-700', 'rounded-xl');
  }
</script>

<section class="relative min-h-screen flex flex-col justify-center overflow-hidden bg-slate-950">
  <VeoHeroBackground />
  <div class="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>

  <div class="container mx-auto px-6 md:px-12 relative z-10 h-full">
    <div class="grid lg:grid-cols-2 gap-12 items-center h-full">

      <!-- Left Column -->
      <div class="flex flex-col justify-center order-2 lg:order-1 pt-12 lg:pt-0">
        <h1 class="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6">
          {$t.heroStaticText}
        </h1>

        <div class="bg-gradient-to-r from-emerald-400 to-cyan-400 p-2 md:p-4 mb-8 inline-block transform -skew-x-2 w-fit">
          <span class="text-4xl md:text-6xl font-bold text-slate-950 block transform skew-x-2 px-2 whitespace-nowrap">
            {text}
            <span class="inline-block w-1 h-8 md:h-12 ml-1 bg-slate-950 animate-blink align-middle"></span>
          </span>
        </div>

        <p class="text-lg md:text-xl text-slate-400 max-w-xl mb-12 font-light leading-relaxed">
          {$t.heroSubtitle}
        </p>

        <div class="flex flex-col sm:flex-row items-center gap-5">
          <button
            onclick={() => openContactModal()}
            class="px-10 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)] w-full sm:w-auto"
          >
            {$t.btnContact}
          </button>
          <button
            onclick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})}
            class="px-10 py-4 rounded-full border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-white bg-slate-900/50 font-medium text-lg transition-all w-full sm:w-auto"
          >
            {$t.navServices}
          </button>
        </div>
      </div>

      <!-- Right Column: Logo -->
      <div class="flex items-center justify-center order-1 lg:order-2">
        <div class="relative w-full max-w-md aspect-square flex items-center justify-center">
          <div class="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>
          <img
            src="public/assets/logo2.png"
            alt="Hero Logo"
            class="relative z-10 w-full h-auto object-contain max-h-[400px] invert brightness-0 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            onerror={handleImgError}
          />
        </div>
      </div>

    </div>
  </div>
</section>

<style>
  @keyframes blink { 50% { background-color: transparent; } }
  :global(.animate-blink) { animation: blink 1s step-end infinite; }
</style>
