<script lang="ts">
  let scrollY = $state(0);

  const shapes = [
    { top: 15, left: 10, size: 180, speed: 0.25, rotation: 45, opacity: 0.3, blur: 40, color: '#10b981' },
    { top: 25, left: 90, size: 250, speed: 0.1, rotation: -30, opacity: 0.2, blur: 50, color: '#22c55e' },
    { top: 70, left: 5, size: 350, speed: -0.15, rotation: -50, opacity: 0.15, blur: 60, color: '#38bdf8' },
    { top: 85, left: 95, size: 150, speed: 0.3, rotation: 20, opacity: 0.4, blur: 30, color: '#6366f1' },
    { top: 50, left: 50, size: 220, speed: 0.05, rotation: 10, opacity: 0.1, blur: 70, color: '#a78bfa' },
  ];

  $effect(() => {
    function onScroll() {
      requestAnimationFrame(() => { scrollY = window.scrollY; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<div class="fixed inset-0 pointer-events-none z-0">
  {#each shapes as s}
    <div
      style="
        position: absolute;
        top: {s.top}%;
        left: {s.left}%;
        width: {s.size}px;
        height: {s.size}px;
        background-color: {s.color}1A;
        border: 1px solid {s.color}33;
        border-radius: 30%;
        transform: translate(-50%, -50%) translateY({scrollY * s.speed}px) rotate({s.rotation}deg);
        opacity: {s.opacity};
        filter: blur({s.blur}px);
        transition: transform 0.3s ease-out;
        will-change: transform;
      "
    ></div>
  {/each}
</div>
