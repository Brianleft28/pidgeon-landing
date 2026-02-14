
import React from 'react';
import { useTranslation } from '../App';
import { VeoTeamBackground } from './VeoTeamBackground';

/**
 * Mapped images for the team members.
 */
const teamImages: Record<string, string> = {
  "Brian Benegas": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  "Gastón Alejandro": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  "Thomas Pineda": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
};

interface TeamMember {
  name: string;
  role: string;
  description?: string;
  link?: string;
  linkType?: 'linkedin' | 'behance' | 'pdf' | 'github';
  image?: string;
  imagePosition?: string;
}

const TeamMemberCard: React.FC<TeamMember> = ({ name, role, description, link, image, imagePosition }) => {
  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1">
      
      {/* Image */}
      <div className="flex justify-center md:justify-start mb-6">
        <div 
          className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 group-hover:border-emerald-500/30 transition-colors"
        >
            <img 
                src={image || ""} 
                alt={name}
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                style={{ objectPosition: imagePosition || 'center top' }}
            />
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center md:text-left">
          <h3 className="text-xl font-sans font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
            {name}
          </h3>
          
          <p className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">
            {role}
          </p>

          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
            {description}
          </p>
      </div>

      {/* Subtle Link Overlay */}
      {link && (
        <a href={link} target="_blank" rel="noreferrer" className="absolute inset-0 z-10" aria-label={`View profile of ${name}`}></a>
      )}
    </div>
  );
};

export const TeamSection: React.FC = () => {
  const { t } = useTranslation();
  
  const members = t.teamMembers as TeamMember[];

  return (
    <section id="team" className="relative py-24 bg-slate-950 overflow-hidden border-t border-slate-900">
      
      {/* 1. VEO Abstract Background */}
      <VeoTeamBackground />
      
      {/* Gradient Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-16 text-center md:text-left max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">{t.teamTitle}</h2>
            <p className="text-slate-400 text-lg font-light">{t.teamSubtitle}</p>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {members.map((member, index) => (
            <TeamMemberCard 
                key={index} 
                {...member} 
                image={teamImages[member.name] || member.image} 
            />
          ))}
        </div>

      </div>
    </section>
  );
};
