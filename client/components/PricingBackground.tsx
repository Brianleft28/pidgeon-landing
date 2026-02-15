
import React, { useEffect, useRef } from 'react';

export const PricingBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // "Rising Structures" - Rectangles moving up
    const blocks: { x: number; y: number; w: number; h: number; speed: number; opacity: number }[] = [];
    const numBlocks = 40;

    for (let i = 0; i < numBlocks; i++) {
      blocks.push({
        x: Math.random() * width,
        y: Math.random() * height + height, // Start below or random
        w: 20 + Math.random() * 100,
        h: 100 + Math.random() * 300,
        speed: 0.5 + Math.random() * 1.5,
        opacity: 0.05 + Math.random() * 0.15
      });
    }

    const draw = () => {
      // Clear with slight trail effect not needed here, just clean clear for crisp lines
      ctx.clearRect(0, 0, width, height);
      
      // Grid lines background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 100;
      
      // Vertical grid
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Rising Blocks
      blocks.forEach(b => {
        b.y -= b.speed;
        
        // Reset if moves off screen
        if (b.y + b.h < 0) {
          b.y = height + 100;
          b.x = Math.random() * width;
        }

        const gradient = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
        gradient.addColorStop(0, `rgba(34, 197, 94, 0)`); // Fade top
        gradient.addColorStop(0.5, `rgba(34, 197, 94, ${b.opacity})`); // Green center
        gradient.addColorStop(1, `rgba(34, 197, 94, 0)`); // Fade bottom

        ctx.fillStyle = gradient;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        
        // Wireframe edge
        ctx.strokeStyle = `rgba(34, 197, 94, ${b.opacity * 0.5})`;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
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
      className="absolute inset-0 w-full h-full pointer-events-none z-[-1] opacity-30 mix-blend-screen"
    />
  );
};
