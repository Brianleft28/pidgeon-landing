<script lang="ts">
  let canvas = $state<HTMLCanvasElement>();

  $effect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const blocks: { x: number; y: number; w: number; h: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 40; i++) {
      blocks.push({
        x: Math.random() * width,
        y: Math.random() * height + height,
        w: 20 + Math.random() * 100,
        h: 100 + Math.random() * 300,
        speed: 0.5 + Math.random() * 1.5,
        opacity: 0.05 + Math.random() * 0.15,
      });
    }

    let animId: number;
    function draw() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx!.lineWidth = 1;
      for (let x = 0; x < width; x += 100) {
        ctx!.beginPath(); ctx!.moveTo(x, 0); ctx!.lineTo(x, height); ctx!.stroke();
      }
      blocks.forEach(b => {
        b.y -= b.speed;
        if (b.y + b.h < 0) { b.y = height + 100; b.x = Math.random() * width; }
        const g = ctx!.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
        g.addColorStop(0, 'rgba(34, 197, 94, 0)');
        g.addColorStop(0.5, `rgba(34, 197, 94, ${b.opacity})`);
        g.addColorStop(1, 'rgba(34, 197, 94, 0)');
        ctx!.fillStyle = g; ctx!.fillRect(b.x, b.y, b.w, b.h);
        ctx!.strokeStyle = `rgba(34, 197, 94, ${b.opacity * 0.5})`; ctx!.strokeRect(b.x, b.y, b.w, b.h);
      });
      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    function handleResize() { width = canvas!.width = window.innerWidth; height = canvas!.height = window.innerHeight; }
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize); };
  });
</script>

<canvas bind:this={canvas} class="absolute inset-0 w-full h-full pointer-events-none z-[-1] opacity-30 mix-blend-screen"></canvas>
