<script lang="ts">
  let { class: className = '' }: { class?: string } = $props();
</script>

<svg viewBox="0 0 64 64" class={className} fill="none">
  <defs>
    <linearGradient id="icon-neon-e" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="1" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="1" />
    </linearGradient>
    <linearGradient id="icon-glass-e" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.01" />
    </linearGradient>
    <filter id="icon-glow-e" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect x="12" y="32" width="12" height="20" fill="url(#icon-glass-e)" stroke="url(#icon-neon-e)" stroke-width="1" />
  <rect x="40" y="32" width="12" height="20" fill="url(#icon-glass-e)" stroke="url(#icon-neon-e)" stroke-width="1" />
  <rect x="24" y="16" width="16" height="36" fill="url(#icon-glass-e)" stroke="url(#icon-neon-e)" stroke-width="1" />
  <path d="M12 32L32 16L52 32" stroke="url(#icon-neon-e)" stroke-width="1" opacity="0.5" />
  <circle cx="32" cy="16" r="4" fill="#06b6d4" filter="url(#icon-glow-e)" />
  <line x1="4" y1="52" x2="60" y2="52" stroke="#22c55e" stroke-width="1" opacity="0.5" />
  <circle cx="4" cy="52" r="2" fill="#22c55e" />
  <circle cx="60" cy="52" r="2" fill="#22c55e" />
</svg>
