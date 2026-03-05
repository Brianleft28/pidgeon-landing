<script lang="ts">
  let { class: className = '' }: { class?: string } = $props();
</script>

<svg viewBox="0 0 64 64" class={className} fill="none">
  <defs>
    <linearGradient id="icon-neon-b" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="1" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="1" />
    </linearGradient>
    <linearGradient id="icon-glass-b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.01" />
    </linearGradient>
    <filter id="icon-glow-b" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <path d="M32 10L54 22V44L32 56L10 44V22L32 10Z" fill="url(#icon-glass-b)" stroke="url(#icon-neon-b)" stroke-width="1" />
  <path d="M32 10V34M32 34L54 22M32 34L10 22" stroke="url(#icon-neon-b)" stroke-width="1" opacity="0.5" />
  <path d="M32 56V34" stroke="url(#icon-neon-b)" stroke-width="1" opacity="0.3" />
  <rect x="24" y="24" width="16" height="16" transform="rotate(45 32 32)" fill="#22c55e" filter="url(#icon-glow-b)" opacity="0.2" />
</svg>
