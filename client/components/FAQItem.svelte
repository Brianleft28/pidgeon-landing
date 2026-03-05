<script lang="ts">
  let { question, answer }: { question: string; answer: string } = $props();
  let isOpen = $state(false);
</script>

<div class="border-b border-slate-800">
  <button
    class="w-full py-6 flex items-center justify-between text-left group"
    onclick={() => isOpen = !isOpen}
  >
    <span class="text-lg font-medium transition-colors {isOpen ? 'text-emerald-400' : 'text-slate-300 group-hover:text-white'}">
      {question}
    </span>
    <span class="transform transition-transform duration-300 {isOpen ? 'rotate-180 text-emerald-400' : 'text-slate-500'}">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
    </span>
  </button>
  <div class="overflow-hidden transition-all duration-300 ease-in-out {isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}">
    <div class="text-slate-400 text-base leading-relaxed">
      {@html answer}
    </div>
  </div>
</div>
