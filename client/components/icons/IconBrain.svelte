<script lang="ts">
  let { class: className = '' }: { class?: string } = $props();
</script>

<svg viewBox="0 0 64 64" class={className} fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glass-purple-brain" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.1" />
    </linearGradient>
    <filter id="glow-brain" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <path d="M32 12C20 12 10 22 10 34C10 46 20 56 32 56C44 56 54 46 54 34C54 22 44 12 32 12Z" fill="url(#glass-purple-brain)" stroke="#8b5cf6" stroke-width="1" opacity="0.5" />
  <path d="M32 16C24 16 18 24 18 34" stroke="#c4b5fd" stroke-width="2" stroke-linecap="round" filter="url(#glow-brain)" />
  <path d="M46 34C46 24 40 16 32 16" stroke="#c4b5fd" stroke-width="2" stroke-linecap="round" opacity="0.5" />
  <path d="M22 34C22 42 28 48 32 48" stroke="#c4b5fd" stroke-width="2" stroke-linecap="round" opacity="0.5" />
  <circle cx="32" cy="34" r="6" fill="#8b5cf6" filter="url(#glow-brain)" />
  <circle cx="32" cy="34" r="10" stroke="#8b5cf6" stroke-width="0.5" stroke-dasharray="2 2" />
</svg>
