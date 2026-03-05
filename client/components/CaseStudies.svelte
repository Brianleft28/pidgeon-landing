<script lang="ts">
  import { t } from '../stores';
</script>

<section id="cases" class="py-32 bg-slate-950">
  <div class="container mx-auto px-6 md:px-12">
    <div class="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 class="text-3xl md:text-4xl font-semibold text-white mb-4">{$t.caseStudiesTitle}</h2>
        <div class="h-1 w-12 bg-violet-500 rounded-full"></div>
      </div>
      <p class="text-slate-500 text-sm max-w-md text-right hidden md:block">
        Impact driven engineering for real-world problems.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-slate-900/20 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900/40 transition-colors cursor-default">
        <div class="flex flex-wrap gap-2 mb-6">
          {#each ['LogiTech', 'Automation', 'API Integration'] as tag}
            <span class="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">{tag}</span>
          {/each}
        </div>
        <h3 class="text-2xl font-semibold text-white mb-2">{$t.cases.logistics.client}</h3>
        <p class="text-cyan-400 font-medium mb-4">{$t.cases.logistics.metric}</p>
        <p class="text-slate-400 text-sm leading-relaxed">{$t.cases.logistics.desc}</p>
      </div>

      <div class="bg-slate-900/20 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900/40 transition-colors cursor-default">
        <div class="flex flex-wrap gap-2 mb-6">
          {#each ['HealthTech', 'Security', 'Automation'] as tag}
            <span class="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">{tag}</span>
          {/each}
        </div>
        <h3 class="text-2xl font-semibold text-white mb-2">{$t.cases.health.client}</h3>
        <p class="text-cyan-400 font-medium mb-4">{$t.cases.health.metric}</p>
        <p class="text-slate-400 text-sm leading-relaxed">{$t.cases.health.desc}</p>
      </div>
    </div>
  </div>
</section>
