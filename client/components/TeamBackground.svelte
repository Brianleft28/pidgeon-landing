<script lang="ts">
  let canvas = $state<HTMLCanvasElement>();

  $effect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const shapes: { x: number; y: number; size: number; speed: number; opacity: number; rotation: number }[] = [];
    for (let i = 0; i < 15; i++) {
      shapes.push({
        x: Math.random() * width, y: Math.random() * height,
        size: 50 + Math.random() * 200, speed: (Math.random() - 0.5) * 0.2,
        opacity: 0.02 + Math.random() * 0.05, rotation: Math.random() * 360,
      });
    }

    let animId: number;
    function draw() {
      ctx!.clearRect(0, 0, width, height);
      shapes.forEach(s => {
        s.y -= s.speed; s.rotation += 0.05;
        if (s.y < -s.size) s.y = height + s.size;
        if (s.y > height + s.size) s.y = -s.size;
        ctx!.save();
        ctx!.translate(s.x, s.y);
        ctx!.rotate((s.rotation * Math.PI) / 180);
        ctx!.strokeStyle = `rgba(255, 255, 255, ${s.opacity})`; ctx!.lineWidth = 1;
        ctx!.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
        ctx!.fillStyle = `rgba(255, 255, 255, ${s.opacity * 0.2})`;
        ctx!.fillRect(-s.size / 2, -s.size / 2, s.size, s.size);
        ctx!.restore();
      });
      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    function handleResize() { width = canvas!.width = window.innerWidth; height = canvas!.height = window.innerHeight; }
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize); };
  });
</script>

<canvas bind:this={canvas} class="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20"></canvas>
