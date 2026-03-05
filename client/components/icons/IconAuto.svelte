<script lang="ts">
  let { class: className = '' }: { class?: string } = $props();
</script>

<svg viewBox="0 0 64 64" class={className} fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glass-cyan-auto" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.1" />
    </linearGradient>
    <filter id="glow-auto" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <path d="M32 8L42 26H58L44 36L48 56L32 44L16 56L20 36L6 26H22L32 8Z" fill="url(#glass-cyan-auto)" stroke="#22d3ee" stroke-width="1" opacity="0.3" />
  <path d="M32 14L38 28H50L40 34L44 48L32 40L20 48L24 34L14 28H26L32 14Z" stroke="#22d3ee" stroke-width="2" stroke-linejoin="round" filter="url(#glow-auto)" />
  <circle cx="32" cy="32" r="4" fill="#fff" filter="url(#glow-auto)" />
</svg>
