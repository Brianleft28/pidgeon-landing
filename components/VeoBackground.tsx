
import React, { useEffect, useRef } from 'react';

export const VeoBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // "Data Streams" - Vertical lines with varying speeds and opacities
    const streams: { x: number; y: number; speed: number; length: number; color: string }[] = [];
    const numStreams = 60;

    for (let i = 0; i < numStreams; i++) {
      streams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 1 + Math.random() * 3,
        length: 50 + Math.random() * 150,
        color: Math.random() > 0.5 ? '#06b6d4' : '#22c55e' // Cyan or Green
      });
    }

    const draw = () => {
      // "Dark Void" - Clear with a very slight fade for trail effect
      ctx.fillStyle = 'rgba(2, 6, 23, 0.2)'; // Slate-950 with opacity
      ctx.fillRect(0, 0, width, height);

      streams.forEach(s => {
        // Update position
        s.y += s.speed;
        if (s.y > height + s.length) {
          s.y = -s.length;
          s.x = Math.random() * width;
        }

        // Draw Stream
        const gradient = ctx.createLinearGradient(s.x, s.y, s.x, s.y - s.length);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.5, s.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.random() * 2;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x, s.y - s.length);
        ctx.stroke();
      });

      requestAnimationFrame(draw);
    };

    const animId = requestAnimationFrame(draw);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen"
    />
  );
};
