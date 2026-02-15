
import React, { useEffect, useRef } from 'react';

export const VeoHeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Mist Particles Configuration
    const particles: { x: number; y: number; r: number; dx: number; dy: number; opacity: number }[] = [];
    const numParticles = 35; // Number of mist clouds

    // Initialize Mist Clouds
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 300 + 200, // Large radius for soft mist
        dx: (Math.random() - 0.5) * 0.3, // Very slow, drift-like movement
        dy: (Math.random() - 0.5) * 0.1, // Minimal vertical movement
        opacity: Math.random() * 0.08 + 0.02 // Very low opacity for subtlety
      });
    }

    const draw = () => {
      // 1. Deep Black Base
      ctx.fillStyle = '#020617'; // Slate-950 equivalent
      ctx.fillRect(0, 0, width, height);

      // 2. Render Mist Clouds
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;

        // Seamless Loop / Wrap around screen
        if (p.x < -p.r) p.x = width + p.r;
        if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        if (p.y > height + p.r) p.y = -p.r;

        // Soft Radial Gradient for Mist
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        
        // Subtle Cyan tint fading to transparent
        gradient.addColorStop(0, `rgba(6, 182, 212, ${p.opacity})`); // Cyan-500 tint
        gradient.addColorStop(0.4, `rgba(15, 23, 42, ${p.opacity * 0.5})`); // Slate tint
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
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
      className="absolute inset-0 w-full h-full object-cover -z-10"
    />
  );
};
