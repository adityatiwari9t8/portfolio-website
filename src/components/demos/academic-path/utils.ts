import { PathModule, Roadmap, SubjectModel } from './types';
import { SUBJECT_MODELS } from './constants';

const providerFor = (req: string, self: string): SubjectModel | undefined =>
  SUBJECT_MODELS.find((s) => s.name === req) ?? SUBJECT_MODELS.find((s) => s.name !== self && s.triggers.includes(req));

const contributing = new Set<string>(SUBJECT_MODELS.flatMap((s) => [...s.triggers, ...s.requires]));

/**
 * Picked skills point at "focus" subjects. Each focus subject then pulls in whatever it requires:
 * a required skill you already picked is satisfied, one that belongs to another subject brings that
 * subject onto the path first, and one that belongs to no subject is listed as a skill to review.
 * A depth-first walk puts every prerequisite ahead of the subject that needs it.
 */
export const generateRoadmap = (selected: string[]): Roadmap => {
  const sel = new Set(selected);
  const focus = SUBJECT_MODELS.filter((m) => m.triggers.some((t) => sel.has(t)));
  const focusNames = new Set(focus.map((m) => m.name));

  const order: SubjectModel[] = [];
  const done = new Set<string>();
  const visiting = new Set<string>();
  const gaps = new Map<string, string[]>();
  const neededBy = new Map<string, string[]>();

  const visit = (m: SubjectModel) => {
    if (done.has(m.name) || visiting.has(m.name)) return;
    visiting.add(m.name);
    for (const req of m.requires) {
      if (sel.has(req)) continue;
      const p = providerFor(req, m.name);
      if (p) {
        neededBy.set(p.name, [...(neededBy.get(p.name) ?? []), m.name]);
        visit(p);
      } else {
        gaps.set(m.name, [...(gaps.get(m.name) ?? []), req]);
      }
    }
    visiting.delete(m.name);
    done.add(m.name);
    order.push(m);
  };
  focus.forEach(visit);

  const modules: PathModule[] = order.map((m) => ({
    subject: m,
    role: focusNames.has(m.name) ? 'focus' : 'prerequisite',
    because: focusNames.has(m.name) ? m.triggers.filter((t) => sel.has(t)) : Array.from(new Set(neededBy.get(m.name) ?? [])),
    gaps: gaps.get(m.name) ?? [],
    unlocks: SUBJECT_MODELS.filter((s) => s.name !== m.name && s.requires.some((r) => r === m.name || m.triggers.includes(r))).map((s) => s.name)
  }));

  return { modules, unmapped: selected.filter((s) => !contributing.has(s)) };
};

export const phaseLabel = (m: PathModule) =>
  m.role === 'prerequisite' ? 'Prerequisite' : m.subject.level === 'bridge' ? 'Foundation' : m.subject.level === 'advanced' ? 'Advanced track' : 'Core track';

export const pathAsText = (modules: PathModule[]) =>
  modules
    .map((m, i) => {
      const lines = [`${i + 1}. ${m.subject.name} (${phaseLabel(m)})`];
      if (m.gaps.length) lines.push(`   Review first: ${m.gaps.join(', ')}`);
      lines.push(`   ${m.role === 'focus' ? 'Because you picked' : 'Needed by'}: ${m.because.join(', ')}`);
      return lines.join('\n');
    })
    .join('\n');
