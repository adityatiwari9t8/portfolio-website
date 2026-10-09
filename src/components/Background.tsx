import React, { useState } from 'react';
import { ArrowUpRight, Award, Briefcase, Calendar, ChevronDown, GraduationCap, Check, Github } from 'lucide-react';
import { CERTIFICATIONS, Certification, EDUCATION, EXPERIENCE, NOW, OPEN_TO, TOOLKIT } from '../data/content';
import { SITE } from '../data/site';
import SectionTitle from './SectionTitle';
import Reveal from './Reveal';
import CertificateViewer from './CertificateViewer';

/** Lists longer than this fold the rest behind a "Show all" button, so a long history never swamps the page. */
const SHOW_EXPERIENCE = 3;
const SHOW_CERTIFICATIONS = 6;


const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-neutral-100 px-3.5 py-1.5 text-sm font-medium text-neutral-700 dark:bg-white/10 dark:text-neutral-200">
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
      className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-200 dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/20"
    >
      {open ? 'Show fewer' : `Show all ${total} ${what}`}
      <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
    </button>
  ) : null;

const card =
  'glow lit rounded-[1.5rem] border border-black/5 bg-white p-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] dark:border-white/10 dark:bg-neutral-900';
const certLink =
  'mt-3 inline-flex items-center gap-1 text-sm font-semibold text-neutral-800 underline-offset-4 hover:underline dark:text-neutral-200';
const label = 'font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-[#666] dark:text-neutral-400';

/** Education, experience, certifications, toolkit and availability in one place, for recruiters and clients. */
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
        sub="Education, skills and experience at a glance."
      />
    </Reveal>

    <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:mt-12 md:grid-cols-[1.4fr_1fr]">
      {/* education */}
      <Reveal variant="left" className="h-full">
      <div className={`${card} h-full`}>
        <p className={label}>Education</p>
        <h3 className="mt-4 text-xl font-medium tracking-[-0.01em] text-neutral-950 sm:text-2xl dark:text-white">
          {EDUCATION.degree}
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="inline-flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            {EDUCATION.school}
          </span>
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {EDUCATION.period}
          </span>
          <span className="inline-flex items-center gap-2">
            <Award className="h-4 w-4" />
            CGPA {EDUCATION.gpa}
          </span>
        </div>
        <p className={`${label} mt-7`}>CS fundamentals</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {EDUCATION.coursework.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      </div>
      </Reveal>

      {/* availability */}
      <Reveal variant="right" delay={120} className="h-full">
      <div className="lit h-full rounded-[1.5rem] border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white p-7 text-neutral-950 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] dark:border-emerald-400/15 dark:from-emerald-500/10 dark:to-neutral-900 dark:text-white">
        <p className={label}>
          Open to
        </p>
        <ul className="mt-5 space-y-3">
          {OPEN_TO.map((o) => (
            <li key={o} className="flex items-start gap-2.5 text-[15px] font-medium">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              {o}
            </li>
          ))}
        </ul>
        <a
          href={SITE.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        >
          <Github className="h-4 w-4" />
          See my code on GitHub
        </a>
      </div>
      </Reveal>

      {/* toolkit: any number of groups, laid out side by side when there is room */}
      {TOOLKIT.length > 0 && (
      <Reveal variant="scale" delay={100} className="md:col-span-2">
      <div className={card}>
        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]">
          {TOOLKIT.map((g) => (
            <div key={g.label}>
              <p className={label}>{g.label}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.items.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </Reveal>
      )}

      {/* experience: one row per role, like a resume, so each new role just adds a row */}
      {EXPERIENCE.length > 0 && (
      <Reveal variant="scale" className="md:col-span-2">
      <div className={card}>
        <p className={label}>Experience</p>
        <ol className="mt-2 divide-y divide-black/5 dark:divide-white/10">
          {experience.map((x) => (
            <li key={x.role + x.org + x.period} className="grid gap-x-8 gap-y-2 py-5 last:pb-0 md:grid-cols-[13rem_1fr]">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-neutral-600 md:flex-col dark:text-neutral-400">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0" />
                  {x.period}
                </span>
                <span className="inline-flex items-start gap-2">
                  <Briefcase className="mt-0.5 h-4 w-4 shrink-0" />
                  {x.org}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-[-0.01em] text-neutral-950 dark:text-white">{x.role}</h3>
                {x.points.length > 0 && (
                  <ul className="mt-3 max-w-3xl space-y-2">
                    {x.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                        <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
      </div>
      </Reveal>
      )}

      {/* certifications: tiles that reflow from one to three per row as the list grows */}
      {CERTIFICATIONS.length > 0 && (
      <Reveal variant="scale" className="md:col-span-2">
      <div className={card}>
        <p className={label}>{CERTIFICATIONS.length > 1 ? 'Certifications' : 'Certification'}</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
          {certs.map((c) => (
            <li
              key={c.title}
              className="flex flex-col rounded-2xl border border-black/5 bg-neutral-50 p-5 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <Award className="h-5 w-5 text-neutral-500 dark:text-neutral-400" aria-hidden />
              <p className="mt-3 text-[15px] font-medium leading-snug text-neutral-950 dark:text-white">{c.title}</p>
              <p className="mt-1 font-mono text-[12px] leading-snug text-[#666] dark:text-neutral-400">{c.issuer}</p>
              {c.note && <p className="mt-2.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{c.note}</p>}
              {/* pushed to the bottom so buttons line up across a row of tiles */}
              <div className="mt-auto">
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className={certLink}>
                    View certificate
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  c.image && (
                    <button onClick={() => setCert(c)} className={certLink}>
                      View certificate
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  )
                )}
              </div>
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
      </div>
      </Reveal>
      )}

      {/* right now */}
      {NOW.length > 0 && (
      <Reveal variant="scale" className="md:col-span-2">
      <div className={card}>
        <p className={label}>Right now</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {NOW.map((n) => (
            <li key={n} className="flex items-start gap-2.5 text-[15px] text-neutral-700 dark:text-neutral-300">
              <span className="pulse-dot mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              {n}
            </li>
          ))}
        </ul>
      </div>
      </Reveal>
      )}

    </div>
  </div>
  );
};

export default Background;
