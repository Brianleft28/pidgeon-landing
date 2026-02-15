
import React from 'react';

// Common Gradient Definitions
const GlassGradients = () => (
  <defs>
    <linearGradient id="glass-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
    </linearGradient>
    <linearGradient id="glass-green" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
    </linearGradient>
    <linearGradient id="glass-purple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
);

export const IconBrain: React.FC<{className?: string}> = ({ className }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <GlassGradients />
    <path d="M32 12C20 12 10 22 10 34C10 46 20 56 32 56C44 56 54 46 54 34C54 22 44 12 32 12Z" fill="url(#glass-purple)" stroke="#8b5cf6" strokeWidth="1" opacity="0.5" />
    <path d="M32 16C24 16 18 24 18 34" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" filter="url(#glow)" />
    <path d="M46 34C46 24 40 16 32 16" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M22 34C22 42 28 48 32 48" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <circle cx="32" cy="34" r="6" fill="#8b5cf6" filter="url(#glow)" />
    <circle cx="32" cy="34" r="10" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2 2" />
  </svg>
);

export const IconConnect: React.FC<{className?: string}> = ({ className }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <GlassGradients />
    <rect x="12" y="12" width="16" height="16" rx="4" fill="url(#glass-green)" stroke="#4ade80" strokeWidth="1" />
    <rect x="36" y="36" width="16" height="16" rx="4" fill="url(#glass-green)" stroke="#4ade80" strokeWidth="1" />
    <rect x="36" y="12" width="16" height="16" rx="4" fill="url(#glass-cyan)" stroke="#67e8f9" strokeWidth="1" opacity="0.5" />
    
    <path d="M28 20H36" stroke="#4ade80" strokeWidth="2" filter="url(#glow)" />
    <path d="M20 28V36H36" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" filter="url(#glow)" />
    <circle cx="20" cy="20" r="2" fill="#fff" />
    <circle cx="44" cy="44" r="2" fill="#fff" />
  </svg>
);

export const IconAuto: React.FC<{className?: string}> = ({ className }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <GlassGradients />
    <path d="M32 8L42 26H58L44 36L48 56L32 44L16 56L20 36L6 26H22L32 8Z" fill="url(#glass-cyan)" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
    <path d="M32 14L38 28H50L40 34L44 48L32 40L20 48L24 34L14 28H26L32 14Z" stroke="#22d3ee" strokeWidth="2" strokeLinejoin="round" filter="url(#glow)" />
    <circle cx="32" cy="32" r="4" fill="#fff" filter="url(#glow)" />
  </svg>
);

export const IconVideo: React.FC<{className?: string}> = ({ className }) => (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlassGradients />
      <rect x="8" y="12" width="48" height="32" rx="4" fill="url(#glass-cyan)" stroke="#06b6d4" strokeWidth="1" opacity="0.2" />
      <path d="M26 20L42 28L26 36V20Z" fill="#06b6d4" filter="url(#glow)" />
      <path d="M12 52H52" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="52" r="3" fill="#22c55e" filter="url(#glow)" />
    </svg>
  );
