/**
 * The starter questions in the "Ask AI" panel and their prepared answers. The answers are written from the
 * same data the page shows, so they stay right as projects, skills or plans change, and they never call the
 * AI (no API request or quota usage). The panel labels them "Quick answer" so they are never passed off as AI replies.
 *
 * Shared by the client and endpoint so predefined questions never consume the AI allowance.
 */
import { SITE } from './site.js';
import { EDUCATION, NOW, OPEN_TO, TOOLKIT } from './content.js';
import { PROJECTS } from './projects.js';

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

/** Typed versions of the starter questions are free too, including case/spacing differences. */
export const getQuickAnswer = (question: string) => {
  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');
  return QUICK_ANSWERS.find((q) => normalize(q.question) === normalize(question))?.answer;
};
