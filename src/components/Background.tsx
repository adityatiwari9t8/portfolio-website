import React, { useState } from 'react';
import { ArrowUpRight, Award, Briefcase, Calendar, Check, ChevronDown, GraduationCap, Github } from 'lucide-react';
import { CERTIFICATIONS, Certification, EDUCATION, EXPERIENCE, NOW, OPEN_TO, TOOLKIT } from '../data/content';
import { SITE } from '../data/site';
import SectionTitle from './SectionTitle';
import Reveal from './Reveal';
import CertificateViewer from './CertificateViewer';

/** Lists longer than this fold the rest behind a "Show all" button, so a long history never swamps the page. */
const SHOW_EXPERIENCE = 3;
const SHOW_CERTIFICATIONS = 6;

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-md border border-black/10 bg-white px-2.5 py-1 text-[13px] font-medium text-neutral-800 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200">
    {children}
  </span>
);

/** "Show all 8" / "Show fewer" under a folded list. Renders nothing when the list is short. */
const MoreToggle: React.FC<{ total: number; limit: number; open: boolean; onToggle: () => void; what: string }> = ({
  total,
  limit,
  open,
  onToggle,
  what
}) =>
  total > limit ? (
    <button
      onClick={onToggle}
      aria-expanded={open}
      className="mt-5 inline-flex items-center gap-1.5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-900 underline-offset-[6px] hover:underline dark:text-neutral-100"
    >
      {open ? 'Show fewer' : `Show all ${total} ${what}`}
      <ChevronDown className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`} />
    </button>
  ) : null;

const subLabel = 'font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[#666] dark:text-neutral-400';
const meta = 'font-mono text-[12px] leading-snug text-[#666] dark:text-neutral-400';
const pill =
  'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-black/15 px-3.5 py-2 font-mono text-[11.5px] font-semibold uppercase tracking-[0.06em] text-neutral-900 transition hover:bg-black/5 dark:border-white/20 dark:text-neutral-100 dark:hover:bg-white/10';

/** One block of the section: a label on the left, its content on the right, a hairline above. */
const Row: React.FC<{ title: string; children: React.ReactNode; delay?: number }> = ({ title, children, delay }) => (
  <Reveal delay={delay}>
    <div className="grid gap-4 border-t border-black/10 py-8 md:grid-cols-[10.5rem_minmax(0,1fr)] md:gap-10 md:py-10 dark:border-white/10">
      <h3 className="font-display text-xl font-bold uppercase leading-none tracking-[0.005em] text-neutral-950 md:pt-1 md:text-lg dark:text-white">{title}</h3>
      <div className="min-w-0">{children}</div>
    </div>
  </Reveal>
);

/** Education, skills, experience, certifications and availability, laid out like a resume that is easy to scan. */
const Background: React.FC = () => {
  const [cert, setCert] = useState<Certification | null>(null);
  const [allExperience, setAllExperience] = useState(false);
  const [allCerts, setAllCerts] = useState(false);

  const experience = allExperience ? EXPERIENCE : EXPERIENCE.slice(0, SHOW_EXPERIENCE);
  const certs = allCerts ? CERTIFICATIONS : CERTIFICATIONS.slice(0, SHOW_CERTIFICATIONS);

  return (
    <div>
      <CertificateViewer cert={cert} onClose={() => setCert(null)} />
      <Reveal>
        <SectionTitle
          id="background"
          label="Experience"
          before="Experience &"
          accent="education"
          sub="Where I study, the skills I work with, and what I've done so far."
        />
      </Reveal>

      <div className="mx-auto mt-10 max-w-5xl border-b border-black/10 sm:mt-14 dark:border-white/10">
        {/* education */}
        <Row title="Education">
          <h4 className="text-xl font-medium tracking-[-0.01em] text-neutral-950 sm:text-2xl dark:text-white">{EDUCATION.degree}</h4>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <span className="inline-flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-neutral-500" aria-hidden />
              {EDUCATION.school}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-500" aria-hidden />
              {EDUCATION.period}
            </span>
            <span className="inline-flex items-center gap-2 font-semibold text-neutral-950 dark:text-white">
              <Award className="h-4 w-4 text-neutral-500" aria-hidden />
              CGPA {EDUCATION.gpa}
            </span>
          </div>
          <p className={`${subLabel} mt-7`}>CS fundamentals</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {EDUCATION.coursework.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </Row>

        {/* skills: any number of groups, side by side when there is room */}
        {TOOLKIT.length > 0 && (
          <Row title="Skills">
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
              {TOOLKIT.map((g) => (
                <div key={g.label}>
                  <p className={subLabel}>{g.label}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {g.items.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Row>
        )}

        {/* experience: one entry per role, so each new role just adds an entry */}
        {EXPERIENCE.length > 0 && (
          <Row title="Experience">
            <ol className="divide-y divide-black/10 dark:divide-white/10">
              {experience.map((x) => (
                <li key={x.role + x.org + x.period} className="py-6 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <h4 className="text-lg font-medium tracking-[-0.01em] text-neutral-950 dark:text-white">{x.role}</h4>
                    <span className={`${meta} inline-flex items-center gap-1.5 whitespace-nowrap`}>
                      <Calendar className="h-3.5 w-3.5" aria-hidden />
                      {x.period}
                    </span>
                  </div>
                  <p className="mt-1 inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <Briefcase className="h-4 w-4 text-neutral-500" aria-hidden />
                    {x.org}
                  </p>
                  {x.points.length > 0 && (
                    <ul className="mt-4 max-w-3xl space-y-2.5">
                      {x.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                          <span aria-hidden className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
            <MoreToggle
              total={EXPERIENCE.length}
              limit={SHOW_EXPERIENCE}
              open={allExperience}
              onToggle={() => setAllExperience((v) => !v)}
              what="roles"
            />
          </Row>
        )}

        {/* certifications: one line each, with the verify link on the right */}
        {CERTIFICATIONS.length > 0 && (
          <Row title={CERTIFICATIONS.length > 1 ? 'Certifications' : 'Certification'}>
            <ul className="divide-y divide-black/10 dark:divide-white/10">
              {certs.map((c) => (
                <li key={c.title} className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                  <div className="min-w-0">
                    <h4 className="text-[15px] font-medium leading-snug text-neutral-950 sm:text-base dark:text-white">{c.title}</h4>
                    <p className={`${meta} mt-1.5`}>{c.issuer}</p>
                    {c.note && <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{c.note}</p>}
                  </div>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className={pill}>
                      View certificate
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  ) : (
                    c.image && (
                      <button onClick={() => setCert(c)} className={pill}>
                        View certificate
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    )
                  )}
                </li>
              ))}
            </ul>
            <MoreToggle
              total={CERTIFICATIONS.length}
              limit={SHOW_CERTIFICATIONS}
              open={allCerts}
              onToggle={() => setAllCerts((v) => !v)}
              what="certificates"
            />
          </Row>
        )}

        {/* right now */}
        {NOW.length > 0 && (
          <Row title="Right now">
            <ul className="space-y-3">
              {NOW.map((n) => (
                <li key={n} className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                  <span aria-hidden className="pulse-dot mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {n}
                </li>
              ))}
            </ul>
          </Row>
        )}

        {/* availability */}
        <Row title="Open to">
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {OPEN_TO.map((o) => (
              <li key={o} className="flex items-center gap-2 text-[15px] font-medium text-neutral-900 dark:text-neutral-100">
                <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                {o}
              </li>
            ))}
          </ul>
          <a href={SITE.socials.github} target="_blank" rel="noopener noreferrer" className={`${pill} mt-6`}>
            <Github className="h-4 w-4" aria-hidden />
            See my code on GitHub
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </Row>
      </div>
    </div>
  );
};

export default Background;
