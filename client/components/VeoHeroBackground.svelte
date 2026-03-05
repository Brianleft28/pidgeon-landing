<script lang="ts">
  let canvas = $state<HTMLCanvasElement>();

  $effect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles: { x: number; y: number; r: number; dx: number; dy: number; opacity: number }[] = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width, y: Math.random() * height,
        r: Math.random() * 300 + 200,
        dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.1,
        opacity: Math.random() * 0.08 + 0.02,
      });
    }

    let animId: number;
    function draw() {
      ctx!.fillStyle = '#020617';
      ctx!.fillRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < -p.r) p.x = width + p.r;
        if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        if (p.y > height + p.r) p.y = -p.r;
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(6, 182, 212, ${p.opacity})`);
        g.addColorStop(0.4, `rgba(15, 23, 42, ${p.opacity * 0.5})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.fillStyle = g; ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx!.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    function handleResize() { width = canvas!.width = window.innerWidth; height = canvas!.height = window.innerHeight; }
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize); };
  });
</script>

<canvas bind:this={canvas} class="absolute inset-0 w-full h-full object-cover -z-10"></canvas>
