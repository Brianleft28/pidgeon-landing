<script lang="ts">
  import { t, openContactModal } from '../stores';

  type SimMessage = {
    role: 'user' | 'assistant';
    time: string;
    text: string;
    status?: string;
  };

  type ChatbotSlide = {
    id: string;
    channel: string;
    accent: 'emerald' | 'cyan' | 'purple';
    title: string;
    desc: string;
    metrics: string[];
    planTag: string;
    messages: SimMessage[];
  };

  type RenderedMessage = {
    role: 'user' | 'assistant';
    time: string;
    text: string;
    status?: string;
    streaming?: boolean;
  };

  const AUTO_ADVANCE_MS = 20000;

  let slides = $derived(($t.chatbots?.slides ?? []) as ChatbotSlide[]);
  let activeIndex = $state(0);
  let isPaused = $state(false);
  let progress = $state(0);
  let trackEl = $state<HTMLDivElement>();
  let chatBodyEls = $state<Record<number, HTMLDivElement | null>>({});

  // Mensajes renderizados en el slide activo (con streaming por chunks)
  let renderedMessages = $state<RenderedMessage[]>([]);
  let isBotStreaming = $state(false);

  function goToSlide(index: number, scrollTrack = true) {
    const total = slides.length;
    if (!total) return;
    const next = ((index % total) + total) % total;
    activeIndex = next;
    progress = 0;

    if (scrollTrack && trackEl) {
      const slideWidth = trackEl.clientWidth;
      trackEl.scrollTo({ left: slideWidth * next, behavior: 'smooth' });
    }
  }

  function prevSlide() {
    goToSlide(activeIndex - 1, true);
  }

  function nextSlide() {
    goToSlide(activeIndex + 1, true);
  }

  function handleTrackScroll() {
    if (!trackEl) return;
    const width = trackEl.clientWidth;
    if (width <= 0) return;
    const idx = Math.round(trackEl.scrollLeft / width);
    if (idx !== activeIndex && idx >= 0 && idx < slides.length) {
      activeIndex = idx;
      progress = 0;
    }
  }

  // Auto-rotación cada 20 segundos con barra de progreso suave
  $effect(() => {
    const total = slides.length;
    if (!total) return;

    const tickMs = 100;
    const step = (tickMs / AUTO_ADVANCE_MS) * 100;

    const timer = setInterval(() => {
      if (isPaused || document.hidden) return;
      progress += step;
      if (progress >= 100) {
        progress = 0;
        goToSlide(activeIndex + 1, true);
      }
    }, tickMs);

    return () => clearInterval(timer);
  });

  // Simulación de conversación con llegada por chunks (estilo portfolio)
  $effect(() => {
    const currentSlide = slides[activeIndex];
    if (!currentSlide) return;

    let cancelled = false;
    let chunkInterval: ReturnType<typeof setInterval> | null = null;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    renderedMessages = [];
    isBotStreaming = false;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms);
        timeouts.push(id);
      });

    const streamAssistantChunks = (msgIndex: number, fullText: string, statusText?: string) =>
      new Promise<void>((resolve) => {
        let cursor = 0;
        isBotStreaming = true;

        chunkInterval = setInterval(() => {
          if (cancelled) {
            if (chunkInterval) clearInterval(chunkInterval);
            resolve();
            return;
          }

          if (cursor < fullText.length) {
            // Chunks de 2 a 4 caracteres cada 15ms (mismo efecto que brianleft-portfolio)
            const chunkSize = Math.floor(Math.random() * 3) + 2;
            const nextChunk = fullText.slice(cursor, cursor + chunkSize);
            cursor += chunkSize;

            const updated = [...renderedMessages];
            if (updated[msgIndex]) {
              updated[msgIndex] = {
                ...updated[msgIndex],
                text: updated[msgIndex].text + nextChunk,
                streaming: cursor < fullText.length,
                status: cursor >= fullText.length ? statusText : undefined,
              };
              renderedMessages = updated;
            }

            const bodyEl = chatBodyEls[activeIndex];
            if (bodyEl) {
              bodyEl.scrollTop = bodyEl.scrollHeight;
            }
          } else {
            if (chunkInterval) {
              clearInterval(chunkInterval);
              chunkInterval = null;
            }
            isBotStreaming = false;
            resolve();
          }
        }, 15);
      });

    (async () => {
      await wait(250);
      for (const msg of currentSlide.messages) {
        if (cancelled) return;

        if (msg.role === 'user') {
          renderedMessages = [
            ...renderedMessages,
            { role: 'user', time: msg.time, text: msg.text },
          ];
          const bodyEl = chatBodyEls[activeIndex];
          if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
          await wait(650);
        } else {
          const idx = renderedMessages.length;
          renderedMessages = [
            ...renderedMessages,
            { role: 'assistant', time: msg.time, text: '', streaming: true },
          ];
          await wait(300);
          if (cancelled) return;
          await streamAssistantChunks(idx, msg.text, msg.status);
          await wait(800);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (chunkInterval) clearInterval(chunkInterval);
      timeouts.forEach(clearTimeout);
    };
  });

  function accentClasses(accent: ChatbotSlide['accent']) {
    if (accent === 'cyan') {
      return {
        badge: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        glow: 'shadow-[0_0_50px_rgba(6,182,212,0.12)]',
        botBubble: 'bg-cyan-500/10 border-cyan-500/30 text-slate-100',
        status: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
        dot: 'bg-cyan-400',
      };
    }
    if (accent === 'purple') {
      return {
        badge: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        glow: 'shadow-[0_0_50px_rgba(168,85,247,0.12)]',
        botBubble: 'bg-purple-500/10 border-purple-500/30 text-slate-100',
        status: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
        dot: 'bg-purple-400',
      };
    }
    return {
      badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      glow: 'shadow-[0_0_50px_rgba(16,185,129,0.12)]',
      botBubble: 'bg-emerald-500/10 border-emerald-500/30 text-slate-100',
      status: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      dot: 'bg-emerald-400',
    };
  }
</script>

<section
  id="chatbots"
  class="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-900"
  aria-roledescription="carousel"
  aria-label="AI Chatbots Showcase"
  onmouseenter={() => (isPaused = true)}
  onmouseleave={() => (isPaused = false)}
  onfocusin={() => (isPaused = true)}
  onfocusout={() => (isPaused = false)}
>
  <!-- Ambient radial glow -->
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/5 blur-[130px] rounded-full"></div>
  </div>

  <div class="container mx-auto px-6 md:px-12 relative z-10">
    <!-- Section Header + Controls -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
      <div class="max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            {$t.chatbots.badge}
          </span>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
          {$t.chatbots.titleStart}{' '}
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            {$t.chatbots.titleHighlight}
          </span>{' '}
          {$t.chatbots.titleEnd}
        </h2>
        <p class="text-slate-400 text-lg font-light leading-relaxed">
          {$t.chatbots.subtitle}
        </p>
      </div>

      <!-- Prev / Next Buttons & Auto-advance status -->
      <div class="flex items-center gap-4 self-start lg:self-end">
        <span class="text-xs font-mono text-slate-500 hidden sm:inline">
          {isPaused ? $t.chatbots.pausedLabel : $t.chatbots.autoAdvanceLabel}
        </span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick={prevSlide}
            aria-label={$t.chatbots.prevLabel}
            class="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onclick={nextSlide}
            aria-label={$t.chatbots.nextLabel}
            class="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Horizontal Scroll-Snap Carousel Track -->
    <div
      bind:this={trackEl}
      onscroll={handleTrackScroll}
      class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-2 px-2"
    >
      {#each slides as slide, idx (slide.id)}
        {@const colors = accentClasses(slide.accent)}
        {@const displayMsgs = idx === activeIndex ? renderedMessages : slide.messages}

        <div
          class="w-full shrink-0 snap-center px-2"
          role="group"
          aria-roledescription="slide"
          aria-label="{idx + 1} / {slides.length}: {slide.title}"
        >
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-black/30 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 md:p-10">
            <!-- Left Column: Use case description & metrics -->
            <div class="lg:col-span-5 flex flex-col justify-between gap-6 text-left">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-xs font-mono font-semibold mb-4 {colors.badge}">
                  <span class="w-1.5 h-1.5 rounded-full {colors.dot}"></span>
                  {slide.channel}
                </div>

                <h3 class="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                  {slide.title}
                </h3>

                <p class="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
                  {slide.desc}
                </p>

                <ul class="space-y-3 mb-8">
                  {#each slide.metrics as metric}
                    <li class="flex items-start gap-3 text-xs md:text-sm text-slate-300">
                      <svg class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{metric}</span>
                    </li>
                  {/each}
                </ul>
              </div>

              <div class="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onclick={() => openContactModal(slide.planTag)}
                  class="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] cursor-pointer"
                >
                  {$t.chatbots.ctaButton}
                </button>
                <span class="text-xs font-mono text-slate-500">
                  0{idx + 1} / 0{slides.length}
                </span>
              </div>
            </div>

            <!-- Right Column: Sober Live Chat Window with Chunked Streaming -->
            <div class="lg:col-span-7">
              <div class="w-full bg-[#0b1121]/95 backdrop-blur-md border border-slate-800 rounded-2xl {colors.glow} overflow-hidden flex flex-col h-[420px] md:h-[440px]">
                <!-- Window Header -->
                <div class="flex items-center justify-between px-4 py-3 border-b border-slate-800/70 bg-slate-900/60">
                  <div class="flex items-center gap-2">
                    <div class="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    <span class="ml-2 text-xs font-mono text-slate-400 truncate">
                      {$t.chatbots.liveHeader}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    {#if idx === activeIndex && isBotStreaming}
                      <span class="text-[11px] font-mono text-emerald-400 animate-pulse">
                        {$t.chatbots.typingLabel}
                      </span>
                    {/if}
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                </div>

                <!-- Messages Feed -->
                <div
                  bind:this={chatBodyEls[idx]}
                  class="flex-1 p-5 space-y-4 overflow-y-auto font-sans text-xs md:text-sm scroll-smooth"
                >
                  {#each displayMsgs as msg}
                    {#if msg.role === 'user'}
                      <div class="flex justify-end">
                        <div class="max-w-[82%] rounded-2xl rounded-tr-sm bg-white/10 border border-white/10 px-4 py-3 text-slate-200">
                          <p class="leading-relaxed">{msg.text}</p>
                          <span class="block text-[10px] font-mono text-slate-500 text-right mt-1">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    {:else}
                      <div class="flex justify-start">
                        <div class="max-w-[88%] rounded-2xl rounded-tl-sm border px-4 py-3 {colors.botBubble}">
                          <p class="leading-relaxed whitespace-pre-wrap">
                            {msg.text}{#if 'streaming' in msg && msg.streaming}<span class="inline-block w-1.5 h-3.5 bg-emerald-400 ml-0.5 align-middle animate-pulse"></span>{/if}
                          </p>
                          {#if msg.status}
                            <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-[11px] font-mono">
                              <span class="px-2 py-0.5 rounded border {colors.status}">
                                {msg.status}
                              </span>
                              <span class="text-[10px] text-slate-500">{msg.time}</span>
                            </div>
                          {/if}
                        </div>
                      </div>
                    {/if}
                  {/each}
                </div>

                <!-- Simulated Input Footer -->
                <div class="px-4 py-3 border-t border-slate-800/70 bg-slate-900/40 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Gemini AI + MCP Context Protocol</span>
                  <span class="text-emerald-400">ONLINE · 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Bottom Slide Dots + 20s Auto-Advance Progress Bar -->
    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
      {#each slides as slide, idx (slide.id)}
        <button
          type="button"
          onclick={() => goToSlide(idx, true)}
          aria-label="Slide {idx + 1}: {slide.title}"
          aria-current={idx === activeIndex ? 'true' : 'false'}
          class="group relative h-2.5 rounded-full overflow-hidden transition-all cursor-pointer {idx === activeIndex ? 'w-20 bg-slate-800' : 'w-2.5 bg-slate-800 hover:bg-slate-700'}"
        >
          {#if idx === activeIndex}
            <div
              class="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-100"
              style="width: {progress}%"
            ></div>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</section>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
