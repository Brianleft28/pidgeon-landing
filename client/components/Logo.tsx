
import React, { useEffect, useRef, useState } from 'react';

export const PidgeonLogo: React.FC<{ className?: string; animated?: boolean; glowOnInView?: boolean }> = ({ className, animated = true, glowOnInView = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!glowOnInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { 
        threshold: 0.5, // Trigger when 50% of the logo is visible
        rootMargin: "0px" 
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [glowOnInView]);

  // Determine active state for hyper-glow
  const activeGlow = glowOnInView && isInView;

  return (
    <div ref={ref} className={`relative group ${className}`}>
      {/* Dynamic Glow Layer - Separated opacity from animation for better control */}
      <div 
        className={`absolute inset-0 bg-green-500/30 rounded-full transition-all duration-1000 ease-in-out
        ${animated ? 'animate-pulse-scale' : ''} 
        ${activeGlow ? 'opacity-80 scale-125 blur-3xl' : 'opacity-20 blur-2xl group-hover:opacity-60'}
        `}
      ></div>
      
      {/* Adjusted viewBox to add space at the top (-50 y origin) to prevent cutting off */}
      <svg 
        viewBox="0 -50 500 300" 
        className={`relative z-10 w-full h-full text-green-500 fill-none transition-all duration-700 
        ${activeGlow ? 'drop-shadow-[0_0_30px_rgba(34,197,94,1)]' : 'group-hover:drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]'}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* The Bird Shape - Faithful to the provided PNG structure */}
        <path 
          d="M150,30 C180,30 200,50 200,80 C200,110 180,130 150,130 C120,130 50,180 30,200 C20,210 50,220 80,220 C110,220 180,180 210,140 C240,100 240,60 210,40 C190,20 170,20 150,30 Z" 
          stroke="currentColor" 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Head details */}
        <circle cx="175" cy="65" r="8" fill="currentColor" />
        <path d="M215,75 L235,85 L215,95" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        
        {/* Mechanical/Industrial belly components (the "gears") */}
        <circle cx="95" cy="190" r="12" stroke="currentColor" strokeWidth="6" />
        <path d="M95,190 L95,160" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        
        <circle cx="145" cy="180" r="14" stroke="currentColor" strokeWidth="6" />
        <path d="M145,180 Q160,180 175,200" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />

        {/* Industrial flat legs */}
        <path d="M115,220 L125,245" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        <path d="M100,245 L140,245" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        
        <path d="M165,220 L185,245" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        <path d="M160,245 L210,245" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />

        {/* Logo Text Styling - Modern minimalist sans-serif feel */}
        <text x="260" y="110" className="fill-white font-light text-[90px] tracking-tighter" style={{ fontFamily: 'sans-serif' }}>Pidgeon</text>
        <text x="265" y="185" className="fill-green-500 font-extralight text-[45px] tracking-[0.2em]" style={{ fontFamily: 'sans-serif' }}>SOLUTIONS</text>
      </svg>
      
      <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-scale {
          animation: pulse-scale 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
