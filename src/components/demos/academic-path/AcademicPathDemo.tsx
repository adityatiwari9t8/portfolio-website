import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, Check, ClipboardCopy, ExternalLink, Filter, Search, Sparkles, X
} from 'lucide-react';

import { PathModule } from './types';
import { COLOR_THEMES, EXAMPLES, GAP_RESOURCES, SKILL_CATEGORIES } from './constants';
import { generateRoadmap, pathAsText, phaseLabel } from './utils';
import { useDialog } from '../../../lib/useDialog';

const eyebrow = 'text-[11px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400';

export default function AcademicPathDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [done, setDone] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<PathModule | null>(null);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialog(!!detail, () => setDetail(null), dialogRef);

  const roadmap = useMemo(() => generateRoadmap(selected), [selected]);
  const { modules, unmapped } = roadmap;
  const doneCount = modules.filter((m) => done.has(m.subject.name)).length;

  const categories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SKILL_CATEGORIES;
    return SKILL_CATEGORIES.map((c) => ({ ...c, skills: c.skills.filter((s) => s.toLowerCase().includes(q)) })).filter((c) => c.skills.length);
  }, [query]);

  const toggle = (skill: string) =>
    setSelected((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));

  const toggleDone = (name: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pathAsText(modules));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const liveDetail = detail ? modules.find((m) => m.subject.name === detail.subject.name) ?? detail : null;

  return (
    <div className={`mx-auto max-w-7xl space-y-8 px-4 py-6 md:px-8 md:py-10 ${selected.length ? 'pb-24 lg:pb-10' : ''}`}>
      <header className="mx-auto max-w-3xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" /> Rule-based roadmap generator
        </div>
        <h1 className="text-3xl font-medium leading-tight tracking-[-0.03em] text-neutral-900 dark:text-white md:text-5xl">
          Academic Path <span className="accent text-[1.1em]">Intelligence</span>
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 md:text-base">
          Pick the technologies you know or want to build on. The path updates as you go, with every prerequisite placed ahead of the subject that needs it.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Try an example:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => setSelected(ex.skills)}
            className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:border-indigo-400 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-200"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_26rem]">
        {/* Skill picker */}
        <section className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900 md:p-7">
          <div className="mb-6 flex flex-col gap-4 border-b border-black/5 pb-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
              <Filter className="h-5 w-5 text-indigo-500" /> Your skills
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{selected.length ? `· ${selected.length} picked` : ''}</span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search skills"
                  aria-label="Search skills"
                  className="w-full rounded-xl border border-black/10 bg-neutral-50 py-2.5 pl-9 pr-9 text-sm text-neutral-900 outline-none transition-colors focus:border-indigo-500 dark:border-white/10 dark:bg-neutral-950 dark:text-white"
                />
                {query && (
                  <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {selected.length > 0 && (
                <button onClick={() => setSelected([])} className="whitespace-nowrap rounded-xl px-3 py-2.5 text-xs font-semibold text-neutral-500 transition-colors hover:text-rose-600 dark:text-neutral-400 dark:hover:text-rose-400">
                  Clear all
                </button>
              )}
            </div>
          </div>

          {categories.length === 0 ? (
            <p className="py-16 text-center text-sm text-neutral-500 dark:text-neutral-400">No skills match “{query}”.</p>
          ) : (
            <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-3">
                  <h3 className={`${eyebrow} border-b border-black/5 pb-2 dark:border-white/10`}>{cat.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => {
                      const on = selected.includes(skill);
                      return (
                        <button
                          key={skill}
                          aria-pressed={on}
                          onClick={() => toggle(skill)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                            on
                              ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                              : 'border-black/10 bg-white text-neutral-600 hover:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300'
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Live path */}
        <aside ref={panelRef} className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900 lg:sticky lg:top-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Your path</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {modules.length ? `${modules.length} subjects, in study order` : 'Nothing yet'}
              </p>
            </div>
            {modules.length > 0 && (
              <button
                onClick={copy}
                className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:border-indigo-400 dark:border-white/10 dark:text-neutral-300"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          {modules.length > 0 && (
            <div className="mb-5 space-y-1.5">
              <div className="flex justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                <span>Progress</span>
                <span>{doneCount} of {modules.length} done</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${(doneCount / modules.length) * 100}%` }} />
              </div>
            </div>
          )}

          {selected.length === 0 && (
            <p className="rounded-xl bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-500 dark:bg-white/5 dark:text-neutral-400">
              Pick a few skills, or try an example above. Each subject on the path shows why it is there and what it unlocks.
            </p>
          )}

          {selected.length > 0 && modules.length === 0 && (
            <p className="rounded-xl bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-500 dark:bg-white/5 dark:text-neutral-400">
              None of these picks point at one of the 13 subject areas yet. Add a programming language, a CS fundamental or an AI topic to get a path.
            </p>
          )}

          <ol className="space-y-3">
            {modules.map((m, i) => {
              const theme = COLOR_THEMES[m.subject.color] ?? COLOR_THEMES.slate;
              const isDone = done.has(m.subject.name);
              return (
                <li key={m.subject.name} className="relative flex gap-3">
                  {i < modules.length - 1 && <span aria-hidden className="absolute left-[15px] top-9 h-[calc(100%-1.5rem)] w-px bg-black/10 dark:bg-white/10" />}
                  <button
                    onClick={() => toggleDone(m.subject.name)}
                    aria-pressed={isDone}
                    aria-label={`${isDone ? 'Unmark' : 'Mark'} ${m.subject.name} as done`}
                    className={`relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                      isDone ? 'border-emerald-500 bg-emerald-500 text-white' : `${theme.border} ${theme.lightBg} ${theme.text}`
                    }`}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : i + 1}
                  </button>
                  <div className={`min-w-0 flex-1 rounded-xl border p-3.5 ${theme.border} ${isDone ? 'opacity-60' : ''}`}>
                    <p className={`text-[10px] font-semibold uppercase tracking-widest ${theme.text}`}>{phaseLabel(m)}</p>
                    <h3 className={`mt-1 text-sm font-semibold leading-snug text-neutral-900 dark:text-white ${isDone ? 'line-through' : ''}`}>{m.subject.name}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {m.role === 'focus' ? 'Because you picked ' : 'Needed by '}
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{m.because.join(', ')}</span>
                    </p>
                    {m.gaps.length > 0 && (
                      <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Review first:
                        {m.gaps.map((g) => (
                          <span key={g} className="rounded-md bg-amber-100 px-2 py-0.5 font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">{g}</span>
                        ))}
                      </p>
                    )}
                    <button onClick={() => setDetail(m)} className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold ${theme.text} hover:underline`}>
                      Details <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>

          {unmapped.length > 0 && modules.length > 0 && (
            <p className="mt-4 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Not linked to a subject yet: {unmapped.join(', ')}.
            </p>
          )}
        </aside>
      </div>

      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 p-3 lg:hidden">
          <button
            onClick={() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="mx-auto flex w-full max-w-md items-center justify-between rounded-2xl bg-neutral-950 px-5 py-3.5 text-sm font-semibold text-white shadow-xl dark:bg-white dark:text-neutral-950"
          >
            <span>{selected.length} picked · {modules.length} subjects</span>
            <span className="flex items-center gap-1.5">View path <ArrowDown className="h-4 w-4" /></span>
          </button>
        </div>
      )}

      {liveDetail && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm" onClick={() => setDetail(null)} />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="path-detail-title"
            tabIndex={-1}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl outline-none dark:border-white/10 dark:bg-neutral-900"
          >
            <div className={`h-1.5 w-full shrink-0 ${COLOR_THEMES[liveDetail.subject.color]?.bg ?? 'bg-neutral-500'}`} />
            <div className="custom-scrollbar space-y-6 overflow-y-auto p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <p className={`text-[11px] font-semibold uppercase tracking-widest ${COLOR_THEMES[liveDetail.subject.color]?.text ?? 'text-neutral-500'}`}>{phaseLabel(liveDetail)}</p>
                  <h2 id="path-detail-title" className="text-2xl font-medium leading-tight tracking-[-0.02em] text-neutral-900 dark:text-white md:text-3xl">{liveDetail.subject.name}</h2>
                  <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{liveDetail.subject.summary}</p>
                </div>
                <button data-autofocus onClick={() => setDetail(null)} aria-label="Close" className="shrink-0 rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className={eyebrow}>What you should be able to do</h3>
                <ul className="space-y-2 rounded-xl bg-neutral-50 p-4 dark:bg-white/5">
                  {liveDetail.subject.objectives.map((o) => (
                    <li key={o} className="flex gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" /> {o}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className={eyebrow}>Key topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {liveDetail.subject.topics.map((t) => (
                      <span key={t} className="rounded-lg border border-black/10 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:border-white/10 dark:text-neutral-300">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className={eyebrow}>Where to learn it</h3>
                  <ul className="space-y-2">
                    {[...liveDetail.gaps.map((g) => GAP_RESOURCES[g]).filter(Boolean), ...liveDetail.subject.resources].map((r) => (
                      <li key={r.url}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-3 rounded-xl border border-black/10 p-3 transition-colors hover:border-indigo-400 dark:border-white/10"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-neutral-800 dark:text-neutral-100">{r.title}</span>
                            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{r.kind}</span>
                          </span>
                          <ExternalLink className="h-4 w-4 shrink-0 text-neutral-400 transition-colors group-hover:text-indigo-500" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {liveDetail.unlocks.length > 0 && (
                <div className="space-y-2">
                  <h3 className={eyebrow}>Unlocks</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">{liveDetail.unlocks.join(' · ')}</p>
                </div>
              )}
            </div>
            <div className="flex shrink-0 justify-end border-t border-black/5 p-4 dark:border-white/10">
              <button
                onClick={() => toggleDone(liveDetail.subject.name)}
                className="flex items-center gap-2 rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                {done.has(liveDetail.subject.name) ? (<><Check className="h-4 w-4" /> Marked as done</>) : 'Mark as done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
