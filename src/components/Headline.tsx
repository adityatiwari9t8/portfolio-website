import React from 'react';
interface HeadlineProps { as?: 'h1' | 'h2' | 'p'; before: string; accent: string; after?: string; className?: string; }
const Headline: React.FC<HeadlineProps> = ({ as: Tag = 'h2', before, accent, after, className = '' }) => (
  <Tag className={`section-title ${className}`}>{before}{' '}<span>{accent}</span>{after ? ` ${after}` : ''}</Tag>
);
export default Headline;
