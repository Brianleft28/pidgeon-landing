export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  className?: string;
}

export interface CaseStudyProps {
  client: string;
  metric: string;
  description: string;
  tags: string[];
}
