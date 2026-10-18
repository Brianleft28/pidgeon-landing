<script lang="ts">
  let canvas = $state<HTMLCanvasElement>();

  $effect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const streams: { x: number; y: number; speed: number; length: number; color: string }[] = [];
    for (let i = 0; i < 60; i++) {
      streams.push({
        x: Math.random() * width, y: Math.random() * height,
        speed: 1 + Math.random() * 3, length: 50 + Math.random() * 150,
        color: Math.random() > 0.5 ? '#06b6d4' : '#22c55e',
      });
    }

    let animId: number;
    function draw() {
      ctx!.fillStyle = 'rgba(2, 6, 23, 0.2)';
      ctx!.fillRect(0, 0, width, height);
      streams.forEach(s => {
        s.y += s.speed;
        if (s.y > height + s.length) { s.y = -s.length; s.x = Math.random() * width; }
        const g = ctx!.createLinearGradient(s.x, s.y, s.x, s.y - s.length);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, s.color); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.beginPath(); ctx!.strokeStyle = g; ctx!.lineWidth = Math.random() * 2;
        ctx!.moveTo(s.x, s.y); ctx!.lineTo(s.x, s.y - s.length); ctx!.stroke();
      });
      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    function handleResize() { width = canvas!.width = window.innerWidth; height = canvas!.height = window.innerHeight; }
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize); };
  });
</script>

<canvas bind:this={canvas} class="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen"></canvas>
