/** Copy for the non-project sections. Edit freely: every list below can grow, and the layout adapts. */
import { PROJECTS } from './projects';

export const HERO = {
  /** Small line above the headline, so the name is the first thing a visitor reads. */
  intro: "Hi, I'm Aditya Tiwari",
  headline: ['Software that', 'works,', 'from idea to live demo.'] as const,
  /** Two sentences at most: the hero is meant to be read in five seconds. */
  body:
    'B.Tech CSE student at IILM University, Gurugram. I build web apps, dashboards and algorithm visualizers, and every project below has a live demo you can open right here.'
};

export const STORY = {
  lead:
    "Most of what I build starts with a question I couldn't answer just by looking.",
  fade:
    ' Which prerequisite am I missing? Where is my balance heading? Why is one search strategy faster than another?',
  more:
    "Each project turns one of those questions into something you can click: a learning roadmap, a 30-day balance forecast, a side-by-side solver race. I like small, complete things, and I write down what each one can't do yet."
};

/**
 * The two Polaroids in "My story". A `shot` is a project screenshot shown in colour.
 * To use a second real photo: drop it in /public and change `src` (and set kind: 'photo').
 */
export interface StoryPhoto {
  src: string;
  alt: string;
  position: string;
  caption: string;
  kind: 'photo' | 'shot';
}
export const STORY_PHOTOS: [StoryPhoto] | [StoryPhoto, StoryPhoto] = [
  { src: '/story-notes.webp', alt: 'An open notebook, glasses and a pen in front of a screen of code', position: 'center', caption: 'Learning by building', kind: 'photo' },
  { src: '/story-flowchart.webp', alt: 'A hand-drawn flowchart on paper', position: 'center', caption: 'Questions into logic', kind: 'photo' }
];

/** "Right now" list in the Background section. Keep it short and current. */
export const NOW = [
  'Adding new projects to this portfolio',
  'Practising data structures and algorithms on LeetCode'
];

export const EDUCATION = {
  degree: 'B.Tech in Computer Science & Engineering',
  school: 'IILM University, Gurugram',
  period: '2025 to 2029',
  gpa: '8.8 / 10',
  coursework: ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'OOP']
};

/**
 * Work experience in the Background section, newest first. Only roles that really happened.
 * Add as many as you like: the first three show, the rest sit behind a "Show all" button.
 */
export interface Experience {
  role: string;
  org: string;
  period: string;
  points: string[];
}

export const EXPERIENCE: Experience[] = [
  {
    role: 'Market Research Intern',
    org: 'SEMS Welfare Foundation, Noida',
    period: 'Jun to Jul 2026',
    points: [
      'Researched cognitive bias and dual-process theory in strategic procurement decisions from secondary sources, and wrote a research synopsis with APA-cited references.',
      'Wrote a 23-page internship report aligned to UN SDG 8 (Decent Work and Economic Growth).'
    ]
  }
];

/**
 * Certificates in the Background section, newest or most relevant first. The first six show, the rest sit behind "Show all".
 * `url` opens a verification page in a new tab; `image` (a file in /public/certificates) opens in a viewer on the page.
 * Give a certificate one or the other, or neither (then it has no button).
 */
export interface Certification {
  title: string;
  issuer: string;
  url?: string;
  image?: { src: string; width: number; height: number };
}

export const CERTIFICATIONS: Certification[] = [
  {
    title: 'Introduction to Financial Engineering and Risk Management',
    issuer: 'Columbia University, on Coursera',
    url: 'https://www.coursera.org/account/accomplishments/records/PQPATI9HQWU0'
  },
  {
    title: 'BCG Strategy Consulting Job Simulation',
    issuer: 'Forage, June 2026. Market research, financial modelling, survey design and data analysis',
    image: { src: '/certificates/bcg-strategy-consulting.webp', width: 1600, height: 1130 }
  }
];

