import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../App';

const NodeNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const particleCount = 40; // Number of nodes

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      ctx.fillStyle = 'rgba(16, 185, 129, 0.4)'; // Emerald color
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 - dist / 150 * 0.15})`; // Fade out with distance
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    const animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-60" />;
};

const TechCard: React.FC<{ 
  title: string; 
  desc: string; 
  icon: React.ReactNode; 
}> = ({ title, desc, icon }) => (
  <div className="group relative p-1 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 h-full">
    {/* Glassmorphism Background */}
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl transition-colors group-hover:bg-slate-800/60 group-hover:border-emerald-500/30"></div>
    
    {/* Animated Gradient Border */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
       <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
       <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    </div>

    <div className="relative h-full p-8 flex flex-col z-10">
      {/* Icon Container - Floating & Glowing */}
      <div className="mb-6 w-20 h-20 rounded-2xl bg-slate-950/30 flex items-center justify-center border border-white/5 shadow-inner group-hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-all duration-500 overflow-hidden text-emerald-400">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-emerald-300 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed font-light group-hover:text-slate-300">
        {desc}
      </p>
    </div>
  </div>
);

export const RDDSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="rdd" className="relative min-h-[100dvh] flex flex-col justify-center py-32 bg-[#050a10] overflow-hidden border-t border-slate-900 shadow-[inset_0_20px_50px_rgba(0,0,0,0.8)]">
      
      {/* BACKGROUND: Node Network + Dark Gradients */}
      <div className="absolute inset-0 w-full h-full z-0 bg-black/40">
        <NodeNetworkBackground />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-[#050a10] to-black"></div>
      </div>
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-20">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 relative">
           {/* Glow Effect behind title */}
           <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
               Core Capabilities
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-[0_0_25px_rgba(0,0,0,0.5)]">{t.rdd.title}</h2>
            <p className="text-slate-400 max-w-lg">{t.rdd.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card A: Advanced AI Integration */}
          <TechCard 
            title={t.rdd.cards.ai.title}
            desc={t.rdd.cards.ai.desc}
            icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            }
          />

          {/* Card B: MCP */}
          <TechCard 
            title={t.rdd.cards.mcp.title}
            desc={t.rdd.cards.mcp.desc}
            icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            }
          />

          {/* Card C: Complex Systems */}
          <TechCard 
            title={t.rdd.cards.systems.title}
            desc={t.rdd.cards.systems.desc}
            icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
            }
          />
        </div>
      </div>
    </section>
  );
};