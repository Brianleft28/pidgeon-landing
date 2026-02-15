import React from 'react';

export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  className?: string;
  icon?: React.ReactNode;
  visual?: React.ReactNode;
}

export interface CaseStudyProps {
  client: string;
  metric: string;
  description: string;
  tags: string[];
}
