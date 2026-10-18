<script lang="ts">
  import { t } from '../stores';
  import TeamBackground from './TeamBackground.svelte';

  interface TeamMember {
    name: string;
    role: string;
    description?: string;
    link?: string;
    image?: string;
    imagePosition?: string;
  }

  function handleImgError(e: Event, name: string) {
    const target = e.target as HTMLImageElement;
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`;
  }
</script>

<section id="team" class="relative py-24 bg-slate-950 overflow-hidden border-t border-slate-900">
  <TeamBackground />
  <div class="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>

  <div class="container mx-auto px-6 md:px-12 relative z-10">
    <div class="mb-16 text-center md:text-left max-w-3xl">
      <h2 class="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">{$t.teamTitle}</h2>
      <p class="text-slate-400 text-lg font-light">{$t.teamSubtitle}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {#each ($t.teamMembers as TeamMember[]) as member}
        <div class="group relative bg-white/5 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1">
          <div class="flex justify-center md:justify-start mb-6">
            <div class="w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border border-white/10 group-hover:border-emerald-500/30 transition-colors">
              <img
                src={member.image || ''}
                alt={member.name}
                class="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                style="object-position: {member.imagePosition || 'center top'}"
                onerror={(e) => handleImgError(e, member.name)}
              />
            </div>
          </div>

          <div class="text-center md:text-left">
            <h3 class="text-xl font-sans font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
              {member.name}
            </h3>
            <p class="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">
              {member.role}
            </p>
            <p class="text-sm text-slate-400 leading-relaxed line-clamp-3">
              {member.description}
            </p>
          </div>

          {#if member.link}
            <a href={member.link} target="_blank" rel="noreferrer" class="absolute inset-0 z-10" aria-label="View profile of {member.name}"></a>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>
