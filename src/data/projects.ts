/**
 * ADD NEW PROJECTS HERE.
 * Copy one object, change the fields, and it appears as a new stacked card
 * plus its own case-study page at  #/work/<id>.
 *
 *  - demo  : id of a built-in live demo (see components/DemoOverlay.tsx), optional
 *  - live  : link to the deployed app, optional (shows a "Live site" button)
 *  - repo  : link to the GitHub repository, optional (shows a "Source" button)
 *  - year  : shown in the card header, optional
 *  - study : the write-up shown on the case-study page (problem / what I built / what I learned)
 *
 * Put screenshots in /public (WebP, 960x600) and reference them by path. A short demo loop
 * (MP4, 960x600, no audio) per theme can go in /public/demo and plays when the card is hovered.
 * Only write things that are true and that you can explain in an interview.
 */
export interface CaseStudy {
  problem: string;
  built: string[];
  learned: string;
  /** Honest limits of the project. Shown on the case-study page. */
  limits: string[];
  /** Things I could add next. Phrase as possibilities, never as promises. */
  ideas: string[];
  stack: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  /** One line telling a visitor the fastest way to see what the project does. */
  tryIt?: string;
  highlights: [{ value: string; label: string }, { value: string; label: string }];
  gradient: string; // tailwind gradient classes (light + dark)
  imageLight: string;
  imageDark: string;
  imageWidth: number;
  imageHeight: number;
  /** Short screen recording of the demo (MP4 in /public/demo), one per theme. Optional. */
  videoLight?: string;
  videoDark?: string;
  study: CaseStudy;
  year?: string;
  /** id of a built-in embedded demo (see components/DemoOverlay.tsx). Optional: most projects use `live` instead. */
  demo?: string;
  live?: string;
  repo?: string;
  /** Marks a concept / practice piece so it is never mistaken for client work. */
  sample?: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: 'academic-path',
    title: 'Academic Path Intelligence',
    category: 'Web app',
    description:
      'A recommendation tool that turns the skills you already have into a short, ordered learning roadmap, closing prerequisite gaps first.',
    tryIt: 'Pick three skills and watch the roadmap reorder itself.',
    highlights: [
      { value: '13 subject models', label: 'each with a level, prerequisites and trigger skills' },
      { value: 'Prerequisites first', label: 'every prerequisite is placed ahead of the subject that needs it' }
    ],
    gradient: 'from-violet-100 via-fuchsia-50 to-white dark:from-[#21163a] dark:via-[#171128] dark:to-[#0f0b1a]',
    imageLight: '/academic-light.webp',
    imageDark: '/academic-dark.webp',
    imageWidth: 960,
    imageHeight: 600,
    videoLight: '/demo/academic-light.mp4',
    videoDark: '/demo/academic-dark.mp4',
    demo: 'academic-path',
    repo: 'https://github.com/adityatiwari9t8/academic-path-intelligence',
    study: {
      problem:
        'Deciding what to study next is hard when you cannot tell which prerequisites you are missing. I wanted a tool that takes the skills you already have and suggests what to learn next, in a sensible order.',
      built: [
        'A data model of 13 subject areas. Each has a level (bridge, core or advanced), the prerequisites it needs, the skills that trigger it, and its own objectives, topics and learning resources.',
        'A rule-based generator: the skills you pick activate subjects, then a depth-first walk resolves each subject\'s prerequisites. A prerequisite that belongs to another subject is pulled onto the path ahead of it, and a required skill with no subject of its own is flagged to review first.',
        'The path updates live as you pick skills. It shows why each subject is there and what it unlocks, lets you tick subjects off, and can be copied as text. Picks that map to no subject are listed instead of silently ignored.',
        'A searchable skill picker grouped into six categories, three example profiles, and a detail view for each subject with objectives, key topics and links to real courses and documentation.'
      ],
      learned:
        'Keeping the rules as plain data (subjects, prerequisites, triggers) and the interface separate meant I could change the recommendations without touching a component. Mixing skills and subject names in one prerequisite list made some checks impossible to satisfy, until I resolved each requirement as a skill, a subject or a gap. It is a rule-based system, not machine learning, and the prerequisite check is deliberately simple.',
      limits: [
        'It is a rule-based system I wrote by hand, not machine learning. The recommendations are only as good as the 13 subject models behind them.',
        'A skill that belongs to none of the 13 subjects is listed as not mapped instead of being guessed at.',
        'The learning resources are links I picked by hand. They are not checked automatically, so some may move or go out of date.'
      ],
      ideas: [
        'Let a skill be marked as "know well" or "just starting", so the path can skip what is already solid.',
        'Add more subject areas, and a printable version of the path.'
      ],
      stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'lucide-react']
    }
  },
  {
    id: 'expense-pro',
    title: 'Expense Insight Pro',
    category: 'Dashboard',
    description:
      'A finance dashboard that tracks income and expenses in five currencies and forecasts the balance 30 days ahead with a simple trend line.',
    tryIt: 'Add a transaction and watch the 30-day forecast move.',
    highlights: [
      { value: '5 currencies', label: 'USD, EUR, GBP, INR and JPY' },
      { value: '30-day forecast', label: 'least-squares trend over the balance history' }
    ],
    gradient: 'from-amber-100 via-orange-50 to-white dark:from-[#33230f] dark:via-[#241809] dark:to-[#171006]',
    imageLight: '/expense-light.webp',
    imageDark: '/expense-dark.webp',
    imageWidth: 960,
    imageHeight: 600,
    videoLight: '/demo/expense-light.mp4',
    videoDark: '/demo/expense-dark.mp4',
    demo: 'expense-pro',
    repo: 'https://github.com/adityatiwari9t8/expense-insight-pro',
    study: {
      problem:
        'A running balance tells you where you are, not where you are heading. I wanted a small dashboard that records transactions and shows the trend of the balance, with a forecast a month ahead.',
      built: [
        'Add, edit and delete transactions (with undo), classified as income or expense, across seven categories with search and a filter for each. Entries are saved in the browser only.',
        'A balance-history chart drawn with Recharts that plots the running balance after every transaction, plus a spending-by-category breakdown and a last-30-days summary.',
        'A forecast: a least-squares line fitted to the balance history and projected 30 days ahead, drawn as a trend and a forecast point on the chart. It updates as soon as a transaction changes and shows its slope and R², so you can see how good the fit is.',
        'A currency switcher for USD, EUR, GBP, INR and JPY. Amounts are entered in the selected currency and stored in USD. The exchange rates are fixed values in the code, not live rates, and the demo starts from sample data.'
      ],
      learned:
        'Writing the regression by hand (slope and intercept from sums) instead of reaching for a library made it clear how little data it takes to draw a misleading line. The forecast is a straight-line trend, not a financial prediction.',
      limits: [
        'Exchange rates are fixed numbers in the code, not live rates, so converted amounts are illustrative.',
        'Everything is stored in the browser only. There are no accounts and no syncing between devices.',
        'The forecast is a straight line through the balance history. With few transactions the fit is weak (the R² shown says so), and it is not financial advice.'
      ],
      ideas: [
        'Fetch live exchange rates, falling back to the fixed ones when offline.',
        'Recurring transactions, a monthly budget per category, and CSV import and export.'
      ],
      stack: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Vite']
    }
  },
  {
    id: 'sudoku-visualizer',
    title: 'Sudoku Algorithm Visualizer',
    category: 'Algorithms',
    description:
      'Watch four different strategies solve the same Sudoku step by step, then compare how many steps and backtracks each one needed.',
    tryIt: 'Run all four strategies on one board and compare the steps.',
    highlights: [
      { value: '4 strategies', label: 'DFS, BFS, greedy and MRV' },
      { value: '3 difficulty presets', label: 'easy, medium and hard boards, shuffled each time' }
    ],
    gradient: 'from-sky-100 via-indigo-50 to-white dark:from-[#0f1f33] dark:via-[#0b1626] dark:to-[#0a101a]',
    imageLight: '/sudoku-light.webp',
    imageDark: '/sudoku-dark.webp',
    imageWidth: 960,
    imageHeight: 600,
    videoLight: '/demo/sudoku-light.mp4',
    videoDark: '/demo/sudoku-dark.mp4',
    demo: 'sudoku-visualizer',
    repo: 'https://github.com/adityatiwari9t8/sudoku-algorithm-visualizer',
    study: {
      problem:
        'Backtracking is easy to describe and hard to picture. I wanted to watch a solver work, and to compare different search strategies on exactly the same board.',
      built: [
        'An animated solver with pause, single-step and a speed control from about one move a second to thousands. It shows each placement and each backtrack, with live counters for steps, backtracks and time.',
        'Four strategies: depth-first backtracking, breadth-first search, a greedy solver and backtracking that always picks the cell with the fewest valid options (MRV).',
        'A comparison table that runs all four strategies on the same starting board and reports the result, steps, backtracks (peak queue for BFS) and time for each, with notes generated from those numbers. Plain DFS is capped at 1.5 million steps so a hard board cannot freeze the page.',
        'Three preset boards (easy, medium, hard), and a board you can type or clear yourself, with conflicts highlighted before a solve. A shuffle relabels digits and swaps rows and columns inside their bands, so every board is a new puzzle with the same structure.',
        'Breadth-first search is capped at 3,000 steps so it cannot exhaust memory, and is reported as failed when it hits that cap.'
      ],
      learned:
        'The same backtracking code can get cheaper just by choosing the next cell differently: on the boards I tried, always picking the most constrained cell (MRV) needed fewer steps than plain depth-first order. Breadth-first search, by contrast, runs out of room on hard boards.',
      limits: [
        'The step counts come from the boards in the demo, so the comparison shows how the strategies behave on these puzzles, not a general benchmark.',
        'Plain depth-first search stops at 1.5 million steps and breadth-first search at 3,000, and both are reported as capped or failed when they hit that limit.',
        'The greedy solver never undoes a move, so it can get stuck on a board the other strategies solve.'
      ],
      ideas: [
        'Add a strategy that fills in forced cells first (constraint propagation) and compare it against MRV.',
        'Explain, in words, why the solver chose each cell as it goes.'
      ],
      stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'lucide-react']
    }
  }
];
