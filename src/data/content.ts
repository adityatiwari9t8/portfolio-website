/** Copy for the non-project sections. Edit freely: every list below can grow, and the layout adapts. */

export const HERO = {
  /** Under the giant name: what I am, then my focus in small mono text. (The name itself comes from SITE.) */
  role: 'Software developer',
  focus: 'Backend · Full-stack · Applied AI',
  /** The "// ..." line: how I work, in one sentence. */
  motto: 'I build reliable, scalable software end to end.',
  /**
   * Shown in grey right after the line above. Each sentence adds something the role line does not: who I am,
   * my foundation, what I'm after. About me, never about a specific project, so it stays true as projects change.
   */
  body:
    'From database schema and REST APIs to the interface people use, in Java, Python and TypeScript. CS undergrad at IILM University (CGPA 8.79), grounded in data structures, algorithms and OOP.'
};

export const STORY = {
  lead: "I'm a software developer who likes owning a feature from the database schema to the last pixel.",
  fade: ' I care about correctness, clean APIs and code the next engineer can read without asking me.',
  more:
    "Underneath that are strong CS fundamentals (data structures, algorithms, operating systems, databases and networks) that I keep sharp with regular interview practice. Every project I ship comes with source code and a case study: the design decisions, the trade-offs and what I'd improve next. Right now I'm going deeper into backend systems, concurrency and applied machine learning."
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
  { src: '/story-flowchart.webp', alt: 'A hand-drawn flowchart on paper', position: 'center', caption: 'Design before code', kind: 'photo' }
];

/** "Right now" list in the Background section. Keep it short and current. */
export const NOW = [
  'Building a concurrency-safe booking backend: seat holds, idempotent payments and load tests',
  'Solving data structures and algorithms problems for coding interviews, in Java',
  'Studying system design: caching, queues, replication and sharding'
];

export const EDUCATION = {
  degree: 'B.Tech in Computer Science & Engineering',
  school: 'IILM University, Gurugram',
  period: '2025 to 2029',
  gpa: '8.79 / 10',
  /** Shown as "CS fundamentals" in the education card: what top companies interview on. */
  coursework: ['Data structures & algorithms', 'Object-oriented programming', 'Operating systems', 'Database systems (DBMS)', 'Computer networks']
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
  /** Who issued it, and when if known: "BCG via Forage · Jun 2026". */
  issuer: string;
  /** One line on what it covered. */
  note?: string;
  url?: string;
  image?: { src: string; width: number; height: number };
}

export const CERTIFICATIONS: Certification[] = [
  {
    title: 'Introduction to Financial Engineering and Risk Management',
    issuer: 'Columbia University via Coursera',
    note: 'Quantitative modelling of interest rates, fixed income and option pricing using binomial models.',
    url: 'https://www.coursera.org/account/accomplishments/records/PQPATI9HQWU0'
  },
  {
    title: 'Strategy Consulting Job Simulation',
    issuer: 'BCG via Forage · Jun 2026',
    note: 'Market research, financial modelling, consumer survey design and data analysis for a client case.',
    image: { src: '/certificates/bcg-strategy-consulting.webp', width: 1600, height: 1130 }
  }
];

/**
 * Skills in the Background section, as groups of chips. Add a skill to a group, or add a whole new group
 * (for example { label: 'Cloud', items: [...] }). List only what you can be interviewed on: skills, not every tool you've opened.
 * CS fundamentals are shown with education (EDUCATION.coursework), so they are not repeated here.
 */
export interface SkillGroup {
  label: string;
  items: string[];
}

export const TOOLKIT: SkillGroup[] = [
  { label: 'Backend & data', items: ['Spring Boot', 'Node.js', 'Express', 'REST APIs', 'PostgreSQL'] },
  { label: 'Frontend', items: ['React', 'Tailwind CSS', 'HTML & CSS'] },
  { label: 'DevOps & tools', items: ['Docker', 'Linux', 'Git & GitHub'] }
];

/** Shown as the "open to" list in the Background section. */
export const OPEN_TO = [
  'Software engineering internships',
  'Backend, full-stack or ML-adjacent teams',
  'Remote, hybrid or on-site, anywhere'
];

/** Closing call-to-action. */
export const CTA = {
  before: 'Hiring software engineering interns? Let’s',
  accent: 'talk.',
  after: '',
  body: 'Internship roles, team projects or questions about my work. My resume and code are one click away.'
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

export const CONTACT_OPTIONS = ['Internship or job opportunity', 'Interview or hiring process', 'Project or collaboration', 'Something else'];


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
