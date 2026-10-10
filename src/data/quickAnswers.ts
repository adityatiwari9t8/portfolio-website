/**
 * The starter questions in the "Ask AI" panel and their instant answers. The answers are written from the
 * same data the page shows, so they stay right as projects, skills or plans change, and they never call the
 * AI (no wait, no quota). The panel labels them "Quick answer" so they are never passed off as AI replies.
 *
 * Keep this file out of api/: the server imports content.ts directly, and this file's imports would
 * not resolve there.
 */
import { SITE } from './site';
import { EDUCATION, NOW, OPEN_TO, TOOLKIT } from './content';
import { PROJECTS } from './projects';

export interface QuickAnswer {
  question: string;
  answer: string;
}

const name = SITE.firstName;
const bullets = (items: readonly string[]) => items.map((i) => `- ${i}`).join('\n');

export const QUICK_ANSWERS: QuickAnswer[] = [
  {
    question: `What is ${name}'s strongest project?`,
    answer:
      PROJECTS.length > 0
        ? `${name} hasn't ranked them, so here is what each one shows:\n${bullets(
            PROJECTS.map((p) => `${p.title}: ${p.description}`)
          )}\nEach has its source code and a case study on this site, so you can judge for yourself.`
        : `${name}'s first case studies are still being built; the Building section on this site shows what is in progress.`
  },
  {
    question: `Which languages and tools does ${name} know?`,
    answer: `From ${name}'s resume:\n${bullets(TOOLKIT.map((g) => `${g.label}: ${g.items.join(', ')}`))}\n- CS fundamentals: ${EDUCATION.coursework.join(', ')}`
  },
  {
    question: `Is ${name} open to internships?`,
    answer: `Yes. ${name} is studying for a ${EDUCATION.degree} at ${EDUCATION.school} (${EDUCATION.period}) and is open to:\n${bullets(
      OPEN_TO
    )}\nFor start dates or anything else, email ${name} at ${SITE.email}.`
  },
  {
    question: `What is ${name} working on right now?`,
    answer: `Right now, ${name} is:\n${bullets(NOW)}`
  }
];
