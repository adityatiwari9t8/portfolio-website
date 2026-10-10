import React, { useState } from 'react';
import { Activity, ArrowUpRight, Award, Briefcase, Calendar, Check, ChevronDown, GraduationCap, Github, Handshake, Layers, LucideIcon } from 'lucide-react';
import { CERTIFICATIONS, Certification, EDUCATION, EXPERIENCE, NOW, OPEN_TO, TOOLKIT } from '../data/content';
import { SITE } from '../data/site';
import SectionTitle from './SectionTitle';
import Reveal from './Reveal';
import CertificateViewer from './CertificateViewer';

/** Lists longer than this fold the rest behind a "Show all" button, so a long history never swamps the page. */
const SHOW_EXPERIENCE = 3;
const SHOW_CERTIFICATIONS = 6;

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-md border border-black/10 bg-neutral-50 px-2.5 py-1 text-[13px] max-sm:px-2 max-sm:text-[12.5px] font-medium text-neutral-800 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200">
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

/** One block of the section: a card with an icon, a title and an optional count in its header. */
const Card: React.FC<{
  title: string;
  icon: LucideIcon;
  count?: number;
  className?: string;
  delay?: number;
  children: React.ReactNode;
}> = ({ title, icon: Icon, count, className = '', delay, children }) => (
  <Reveal delay={delay} className={className}>
    <section className="glow h-full rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] sm:p-8 max-sm:rounded-[1.25rem] max-sm:p-5 dark:border-white/10 dark:bg-neutral-900">
      <header className="mb-6 flex items-center gap-3 max-sm:mb-5 sm:mb-7">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <h3 className="font-display text-lg font-bold uppercase leading-none tracking-[0.005em] text-neutral-950 dark:text-white">{title}</h3>
        {count !== undefined && count > 1 && (
          <span className="ml-auto rounded-full border border-black/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#666] dark:border-white/15 dark:text-neutral-400">
            {String(count).padStart(2, '0')}
          </span>
        )}
      </header>
      {children}
    </section>
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
          before="Skills &"
          accent="background"
          sub="Education, the skills I can be interviewed on, experience, and what I'm working on right now."
        />
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 max-sm:mt-6 max-sm:gap-3 sm:mt-14 sm:gap-5 md:grid-cols-2">
        {/* education */}
        <Card title="Education" icon={GraduationCap} className="md:col-span-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h4 className="text-xl font-medium tracking-[-0.01em] text-neutral-950 sm:text-2xl dark:text-white">{EDUCATION.degree}</h4>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <span>{EDUCATION.school}</span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-500" aria-hidden />
                  {EDUCATION.period}
                </span>
              </div>
            </div>
            <div className="shrink-0 self-start rounded-2xl border border-black/10 bg-neutral-50 px-5 py-3 sm:text-right dark:border-white/10 dark:bg-white/5">
              <p className={subLabel}>CGPA</p>
              <p className="mt-1 font-display text-3xl font-bold leading-none text-neutral-950 dark:text-white">
                {EDUCATION.gpa.split('/')[0].trim()}
                {EDUCATION.gpa.includes('/') && (
                  <span className="ml-1 text-base font-medium text-[#666] dark:text-neutral-400">/ {EDUCATION.gpa.split('/')[1].trim()}</span>
                )}
              </p>
            </div>
          </div>
          <p className={`${subLabel} mt-7`}>CS fundamentals</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {EDUCATION.coursework.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </Card>

        {/* skills: any number of groups, two per row when there is room */}
        {TOOLKIT.length > 0 && (
          <Card title="Skills" icon={Layers} className="md:col-span-2">
            <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
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
          </Card>
        )}

        {/* experience: one entry per role, so each new role just adds an entry */}
        {EXPERIENCE.length > 0 && (
          <Card title="Experience" icon={Briefcase} count={EXPERIENCE.length} className="md:col-span-2">
            <ol className="relative ml-1 border-l border-black/10 dark:border-white/10">
              {experience.map((x, i) => (
                <li key={x.role + x.org + x.period} className="relative pb-8 pl-6 last:pb-0 sm:pl-8">
                  <span
                    aria-hidden
                    className={`absolute -left-[6px] top-[0.45em] h-[11px] w-[11px] rounded-full ring-4 ring-white dark:ring-neutral-900 ${
                      i === 0 ? 'bg-emerald-500' : 'bg-neutral-400 dark:bg-neutral-500'
                    }`}
                  />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <h4 className="text-lg font-medium tracking-[-0.01em] text-neutral-950 dark:text-white">{x.role}</h4>
                    <span className={`${meta} inline-flex items-center gap-1.5 whitespace-nowrap`}>
                      <Calendar className="h-3.5 w-3.5" aria-hidden />
                      {x.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{x.org}</p>
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
          </Card>
        )}

        {/* right now */}
        {NOW.length > 0 && (
          <Card title="Right now" icon={Activity} className={OPEN_TO.length > 0 ? '' : 'md:col-span-2'}>
            <ul className="space-y-3">
              {NOW.map((n) => (
                <li key={n} className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                  <span aria-hidden className="pulse-dot mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {n}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* availability */}
        <Card title="Open to" icon={Handshake} className={NOW.length > 0 ? '' : 'md:col-span-2'}>
          <ul className="space-y-3">
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
        </Card>

        {/* certifications: one line each, with the verify link on the right */}
        {CERTIFICATIONS.length > 0 && (
          <Card
            title={CERTIFICATIONS.length > 1 ? 'Certifications' : 'Certification'}
            icon={Award}
            count={CERTIFICATIONS.length}
            className="md:col-span-2"
          >
            <ul className="divide-y divide-black/10 dark:divide-white/10">
              {certs.map((c) => (
                <li key={c.title} className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                  <div className="min-w-0">
                    <h4 className="text-[15px] font-medium leading-snug text-neutral-950 sm:text-base dark:text-white">{c.title}</h4>
                    <p className={`${meta} mt-1.5`}>{c.issuer}</p>
                    {c.note && <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{c.note}</p>}
                  </div>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className={`${pill} max-sm:self-start`}>
                      View certificate
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  ) : (
                    c.image && (
                      <button onClick={() => setCert(c)} className={`${pill} max-sm:self-start`}>
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
          </Card>
        )}
      </div>
    </div>
  );
};

export default Background;
