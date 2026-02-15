
import React from 'react';

// Shared Gradients for Glass Effect
const IconGradients = () => (
  <defs>
    <linearGradient id="icon-glass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.01" />
    </linearGradient>
    <linearGradient id="icon-neon" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
      <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
    </linearGradient>
    <filter id="icon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
);

export const IconStarter: React.FC<{className?: string}> = ({ className }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <IconGradients />
    {/* Seed/Spark Shape */}
    <path d="M32 12C32 12 20 28 20 40C20 46.6274 25.3726 52 32 52C38.6274 52 44 46.6274 44 40C44 28 32 12 32 12Z" fill="url(#icon-glass)" stroke="url(#icon-neon)" strokeWidth="0.5" />
    <circle cx="32" cy="40" r="6" fill="#22c55e" filter="url(#icon-glow)" opacity="0.6" />
    <path d="M32 20L32 40" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
  </svg>
);

export const IconBusiness: React.FC<{className?: string}> = ({ className }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <IconGradients />
    {/* Isometric Cube */}
    <path d="M32 10L54 22V44L32 56L10 44V22L32 10Z" fill="url(#icon-glass)" stroke="url(#icon-neon)" strokeWidth="1" />
    <path d="M32 10V34M32 34L54 22M32 34L10 22" stroke="url(#icon-neon)" strokeWidth="1" opacity="0.5" />
    <path d="M32 56V34" stroke="url(#icon-neon)" strokeWidth="1" opacity="0.3" />
    {/* Internal Glow */}
    <rect x="24" y="24" width="16" height="16" transform="rotate(45 32 32)" fill="#22c55e" filter="url(#icon-glow)" opacity="0.2" />
  </svg>
);

export const IconEnterprise: React.FC<{className?: string}> = ({ className }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <IconGradients />
    {/* Fortress / Complex Structure */}
    <rect x="12" y="32" width="12" height="20" fill="url(#icon-glass)" stroke="url(#icon-neon)" strokeWidth="1" />
    <rect x="40" y="32" width="12" height="20" fill="url(#icon-glass)" stroke="url(#icon-neon)" strokeWidth="1" />
    <rect x="24" y="16" width="16" height="36" fill="url(#icon-glass)" stroke="url(#icon-neon)" strokeWidth="1" />
    
    <path d="M12 32L32 16L52 32" stroke="url(#icon-neon)" strokeWidth="1" opacity="0.5" />
    <circle cx="32" cy="16" r="4" fill="#06b6d4" filter="url(#icon-glow)" />
    
    {/* Connections */}
    <line x1="4" y1="52" x2="60" y2="52" stroke="#22c55e" strokeWidth="1" opacity="0.5" />
    <circle cx="4" cy="52" r="2" fill="#22c55e" />
    <circle cx="60" cy="52" r="2" fill="#22c55e" />
  </svg>
);
