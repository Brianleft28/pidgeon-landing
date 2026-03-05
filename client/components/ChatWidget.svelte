<script lang="ts">
  import { GoogleGenAI, type Chat, type GenerateContentResponse } from '@google/genai';
  import { t } from '../stores';

  type Message = { role: 'user' | 'assistant'; content: string };

  const LOCAL_STORAGE_KEY = 'pidgeonChatHistory';

  let isOpen = $state(false);
  let messages = $state<Message[]>([]);
  let inputValue = $state('');
  let isLoading = $state(false);
  let messagesEndEl = $state<HTMLDivElement>();
  let chatSession: Chat | null = null;

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
    const userMessage: Message = { role: 'user', content: userMsg };
    messages = [...messages, userMessage];
    isLoading = true;

    try {
      if (!chatSession) {
        const ai = new GoogleGenAI({ apiKey: (import.meta as any).env?.VITE_API_KEY ?? '' });
        const history = messages.slice(0, -1)
          .filter(m => m.content)
          .map(msg => ({
            role: (msg.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
            parts: [{ text: msg.content }],
          }));

        chatSession = ai.chats.create({
          model: 'gemini-3-pro-preview',
          history,
          config: {
            thinkingConfig: { thinkingBudget: 32768 },
            systemInstruction: 'You are the advanced AI Core of Pidgeon Solutions. Your persona is technical, precise, and helpful. You reside in a terminal interface. You are an expert in software architecture, automation, and digital infrastructure. You use advanced reasoning (Thinking Mode) to solve complex user problems.',
          },
        });
      }

      messages = [...messages, { role: 'assistant', content: '' }];

      const result = await chatSession.sendMessageStream({ message: userMsg });
      let fullText = '';
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          messages = [...messages.slice(0, -1), { role: 'assistant', content: fullText }];
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      messages = [...messages.slice(0, -1), { role: 'assistant', content: $t.chat.error }];
    } finally {
      isLoading = false;
    }
  }

  function handleClearChat() {
    messages = [{ role: 'assistant', content: $t.chat.initial }];
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    chatSession = null;
  }
</script>

<div class="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
  <!-- Chat Window -->
  <div
    class="pointer-events-auto transition-all duration-300 ease-out origin-bottom-right mb-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/95 backdrop-blur-md shadow-2xl flex flex-col font-mono text-sm
      {isOpen ? 'w-80 sm:w-96 h-[500px] opacity-100 scale-100' : 'w-0 h-0 opacity-0 scale-90'}"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span class="text-xs font-bold text-slate-400">PIDGEON CORE // GEMINI-3</span>
      </div>
      <div class="flex items-center gap-3">
        <button onclick={handleClearChat} title="Clear chat history" class="text-slate-500 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
        <button onclick={() => isOpen = false} class="text-slate-500 hover:text-white transition-colors" aria-label="Close chat">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      {#each messages as msg, idx}
        <div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
          <div class="max-w-[85%] break-words {msg.role === 'user' ? 'text-emerald-400' : 'text-slate-300'}">
            <span class="mr-2 opacity-50">{msg.role === 'user' ? '>' : '#'}</span>
            {msg.content}
            {#if isLoading && msg.role === 'assistant' && idx === messages.length - 1}
              <span class="inline-block w-2 h-4 ml-1 align-middle bg-emerald-500 animate-pulse"></span>
            {/if}
          </div>
        </div>
      {/each}
      <div bind:this={messagesEndEl}></div>
    </div>

    <!-- Input -->
    <form onsubmit={handleSubmit} class="p-3 bg-slate-900 border-t border-slate-800">
      <div class="flex items-center gap-2">
        <span class="text-emerald-500 font-bold">{'>'}</span>
        <input
          type="text"
          bind:value={inputValue}
          placeholder={$t.chat.placeholder}
          class="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-mono"
          disabled={isLoading}
        />
      </div>
    </form>
  </div>

  <!-- Toggle Button -->
  <button
    onclick={() => isOpen = !isOpen}
    class="pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 border border-slate-700
      {isOpen ? 'bg-slate-800 text-white' : 'bg-slate-900 text-emerald-500 hover:bg-slate-800 hover:text-emerald-400'}"
  >
    {#if isOpen}
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
    {:else}
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    {/if}
  </button>
</div>
