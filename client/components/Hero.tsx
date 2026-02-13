import React, { useState, useEffect } from 'react';
import { useTranslation } from '../App';

interface HeroProps {
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  const { t } = useTranslation();
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const rotatingWords = t.heroRotatingWords as string[];
  const staticText = t.heroStaticText;
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseDuration = 2000;

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <section className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden bg-[#0a0a0a]">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Parallax Glow */}
        <div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen will-change-transform"
          style={{
            transform: `translate3d(-50%, calc(-50% + ${scrollY * 0.5}px), 0)`,
          }}
        ></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Brand, Subtitle, CTAs */}
          <div className="text-left order-2 md:order-1 flex flex-col items-start">
            {/* Logo Placeholder with Glow Effect */}
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              <img
                src="/assets/logo/logo.png"
                alt="Pidgeon Solutions Logo"
                className="relative w-48 md:w-64 h-auto object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-transform duration-500 hover:scale-105"
              />
            </div>

            <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-10 max-w-lg">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={onOpenContact}
                className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] shadow-lg shadow-emerald-500/20"
              >
                {t.btnContact}
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 rounded-full border border-slate-800 hover:border-emerald-500/50 text-slate-400 hover:text-white bg-slate-950/50 font-medium transition-all backdrop-blur-sm"
              >
                {t.navServices}
              </button>
            </div>
          </div>

          {/* Right Column: Typewriter Headline */}
          <div className="text-left md:text-right order-1 md:order-2">
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1] min-h-[180px]">
              <span className="block">{staticText}</span>
              <span className="text-emerald-400 block mt-2">
                {text}
                <span className="inline-block w-1.5 h-10 md:h-16 lg:h-20 ml-2 bg-emerald-400 animate-blink align-middle mb-2"></span>
              </span>
            </h1>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes blink {
          50% { background-color: transparent; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </section>
  );
};