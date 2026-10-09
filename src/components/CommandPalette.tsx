import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, BookOpen, Copy, CornerDownLeft, FileText, Github, Hash, Linkedin, Mail, Moon, Play, Search, Sun } from 'lucide-react';
import { PROJECTS, Project } from '../data/projects';
import { SITE } from '../data/site';
import { useDialog } from '../lib/useDialog';
import { scrollToSection } from '../lib/scroll';
import { toggleTheme, useTheme } from '../lib/theme';
import { studyHref } from '../lib/route';
import { SECTIONS } from '../lib/sections';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onOpenContact: () => void;
  onOpenDemo: (p: Project) => void;
}

interface Item {
  id: string;
  group: 'Navigate' | 'Projects' | 'Actions' | 'Elsewhere';
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
}

/** ⌘K / Ctrl+K menu: jump to any section, open a demo or case study, grab the resume or email. */
const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose, onOpenContact, onOpenDemo }) => {
  const root = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { dark } = useTheme();
  useDialog(open, onClose, root);

  useEffect(() => {
    if (open) {
      setQuery('');
      setIndex(0);
      setCopied(false);
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const ext = (url: string) => () => window.open(url, '_blank', 'noopener,noreferrer');
    return [
      ...SECTIONS.map<Item>((n) => ({ id: `nav-${n.id}`, group: 'Navigate', label: n.label, icon: Hash, run: () => scrollToSection(n.id) })),
      ...PROJECTS.flatMap<Item>((p) => [
        ...(p.demo ? [{ id: `demo-${p.id}`, group: 'Projects' as const, label: `${p.title}`, hint: 'Live demo', icon: Play, run: () => onOpenDemo(p) }] : []),
        { id: `study-${p.id}`, group: 'Projects', label: `${p.title}`, hint: 'Case study', icon: BookOpen, run: () => (window.location.hash = studyHref(p.id)) }
      ]),
      { id: 'resume', group: 'Actions', label: 'Open resume (PDF)', icon: FileText, run: ext(SITE.resume) },
      { id: 'contact', group: 'Actions', label: 'Send a message', icon: Mail, run: onOpenContact },
      {
        id: 'copy',
        group: 'Actions',
        label: 'Copy email address',
        hint: SITE.email,
        icon: Copy,
        run: () => {
          navigator.clipboard?.writeText(SITE.email).catch(() => undefined);
          setCopied(true);
        }
      },
      { id: 'theme', group: 'Actions', label: dark ? 'Switch to light mode' : 'Switch to dark mode', icon: dark ? Sun : Moon, run: () => toggleTheme() },
      { id: 'gh', group: 'Elsewhere', label: 'GitHub', icon: Github, run: ext(SITE.socials.github) },
      { id: 'li', group: 'Elsewhere', label: 'LinkedIn', icon: Linkedin, run: ext(SITE.socials.linkedin) }
    ];
  }, [dark, onOpenContact, onOpenDemo]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.label} ${i.hint ?? ''} ${i.group}`.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => setIndex(0), [query]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-i="${index}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  if (!open) return null;

  const choose = (item: Item | undefined) => {
    if (!item) return;
    // Copying keeps the menu open long enough to confirm; everything else closes it first.
    if (item.id === 'copy') {
      item.run();
      window.setTimeout(onClose, 700);
      return;
    }
    onClose();
    // Let the dialog unlock scrolling and return focus before acting.
    window.setTimeout(item.run, 0);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[index]);
    }
  };

  let lastGroup = '';
  return createPortal(
    <div
      ref={root}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Command menu"
      className="fixed inset-0 z-[120] flex items-start justify-center p-3 pt-[12vh] outline-none sm:p-4 sm:pt-[14vh]"
    >
      <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fade-up relative w-full max-w-lg overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] dark:border-white/10 dark:bg-neutral-900">
        <div className="flex items-center gap-3 border-b border-black/5 px-4 dark:border-white/10">
          <Search className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
          <input
            data-autofocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search sections, projects, actions…"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-activedescendant={results[index] ? `cmdk-${results[index].id}` : undefined}
            aria-autocomplete="list"
            className="h-14 w-full bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-white"
          />
          <kbd className="hidden rounded-md border border-black/10 px-1.5 py-0.5 font-sans text-[11px] text-neutral-500 sm:block dark:border-white/15 dark:text-neutral-400">
            Esc
          </kbd>
        </div>

        <ul ref={listRef} id="cmdk-list" role="listbox" aria-label="Commands" className="custom-scrollbar max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-neutral-500">Nothing matches “{query}”.</li>}
          {results.map((item, i) => {
            const header = item.group !== lastGroup;
            lastGroup = item.group;
            const Icon = item.icon;
            const on = i === index;
            return (
              <React.Fragment key={item.id}>
                {header && (
                  <li role="presentation" className="px-3 pb-1 pt-3 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500 first:pt-1 dark:text-neutral-400">
                    {item.group}
                  </li>
                )}
                <li
                  id={`cmdk-${item.id}`}
                  data-i={i}
                  role="option"
                  aria-selected={on}
                  onMouseMove={() => setIndex(i)}
                  onClick={() => choose(item)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                    on ? 'bg-neutral-100 text-neutral-950 dark:bg-white/10 dark:text-white' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
                  <span className="min-w-0 flex-1 truncate font-medium">{item.label}</span>
                  {item.id === 'copy' && copied ? (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Copied</span>
                  ) : (
                    item.hint && <span className="shrink-0 truncate text-xs text-neutral-500 dark:text-neutral-400">{item.hint}</span>
                  )}
                  {on && (item.group === 'Elsewhere' || item.id === 'resume' ? <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-neutral-400" /> : <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-neutral-400" />)}
                </li>
              </React.Fragment>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 border-t border-black/5 px-4 py-2.5 text-[11px] text-neutral-500 dark:border-white/10 dark:text-neutral-400">
          <span>
            <kbd className="font-sans">↑</kbd> <kbd className="font-sans">↓</kbd> to move
          </span>
          <span>
            <kbd className="font-sans">↵</kbd> to open
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CommandPalette;
