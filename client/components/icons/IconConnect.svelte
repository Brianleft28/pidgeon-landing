<script lang="ts">
  let { class: className = '' }: { class?: string } = $props();
</script>

<svg viewBox="0 0 64 64" class={className} fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glass-green-conn" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#22c55e" stop-opacity="0.1" />
    </linearGradient>
    <linearGradient id="glass-cyan-conn" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.1" />
    </linearGradient>
    <filter id="glow-conn" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect x="12" y="12" width="16" height="16" rx="4" fill="url(#glass-green-conn)" stroke="#4ade80" stroke-width="1" />
  <rect x="36" y="36" width="16" height="16" rx="4" fill="url(#glass-green-conn)" stroke="#4ade80" stroke-width="1" />
  <rect x="36" y="12" width="16" height="16" rx="4" fill="url(#glass-cyan-conn)" stroke="#67e8f9" stroke-width="1" opacity="0.5" />
  <path d="M28 20H36" stroke="#4ade80" stroke-width="2" filter="url(#glow-conn)" />
  <path d="M20 28V36H36" stroke="#4ade80" stroke-width="2" stroke-linecap="round" filter="url(#glow-conn)" />
  <circle cx="20" cy="20" r="2" fill="#fff" />
  <circle cx="44" cy="44" r="2" fill="#fff" />
</svg>