/**
 * Skills in the Background section, as groups of chips. Add a skill to a group, or add a whole new group
 * (for example { label: 'Tools', items: [...] }). Skills that appear in a project's `stack` get a marker automatically.
 */
export interface SkillGroup {
  label: string;
  items: string[];
}

export const TOOLKIT: SkillGroup[] = [
  { label: 'Core languages', items: ['Python', 'Java', 'JavaScript', 'C', 'TypeScript'] },
  { label: 'I build with', items: ['HTML & CSS', 'React', 'Tailwind CSS', 'Vite', 'Git & GitHub'] }
];

/** Shown as the "open to" list in the Background section. */
export const OPEN_TO = [
  'Software and web-development internships',
  'Remote, hybrid or on-site, anywhere',
  'Team projects and collaborations'
];

/** Closing call-to-action. */
export const CTA = {
  before: 'Got an internship or project? Let’s',
  accent: 'talk.',
  after: '',
  body: 'Internship, team opportunity or collaboration, I’d love to hear about it. My resume and code are one click away.'
};

/** Text on the closing card of every case-study page. */
export const CASE_CTA = {
  title: 'Want to talk about this project?',
  body: 'I’m happy to walk through the code, the trade-offs or what I’d do next.'
};

/** Optional faster ways to reach me (shown next to the main button when present). */
export interface QuickContact {
  label: string;
  href: string;
  kind: 'call' | 'chat';
}
export const QUICK_CONTACT: QuickContact[] = [];

export const CONTACT_OPTIONS = ['Internship or job opportunity', 'Collaboration', 'Something else'];

/**
 * Quick facts shown right under the hero, for a ten-second scan. Kept to things the hero does not already say.
 * The project count and latest role update themselves from PROJECTS and EXPERIENCE. Best with four cards.
 */
const withDemo = PROJECTS.filter((p) => p.demo || p.live).length;
const latest = EXPERIENCE[0];

export const GLANCE: { key: 'role' | 'grad' | 'build' | 'exp'; label: string; value: string }[] = [
  {
    key: 'role',
    label: 'Projects',
    value:
      withDemo === PROJECTS.length
        ? `${PROJECTS.length} built, each with a live demo`
        : `${PROJECTS.length} built, ${withDemo} with a live demo`
  },
  { key: 'grad', label: 'Academics', value: `CGPA ${EDUCATION.gpa}` },
  { key: 'build', label: 'Built with', value: 'React, TypeScript, Tailwind' },
  ...(latest
    ? [{ key: 'exp' as const, label: 'Experience', value: `${latest.role}, ${latest.org.split(',')[0]}` }]
    : [])
];

/**
 * Shown in the "building" section while PROJECTS is empty. Update `status` as work moves along;
 * the section disappears once the first case study is added to projects.ts.
 * Keep `aims` to what the project is designed to do, never claims about results that do not exist yet.
 */
export const BUILDING = [
  {
    id: 'seatlock',
    icon: 'ticket',
    kind: 'Backend and systems',
    title: 'SeatLock',
    status: 'In progress',
    summary: 'A ticket-booking platform where two people can never buy the same seat, even when many try at once.',
    aims: ['Seat holds that expire', 'Idempotent checkout and payment webhooks', 'Concurrency tests and published load-test results']
  },
  {
    id: 'tinytensor',
    icon: 'cpu',
    kind: 'Machine learning from scratch',
    title: 'TinyTensor',
    status: 'Up next',
    summary: 'A small PyTorch-style library in pure Python and NumPy, with automatic differentiation built from first principles.',
    aims: ['Reverse-mode autodiff on tensors', 'Layers and optimisers', 'Gradients checked against PyTorch']
  },
  {
    id: 'citerag',
    icon: 'search',
    kind: 'Applied AI',
    title: 'CiteRAG',
    status: 'Up next',
    summary: 'Question answering over a document set that always cites its sources and says "I don\'t know" when evidence is weak.',
    aims: ['Cited answers', 'Reproducible evaluation harness', 'Retrieval quality and latency measured per design choice']
  }
] as const;
