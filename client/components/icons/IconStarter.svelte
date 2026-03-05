<script lang="ts">
  let { class: className = '' }: { class?: string } = $props();
</script>

<svg viewBox="0 0 64 64" class={className} fill="none">
  <defs>
    <linearGradient id="icon-neon-s" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="1" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="1" />
    </linearGradient>
    <linearGradient id="icon-glass-s" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.01" />
    </linearGradient>
    <filter id="icon-glow-s" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <path d="M32 12C32 12 20 28 20 40C20 46.6274 25.3726 52 32 52C38.6274 52 44 46.6274 44 40C44 28 32 12 32 12Z" fill="url(#icon-glass-s)" stroke="url(#icon-neon-s)" stroke-width="0.5" />
  <circle cx="32" cy="40" r="6" fill="#22c55e" filter="url(#icon-glow-s)" opacity="0.6" />
  <path d="M32 20L32 40" stroke="white" stroke-width="1" stroke-linecap="round" opacity="0.3" />
</svg>
