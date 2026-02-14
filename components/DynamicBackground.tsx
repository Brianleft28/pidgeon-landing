import React, { useState, useEffect } from 'react';

interface ShapeProps {
  top: number;
  left: number;
  size: number;
  speed: number;
  rotation: number;
  opacity: number;
  blur: number;
  color: string;
  scrollY: number;
}

const Shape: React.FC<ShapeProps> = ({ top, left, size, speed, rotation, opacity, blur, color, scrollY }) => {
  const style = {
    position: 'absolute' as const,
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: `${color}1A`,
    border: `1px solid ${color}33`,
    borderRadius: '30%',
    transform: `translate(-50%, -50%) translateY(${scrollY * speed}px) rotate(${rotation}deg)`,
    opacity: opacity,
    filter: `blur(${blur}px)`,
    transition: 'transform 0.3s ease-out',
    willChange: 'transform' as const,
  };

  return <div style={style}></div>;
};

export const DynamicBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const onScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Shape scrollY={scrollY} top={15} left={10} size={180} speed={0.25} rotation={45} opacity={0.3} blur={40} color="#10b981" />
      <Shape scrollY={scrollY} top={25} left={90} size={250} speed={0.1} rotation={-30} opacity={0.2} blur={50} color="#22c55e" />
      <Shape scrollY={scrollY} top={70} left={5} size={350} speed={-0.15} rotation={-50} opacity={0.15} blur={60} color="#38bdf8" />
      <Shape scrollY={scrollY} top={85} left={95} size={150} speed={0.3} rotation={20} opacity={0.4} blur={30} color="#6366f1" />
      <Shape scrollY={scrollY} top={50} left={50} size={220} speed={0.05} rotation={10} opacity={0.1} blur={70} color="#a78bfa" />
    </div>
  );
};