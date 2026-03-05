<script lang="ts">
  let canvas = $state<HTMLCanvasElement>();

  $effect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const connectionDistance = 150;

    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < 40; i++) {
      nodes.push({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 });
    }

    let animId: number;
    function draw() {
      ctx!.clearRect(0, 0, width, height);
      nodes.forEach((node, i) => {
        node.x += node.vx; node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        ctx!.beginPath(); ctx!.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = '#10b981'; ctx!.fill();
        for (let j = i + 1; j < nodes.length; j++) {
          const o = nodes[j];
          const dist = Math.sqrt((node.x - o.x) ** 2 + (node.y - o.y) ** 2);
          if (dist < connectionDistance) {
            ctx!.beginPath(); ctx!.moveTo(node.x, node.y); ctx!.lineTo(o.x, o.y);
            ctx!.strokeStyle = `rgba(16, 185, 129, ${(1 - dist / connectionDistance) * 0.3})`;
            ctx!.lineWidth = 1; ctx!.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    function handleResize() { width = canvas!.width = window.innerWidth; height = canvas!.height = window.innerHeight; }
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize); };
  });
</script>

<canvas bind:this={canvas} class="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40 mix-blend-screen"></canvas>
