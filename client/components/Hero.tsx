
import React, { useState, useEffect } from 'react';
import { useTranslation, useModal } from '../contexts';
import { VeoHeroBackground } from './VeoHeroBackground';

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const { openContactModal } = useModal();
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const rotatingWords = t.heroRotatingWords as string[];
  const staticText = t.heroStaticText;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseDuration = 2000;

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = rotatingWords[wordIndex];
      const updatedText = isDeleting
        ? currentWord.substring(0, text.length - 1)
        : currentWord.substring(0, text.length + 1);

      setText(updatedText);

      if (!isDeleting && updatedText === currentWord) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % rotatingWords.length);
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, rotatingWords]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-slate-950">
      
      {/* 1. VEO Background Layer */}
      <VeoHeroBackground />
      
      {/* 2. Black Overlay for Readability */}
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 h-full">
        
        <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
            
            {/* Left Column: Client-Oriented Text */}
            <div className="flex flex-col justify-center order-2 lg:order-1 pt-12 lg:pt-0">
                
                {/* Title */}
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6">
                    {staticText}
                </h1>

                {/* Cyan Block / Rotating Text Highlight */}
                <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 p-2 md:p-4 mb-8 inline-block transform -skew-x-2 w-fit">
                    <span className="text-4xl md:text-6xl font-bold text-slate-950 block transform skew-x-2 px-2 whitespace-nowrap">
                        {text}
                        <span className="inline-block w-1 h-8 md:h-12 ml-1 bg-slate-950 animate-blink align-middle"></span>
                    </span>
                </div>

                {/* Description */}
                <p className="text-lg md:text-xl text-slate-400 max-w-xl mb-12 font-light leading-relaxed">
                   {t.heroSubtitle}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-5">
                    <button 
                        onClick={() => openContactModal()}
                        className="px-10 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)] w-full sm:w-auto"
                    >
                        {t.btnContact}
                    </button>
                    <button 
                        onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})}
                        className="px-10 py-4 rounded-full border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-white bg-slate-900/50 font-medium text-lg transition-all w-full sm:w-auto"
                    >
                        {t.navServices}
                    </button>
                </div>
            </div>

            {/* Right Column: Logo Image (Inverted for black assets) */}
            <div className="flex items-center justify-center order-1 lg:order-2">
                <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                    {/* Glow effect behind logo */}
                    <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                    
                    {/* Actual Logo Asset */}
                    <img 
                        src="public/assets/logo2.png" 
                        alt="Hero Logo" 
                        className="relative z-10 w-full h-auto object-contain max-h-[400px] invert brightness-0 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        onError={(e) => {
                            // Fallback if image not found to avoid broken icon, showing placeholder text/box instead
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.classList.add('border', 'border-dashed', 'border-slate-700', 'rounded-xl');
                        }}
                    />
                </div>
            </div>

        </div>

      </div>
      <style>{`
        @keyframes blink { 50% { background-color: transparent; } }
        .animate-blink { animation: blink 1s step-end infinite; }
      `}</style>
    </section>
  );
};
