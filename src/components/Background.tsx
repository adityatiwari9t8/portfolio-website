import React, { useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { CERTIFICATIONS, Certification, EDUCATION, EXPERIENCE, TOOLKIT } from '../data/content';
import CertificateViewer from './CertificateViewer';
import SectionTitle from './SectionTitle';

const Background: React.FC = () => {
  const [cert, setCert] = useState<Certification | null>(null);
  return (
    <div>
      <CertificateViewer cert={cert} onClose={() => setCert(null)} />
      <SectionTitle label="03 / Background" before="The foundations" accent="behind the work." />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <h3 className="eyebrow">Education & experience</h3>
          <ol className="mt-5 border-l border-black/15 pl-6 dark:border-white/15">
            <li className="timeline-entry pb-8">
              <p className="eyebrow">{EDUCATION.period}</p>
              <h4 className="mt-2 text-lg font-semibold tracking-tight">{EDUCATION.degree}</h4>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{EDUCATION.school} · CGPA {EDUCATION.gpa}</p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{EDUCATION.coursework.join(' · ')}</p>
            </li>
            {EXPERIENCE.map((x) => (
              <li key={x.role + x.org + x.period} className="timeline-entry pb-8 last:pb-0">
                <p className="eyebrow">{x.period}</p>
                <h4 className="mt-2 text-lg font-semibold tracking-tight">{x.role}</h4>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{x.org}</p>
                <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {x.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="eyebrow">Technical toolkit</h3>
          <dl className="mt-2 divide-y divide-black/10 dark:divide-white/10">
            {TOOLKIT.map((group) => <div key={group.label} className="py-4">
              <dt className="text-sm font-semibold">{group.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{group.items.join(' · ')}</dd>
            </div>)}
          </dl>
        </div>
      </div>
      {CERTIFICATIONS.length > 0 && <details className="group mt-10 border-y border-black/10 dark:border-white/10">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
          <span>Additional learning <span className="ml-2 text-neutral-600 dark:text-neutral-400">{CERTIFICATIONS.length} certificates</span></span>
          <ChevronDown size={18} aria-hidden className="group-open:rotate-180" />
        </summary>
        <ul className="divide-y divide-black/10 pb-3 dark:divide-white/10">
          {CERTIFICATIONS.map((c) => <li key={c.title} className="flex flex-col justify-between gap-3 py-5 sm:flex-row sm:gap-8">
            <div>
              <h4 className="text-sm font-semibold">{c.title}</h4>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{c.issuer}</p>
              {c.note && <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{c.note}</p>}
            </div>
            {c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-link shrink-0 self-start">View certificate <ArrowUpRight size={14} aria-hidden /></a> : c.image ? <button onClick={() => setCert(c)} className="text-link shrink-0 self-start">View certificate <ArrowUpRight size={14} aria-hidden /></button> : null}
          </li>)}
        </ul>
      </details>}
    </div>
  );
};
export default Background;
