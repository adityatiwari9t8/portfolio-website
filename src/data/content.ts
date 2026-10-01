/** Copy for the non-project sections. Edit freely. */

export const HERO = {
  headline: ['Software that', 'works,', 'from idea to live demo.'] as const,
  body:
    "Computer Science student at IILM University. I've built a skill-path recommender, a multi-currency expense dashboard with a 30-day forecast, and a Sudoku solver that compares four search strategies. Each one has a live demo you can open right here.",
  /** Phrases typed after "I build" in the hero. Only things that are true. */
  typed: ['web apps', 'dashboards', 'algorithm visualizers', 'data-driven tools'] as const,
  facts: ['B.Tech CSE, IILM University', 'Batch of 2029', 'Based in Gurugram, India'],
  /** One plain sentence under the buttons: exactly what a recruiter wants to know. */
  lookingFor: 'Looking for a software or web-development internship, open to remote, hybrid or on-site roles anywhere.'
};

/** Scrolling strip under the hero (stands in for the client-logo strip in the reference). */
export const STRIP = [
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Vite',
  'Python',
  'Java',
  'JavaScript',
  'C',
  'HTML & CSS',
  'Data Structures',
  'Algorithms',
  'Responsive Design'
];

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
  { src: '/img.webp', alt: 'Portrait of Aditya', position: 'center 20%', caption: 'Hi, I’m Aditya', kind: 'photo' },
  { src: '/story.webp', alt: 'Second portrait of Aditya', position: 'center 25%', caption: 'Learning by building', kind: 'photo' }
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

export const TOOLKIT = {
  core: ['Python', 'Java', 'JavaScript', 'C', 'TypeScript'],
  build: ['HTML & CSS', 'React', 'Tailwind CSS', 'Vite', 'Git & GitHub']
};

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

/** Four quick facts shown right under the hero, for a ten-second scan. Kept to things the hero does not already say. */
export const GLANCE = [
  { key: 'role', label: 'Projects', value: '3 built, each with a live demo' },
  { key: 'grad', label: 'Academics', value: 'CGPA 8.8 / 10' },
  { key: 'build', label: 'Built with', value: 'React, TypeScript, Tailwind' },
  { key: 'stack', label: 'Languages', value: 'Python, Java, JavaScript, C, TypeScript' }
] as const;

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
