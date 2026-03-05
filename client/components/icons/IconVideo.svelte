<script lang="ts">
  let { class: className = '' }: { class?: string } = $props();
</script>

<svg viewBox="0 0 64 64" class={className} fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glass-cyan-video" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.1" />
    </linearGradient>
    <filter id="glow-video" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect x="8" y="12" width="48" height="32" rx="4" fill="url(#glass-cyan-video)" stroke="#06b6d4" stroke-width="1" opacity="0.2" />
  <path d="M26 20L42 28L26 36V20Z" fill="#06b6d4" filter="url(#glow-video)" />
  <path d="M12 52H52" stroke="#22c55e" stroke-width="2" stroke-linecap="round" />
  <circle cx="20" cy="52" r="3" fill="#22c55e" filter="url(#glow-video)" />
</svg>
