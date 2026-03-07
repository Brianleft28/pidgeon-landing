<script lang="ts">
  import { t } from '../stores';

  type Message = { role: 'user' | 'assistant'; content: string };

  const LOCAL_STORAGE_KEY = 'pidgeonChatHistory';
  const API_URL = (import.meta as any).env?.VITE_API_URL
    ?? process.env.VITE_API_URL
    ?? 'http://localhost:3000';

  let isOpen = $state(false);
  let messages = $state<Message[]>([]);
  let inputValue = $state('');
  let isLoading = $state(false);
  let messagesEndEl = $state<HTMLDivElement>();

  // Load history on mount
  $effect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid: Message[] = parsed.filter(
            (m: any): m is Message =>
              (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
          );
          if (valid.length > 0) { messages = valid; return; }
        }
      }
      messages = [{ role: 'assistant', content: $t.chat.initial }];
    } catch {
      messages = [{ role: 'assistant', content: $t.chat.initial }];
    }
  });

  // Save history on change
  $effect(() => {
    try {
      if (messages.length > 1 || (messages.length === 1 && messages[0].content !== $t.chat.initial)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
      }
    } catch { /* ignore */ }
  });

  // Scroll to bottom
  $effect(() => {
    if (messages.length) {
      messagesEndEl?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    inputValue = '';
    messages = [...messages, { role: 'user', content: userMsg }];
    isLoading = true;

    try {
      const history = messages
        .filter(m => m.content && m.content !== $t.chat.initial)
        .slice(0, -1);

      const res = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      messages = [...messages, { role: 'assistant', content: data.reply }];
    } catch (err) {
      console.error('Chat error:', err);
      messages = [...messages, { role: 'assistant', content: $t.chat.error }];
    } finally {
      isLoading = false;
    }
  }

  function handleClearChat() {
    messages = [{ role: 'assistant', content: $t.chat.initial }];
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
</script>

<div class="fixed bottom-6 right-24 z-50 flex flex-col items-end pointer-events-none">
  <!-- Chat Panel -->
  {#if isOpen}
    <div
      class="pointer-events-auto w-80 sm:w-96 h-[500px] mb-4 rounded-2xl border border-slate-700/50 bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-emerald-500/5 flex flex-col overflow-hidden animate-slideUp"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-900/80 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-white">Pidgeon Assistant</p>
            <p class="text-[10px] text-emerald-500 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
              Online
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick={handleClearChat} title="Limpiar chat" class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
          <button onclick={() => isOpen = false} class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all" aria-label="Cerrar chat">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        {#each messages as msg, idx}
          <div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
            <div class="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
              {msg.role === 'user'
                ? 'bg-emerald-600 text-white rounded-br-md'
                : 'bg-slate-800/80 text-slate-200 rounded-bl-md border border-slate-700/50'}"
            >
              {msg.content}
              {#if isLoading && msg.role === 'assistant' && idx === messages.length - 1 && !msg.content}
                <span class="flex gap-1 py-1">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style="animation-delay: 0ms"></span>
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style="animation-delay: 150ms"></span>
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style="animation-delay: 300ms"></span>
                </span>
              {/if}
            </div>
          </div>
        {/each}
        <div bind:this={messagesEndEl}></div>
      </div>

      <!-- Input -->
      <form onsubmit={handleSubmit} class="p-3 bg-slate-900/80 border-t border-slate-800">
        <div class="flex items-center gap-2 bg-slate-800/50 rounded-xl px-3 py-2 border border-slate-700/50 focus-within:border-emerald-500/50 transition-colors">
          <input
            type="text"
            bind:value={inputValue}
            placeholder={$t.chat.placeholder}
            class="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-slate-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            class="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Floating Bubble Button -->
  <button
    onclick={() => isOpen = !isOpen}
    class="pointer-events-auto group relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/30
      {isOpen
        ? 'bg-slate-800 text-white border border-slate-700'
        : 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white'}"
    aria-label="Chat"
  >
    {#if isOpen}
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
    {:else}
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
    {/if}
    {#if !isOpen}
      <span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
      <span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"></span>
    {/if}
  </button>
</div>

<style>
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  .animate-slideUp {
    animation: slideUp 0.25s ease-out;
  }
</style>
