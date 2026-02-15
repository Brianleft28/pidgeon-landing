import React from 'react';
import { useTranslation } from '../contexts';
import { CaseStudyProps } from '../types';

const CaseCard: React.FC<CaseStudyProps> = ({ client, metric, description, tags }) => (
  <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900/40 transition-colors cursor-default">
    <div className="flex flex-wrap gap-2 mb-6">
      {tags.map((tag, i) => (
        <span key={i} className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">
          {tag}
        </span>
      ))}
    </div>
    <h3 className="text-2xl font-semibold text-white mb-2">{client}</h3>
    <p className="text-cyan-400 font-medium mb-4">{metric}</p>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

export const CaseStudies: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="cases" className="py-32 bg-slate-950">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">{t.caseStudiesTitle}</h2>
            <div className="h-1 w-12 bg-violet-500 rounded-full"></div>
          </div>
          <p className="text-slate-500 text-sm max-w-md text-right hidden md:block">
            Impact driven engineering for real-world problems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CaseCard 
            client={t.cases.logistics.client}
            metric={t.cases.logistics.metric}
            description={t.cases.logistics.desc}
            tags={['LogiTech', 'Automation', 'API Integration']}
          />
          <CaseCard 
            client={t.cases.health.client}
            metric={t.cases.health.metric}
            description={t.cases.health.desc}
            tags={['HealthTech', 'Security', 'Automation']}
          />
        </div>
      </div>
    </section>
  );
};