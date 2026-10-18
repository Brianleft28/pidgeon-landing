<script lang="ts">
  import { t, lang } from '../stores';
  import { Marked } from 'marked';
  import hljs from 'highlight.js/lib/core';
  import javascript from 'highlight.js/lib/languages/javascript';
  import typescript from 'highlight.js/lib/languages/typescript';
  import python from 'highlight.js/lib/languages/python';
  import bash from 'highlight.js/lib/languages/bash';
  import json from 'highlight.js/lib/languages/json';
  import sql from 'highlight.js/lib/languages/sql';
  import DOMPurify from 'dompurify';

  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('js', javascript);
  hljs.registerLanguage('typescript', typescript);
  hljs.registerLanguage('ts', typescript);
  hljs.registerLanguage('python', python);
  hljs.registerLanguage('bash', bash);
  hljs.registerLanguage('sh', bash);
  hljs.registerLanguage('json', json);
  hljs.registerLanguage('sql', sql);

  const marked = new Marked({
    breaks: true,
    gfm: true,
    renderer: {
      code({ text, lang }: { text: string; lang?: string }) {
        const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
        const highlighted = language !== 'plaintext'
          ? hljs.highlight(text, { language }).value
          : text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<pre class="rounded-lg bg-slate-900 p-3 my-2 overflow-x-auto border border-slate-700 text-xs"><code class="hljs language-${language}">${highlighted}</code></pre>`;
      },
    },
  });

  function parseMarkdown(content: string): string {
    if (!content) return '';
    try {
      const html = marked.parse(content, { async: false }) as string;
      return DOMPurify.sanitize(html);
    } catch {
      return content;
    }
  }

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

  // Buffer para efecto typewriter por chunks (igual que en brianleft-portfolio)
  let typewriterBuffer = $state('');
  let typewriterIndex = $state(0);
  let typewriterInterval: ReturnType<typeof setInterval> | null = $state(null);
  let isStreaming = $state(false);

  function startTypewriter(assistantIndex: number) {
    if (typewriterInterval) clearInterval(typewriterInterval);

    typewriterInterval = setInterval(() => {
      if (typewriterIndex < typewriterBuffer.length) {
        const chunkSize = Math.floor(Math.random() * 3) + 2;
        const nextChunk = typewriterBuffer.slice(typewriterIndex, typewriterIndex + chunkSize);
        const updated = [...messages];
        updated[assistantIndex] = {
          ...updated[assistantIndex],
          content: updated[assistantIndex].content + nextChunk,
        };
        messages = updated;
        typewriterIndex += chunkSize;
        messagesEndEl?.scrollIntoView({ behavior: 'smooth' });
      } else if (!isStreaming) {
        stopTypewriter();
      }
    }, 15);
  }

  function stopTypewriter() {
    if (typewriterInterval) {
      clearInterval(typewriterInterval);
      typewriterInterval = null;
    }
  }

  async function readStream(res: globalThis.Response) {
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') continue;

        try {
          const parsed = JSON.parse(payload);
          if (parsed.text) {
            typewriterBuffer += parsed.text;
          }
        } catch { /* skip malformed chunks */ }
      }
    }
  }

  async function drainTypewriter() {
    isStreaming = false;
    while (typewriterIndex < typewriterBuffer.length) {
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    stopTypewriter();
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    inputValue = '';
    messages = [...messages, { role: 'user', content: userMsg }];
    isLoading = true;

    const assistantIndex = messages.length;
    messages = [...messages, { role: 'assistant', content: '' }];

    typewriterBuffer = '';
    typewriterIndex = 0;
    isStreaming = true;
    startTypewriter(assistantIndex);

    try {
      const history = messages
        .filter(m => m.content && m.content !== $t.chat.initial)
        .slice(0, -1);

      const res = await fetch(`${API_URL}/chat/message/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history, locale: $lang }),
      });

      if (res.status === 429) {
        typewriterBuffer = $t.chat.rateLimited;
        await drainTypewriter();
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await readStream(res);
      await drainTypewriter();

      if (!messages[assistantIndex].content) {
        const updated = [...messages];
        updated[assistantIndex] = { role: 'assistant', content: $t.chat.error };
        messages = updated;
      }
    } catch (err) {
      console.error('Chat error:', err);
      try {
        const history = messages
          .filter(m => m.content && m.content !== $t.chat.initial)
          .slice(0, -1);

        const res = await fetch(`${API_URL}/chat/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMsg, history, locale: $lang }),
        });

        if (res.status === 429) {
          typewriterBuffer = $t.chat.rateLimited;
          await drainTypewriter();
        } else if (res.ok) {
          const data = await res.json();
          typewriterBuffer = data.reply || $t.chat.error;
          await drainTypewriter();
        } else {
          throw new Error('Fallback failed');
        }
      } catch {
        stopTypewriter();
        isStreaming = false;
        const updated = [...messages];
        updated[assistantIndex] = { role: 'assistant', content: $t.chat.error };
        messages = updated;
      }
    } finally {
      isLoading = false;
    }
  }

  function handleClearChat() {
    stopTypewriter();
    isStreaming = false;
    messages = [{ role: 'assistant', content: $t.chat.initial }];
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
</script>

<div class="fixed z-50 flex flex-col items-end pointer-events-none {isOpen ? 'inset-0 sm:inset-auto sm:bottom-6 sm:right-24' : 'bottom-6 right-24'}">
  <!-- Chat Panel -->
  {#if isOpen}
    <div
      class="pointer-events-auto w-full h-full sm:w-[450px] sm:h-[600px] sm:mb-4 rounded-none sm:rounded-2xl border-0 sm:border sm:border-slate-700/50 bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-emerald-500/5 flex flex-col overflow-hidden animate-slideUp"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-900/80 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center p-1.5">
            <img src="/assets/logo2.png" alt="Pidgeon" class="w-full h-full object-contain brightness-0 invert" />
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
            <div class="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
              {msg.role === 'user'
                ? 'bg-emerald-600 text-white rounded-br-md'
                : 'bg-slate-800/80 text-slate-200 rounded-bl-md border border-slate-700/50'}"
            >
              {#if msg.role === 'assistant'}
                {#if msg.content}
                  <div class="prose prose-sm prose-invert prose-emerald max-w-none [&_p]:my-1.5 [&_ul]:my-2 [&_ul]:pl-4 [&_ol]:my-2 [&_ol]:pl-4 [&_li]:my-1 [&_strong]:text-white [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_a]:text-emerald-400">
                    {@html parseMarkdown(msg.content)}
                  </div>
                {/if}
                {#if isLoading && idx === messages.length - 1}
                  {#if !msg.content}
                    <span class="flex gap-1 py-1">
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style="animation-delay: 0ms"></span>
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style="animation-delay: 150ms"></span>
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style="animation-delay: 300ms"></span>
                    </span>
                  {:else}
                    <span class="inline-block w-1.5 h-3 bg-emerald-500 animate-pulse ml-0.5 align-middle"></span>
                  {/if}
                {/if}
              {:else}
                {msg.content}
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
            aria-label={$t.chat.send}
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
      <img src="/assets/logo2.png" alt="Pidgeon" class="w-8 h-8 object-contain brightness-0 invert" />
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
