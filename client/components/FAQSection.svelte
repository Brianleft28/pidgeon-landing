<script lang="ts">
  import { t } from '../stores';
  import FAQItem from './FAQItem.svelte';
</script>

<section id="faq" class="min-h-screen flex flex-col justify-center py-24 bg-slate-950">
  <div class="container mx-auto px-6 md:px-12 max-w-4xl">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">{$t.faq.title}</h2>
      <p class="text-slate-400">{$t.faq.subtitle}</p>
    </div>

    <div class="bg-slate-900/40 rounded-3xl p-8 md:p-12 border border-slate-800">
      {#each $t.faq.items as item}
        <FAQItem question={item.question} answer={item.answer} />
      {/each}
    </div>
  </div>
</section>
