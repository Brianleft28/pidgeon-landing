
import React, { useEffect, useRef } from 'react';

export const VeoTeamBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Geometric Shapes (Squares/Rectangles)
    const shapes: { x: number; y: number; size: number; speed: number; opacity: number; rotation: number }[] = [];
    const numShapes = 15;

    for (let i = 0; i < numShapes; i++) {
      shapes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 50 + Math.random() * 200,
        speed: (Math.random() - 0.5) * 0.2, // Very slow movement
        opacity: 0.02 + Math.random() * 0.05, // Very subtle
        rotation: Math.random() * 360
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      shapes.forEach(shape => {
        shape.y -= shape.speed;
        shape.rotation += 0.05;

        // Wrap around
        if (shape.y < -shape.size) shape.y = height + shape.size;
        if (shape.y > height + shape.size) shape.y = -shape.size;

        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate((shape.rotation * Math.PI) / 180);
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${shape.opacity})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        
        // Optional fill for depth
        ctx.fillStyle = `rgba(255, 255, 255, ${shape.opacity * 0.2})`;
        ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        
        ctx.restore();
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
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20"
    />
  );
};
