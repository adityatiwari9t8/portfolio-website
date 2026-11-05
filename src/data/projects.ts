/**
 * ADD NEW PROJECTS HERE.
 * Copy one object, change the fields, and it appears as a project card
 * plus its own case-study page at  #/work/<id>.
 *
 *  - demo  : id of a built-in live demo (see components/DemoOverlay.tsx), optional
 *  - live  : link to the deployed app, optional (shows a "Live site" button)
 *  - repo  : link to the GitHub repository, optional (shows a "Source" button)
 *  - year  : shown in the case study, optional
 *  - summary : optional short card description
 *  - featured : full-width lead card for your main project; put it first
 *  - study : the write-up shown on the case-study page (problem / what I built / what I learned)
 *
 * Put screenshots in /public (WebP, 960x600) and reference them by path. A short demo loop
 * (MP4, 960x600, no audio) per theme can go in /public/demo. Visitors can play it in the case study.
 * Only write things that are true and that you can explain in an interview.
 */
export interface CaseStudy {
  /** Optional architecture flow, ordered from input to output. */
  flow?: { title: string; description: string }[];
  /** Real measurements or validation evidence; never fill with illustrative numbers. */
  evidence?: { label: string; detail: string; href?: string }[];
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
  /** Optional concise card copy; the full description remains in the case study. */
  summary?: string;
  /** Give a future main project a full-width card. Place it first in this list. */
  featured?: boolean;
  id: string;
  title: string;
  category: string;
  description: string;
  /** One line telling a visitor the fastest way to see what the project does. */
  tryIt?: string;
  highlights: [{ value: string; label: string }, { value: string; label: string }];
  gradient: string; // tailwind gradient classes (light + dark)
  imageAlt?: string;
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
    id: 'anti-scam-sentinel',
    featured: true,
    title: 'Omni-Channel Anti-Scam Sentinel',
    category: 'Browser security',
    summary: 'I built Sentinel, a Chrome extension that checks calls and email for signs of scams. It analyzes audio, video and text locally and shows risk signals in the browser.',
    description: 'I built the full Sentinel extension, from capturing call media and checking email text to combining detector results and displaying alerts. I also built an offline harness to test how the extension responds to recorded inputs.',
    repo: 'https://github.com/adityatiwari9t8/Omni-Channel-Anti-Scam-Sentinel',
    highlights: [
      { value: 'Local processing', label: 'captured call media is processed in the browser' },
      { value: 'Offline harness', label: 'replays media and exercises pipeline behavior' }
    ],
    gradient: 'from-slate-100 to-white dark:from-neutral-800 dark:to-neutral-900',
    imageLight: '/projects/scam-sentinel.webp', imageDark: '/projects/scam-sentinel.webp',
    imageWidth: 1120, imageHeight: 760, imageAlt: 'Sentinel local validation harness with self-test and notification preview controls',
    study: {
      problem: 'Audio, video and text detectors produce different kinds of evidence. The browser interface needs to distinguish a risk signal from missing input.',
      built: [
        'Built the detection pipeline with shared TypeScript contracts for audio, video and text signals.',
        'Connected the Chrome extension, in-call overlay and offline harness to the decision logic.',
        'Added integration checks and build tooling to exercise the system outside a live call.'
      ],
      learned: 'Missing evidence needs its own state. A detector that has received no fresh input cannot support an all-clear result.',
      limits: ['Live-call detection accuracy has not been validated on a labeled dataset. Risk signals and movement challenges do not establish identity.'],
      ideas: [], stack: ['TypeScript', 'Chrome Manifest V3', 'ONNX Runtime Web', 'MediaPipe']
    }
  },
  {
    id: 'rfid-attendance',
    title: 'Smart Attendance System with RFID',
    category: 'Embedded systems',
    summary: 'Tap a card to record classroom attendance. An ESP32 queues offline scans and sends them to Google Sheets when Wi-Fi returns.',
    description: 'An RFID reader checks each tap against an enrolled roster. The device gives immediate feedback and records the original attendance time, even if the upload has to wait.',
    repo: 'https://github.com/adityatiwari9t8/Smart-Attendance-System-with-RFID',
    highlights: [
      { value: '50 students', label: 'on-device roster capacity' },
      { value: '60 taps', label: 'offline queue capacity' }
    ],
    gradient: 'from-stone-100 to-white dark:from-neutral-800 dark:to-neutral-900',
    imageLight: '/projects/rfid-attendance.webp', imageDark: '/projects/rfid-attendance.webp',
    imageWidth: 1120, imageHeight: 760, imageAlt: 'Wiring diagram connecting the ESP32, RFID reader, OLED, LEDs and buzzer',
    study: {
      problem: 'Classroom attendance needs to survive a network outage without counting the same student twice.',
      built: [
        'Match card identifiers to an enrolled roster and show scan results on the OLED, LEDs and buzzer.',
        'Persist accepted taps to flash and retry uploads with their original timestamps.',
        'Check for same-day duplicates on both the device and the Apps Script endpoint.'
      ],
      learned: 'Recording the tap time separately from the upload time keeps an offline scan on the correct attendance date.',
      limits: ['The device rejects new taps when the offline queue is full. The reader requires compatible 13.56 MHz cards.'],
      ideas: [], stack: ['ESP32', 'Arduino', 'MFRC522', 'Google Apps Script', 'Google Sheets']
    }
  },
  {
    id: 'nutrisync',
    title: 'NutriSync',
    category: 'Recommendation systems',
    summary: 'Scan a pantry, correct the ingredient list, and find recipes that fit both the ingredients on hand and a daily macro target.',
    description: 'A full-stack meal planner connects pantry recognition, recipe ranking and food logging in one workflow.',
    repo: 'https://github.com/adityatiwari9t8/nutrisync',
    highlights: [
      { value: '50 recipes', label: 'seeded with ingredients, macros and instructions' },
      { value: 'Pantry edits', label: 'saved between sessions' }
    ],
    gradient: 'from-emerald-50 to-white dark:from-neutral-800 dark:to-neutral-900',
    imageLight: '/projects/nutrisync.webp', imageDark: '/projects/nutrisync.webp',
    imageWidth: 1120, imageHeight: 760, imageAlt: 'NutriSync sign-in screen explaining the pantry-to-meal workflow',
    study: {
      problem: 'A meal recommendation has to account for what is in the kitchen as well as what the user wants to eat.',
      built: [
        'Accept uploaded photos or camera captures and let users edit and save the detected pantry ingredients.',
        'Combine ingredient overlap and macro fit with content similarity and collaborative filtering to rank recipes.',
        'Log meals, track daily totals, and cache USDA nutrition lookups in Redis.'
      ],
      learned: 'An editable pantry gives users a way to correct a recognition error before it influences the meal rankings.',
      limits: ['Automated ingredient suggestions may need correction. Recommendations depend on the available recipe catalogue.'],
      ideas: [], stack: ['React', 'FastAPI', 'Python', 'SQLAlchemy', 'Redis', 'CLIP']
    }
  },
  {
    id: 'sudoku-visualizer',
    title: 'Sudoku Algorithm Visualizer',
    summary: 'Run four solvers on the same Sudoku board and compare their backtracks. The animation and the benchmark use the same solver code.',
    category: 'Search algorithms',
    description:
      'An interactive view of how search algorithms think. Run DFS, BFS, greedy search, and MRV on the same Sudoku board, then compare the work each strategy performs.',
    tryIt: 'Run all four strategies on one board and compare the steps.',
    highlights: [
      { value: '4 strategies', label: 'DFS, BFS, greedy and MRV' },
      { value: 'One engine', label: 'the animation and the benchmark run the same generator-based solvers' }
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
      flow: [
        { title: 'One starting board', description: 'Validate the puzzle and give each strategy the same starting state.' },
        { title: 'Generator-based solvers', description: 'Yield placements and backtracks so the animation can pause or advance one step.' },
        { title: 'Compare the work', description: 'Run the same solvers without animation to report steps, backtracks and elapsed time.' }
      ],
      problem:
        'Backtracking is easy to describe and hard to picture. I wanted to watch a solver work, and to compare different search strategies on exactly the same board.',
      built: [
        'Playback controls expose every placement and backtrack. Pause, advance one step, or adjust the speed while watching live counters for steps, backtracks, and elapsed time.',
        'A shared engine powers both the animation and the comparison table. Each solver is a JavaScript generator that yields one move at a time, keeping the visual explanation consistent with the measured behavior.',
        'Four strategies: depth-first backtracking, breadth-first search, a greedy solver and backtracking that always picks the cell with the fewest valid options (MRV).',
        'A comparison view runs every strategy on the same board and reports results, steps, backtracks, and time. BFS reports peak queue size instead of backtracks. DFS stops at 1.5 million steps to bound its work.',
        'Three difficulty presets and an editable board make the behavior easy to explore. Conflicts are highlighted before solving; shuffling changes the puzzle while preserving its structure.',
        'BFS stops at 3,000 steps to constrain memory use. A capped run is reported as unsuccessful, never as a solved puzzle.'
      ],
      learned:
        'Choosing the next cell can matter as much as the search itself. On the boards I tested, MRV reduced the steps needed by choosing the most constrained cell first. BFS exposed a different trade-off: retaining a frontier of states makes memory a practical limit.',
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
  },
  {
    id: 'academic-path',
    title: 'Academic Path Intelligence',
    summary: 'Pick the skills you already have. The planner walks a dependency graph to put each prerequisite before the subject that needs it.',
    category: 'Graph algorithms',
    description:
      'Turns the skills you already have into an ordered learning roadmap. Subjects and their prerequisites form a graph, and a depth-first topological sort puts every prerequisite first.',
    tryIt: 'Pick three skills and watch the roadmap reorder itself.',
    highlights: [
      { value: '13 subject models', label: 'each with a level, prerequisites and trigger skills' },
      { value: 'Topological order', label: 'a post-order DFS places every prerequisite ahead of the subject that needs it' }
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
      flow: [
        { title: 'Select existing skills', description: 'Match the selected skills against the subject models and their trigger rules.' },
        { title: 'Resolve prerequisites', description: 'Walk the dependency graph, placing prerequisites first and flagging gaps.' },
        { title: 'Build the roadmap', description: 'Show the ordered subjects, learning resources and reasons for each recommendation.' }
      ],
      problem:
        'Deciding what to study next is hard when you cannot tell which prerequisites you are missing. I wanted a tool that takes the skills you already have and suggests what to learn next, in a sensible order.',
      built: [
        'A plain-data model defines 13 subjects: their level, prerequisites, trigger skills, objectives, and learning resources. Recommendation rules can change independently of the interface.',
        'A rule-based generator: the skills you pick activate subjects, then a post-order depth-first walk (a topological sort) resolves each subject\'s prerequisites, with a visiting set so a circular prerequisite cannot loop forever. A prerequisite that belongs to another subject is pulled onto the path ahead of it, and a required skill with no subject of its own is flagged to review first.',
        'The roadmap updates as skills change. Each subject explains why it appears and what it unlocks; learners can mark progress and copy the path. Unmapped skills are shown explicitly.',
        'A searchable picker, six skill categories, and three example profiles help learners get started. Subject detail views connect the roadmap to courses and documentation.'
      ],
      learned:
        'The hardest part was modelling prerequisites clearly. Skills and subjects are different kinds of requirements; treating them alike created checks that could never pass. Resolving each requirement as a skill, a subject, or a gap made the rules easier to explain and maintain.',
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
    summary: 'Add a transaction to see how it changes your running balance. A least-squares fit shows how the balance would move if the same trend continued.',
    category: 'Data & statistics',
    description:
      'A personal-finance dashboard that connects transaction history to an illustrative 30-day balance trend. The least-squares regression is implemented from scratch, with the quality of its fit visible alongside the result.',
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
      flow: [
        { title: 'Record transactions', description: 'Store income and expenses in the browser, using fixed rates for currency conversion.' },
        { title: 'Calculate the balance', description: 'Build a running balance from the transaction history and group spending by category.' },
        { title: 'Fit a trend line', description: 'Use least-squares regression to draw an illustrative 30-day trend and report the fit.' }
      ],
      problem:
        'A running balance tells you where you are, not where you are heading. I wanted a small dashboard that records transactions and shows the trend of the balance, with a forecast a month ahead.',
      built: [
        'Transaction entry supports income and expenses, seven categories, search, filters, and undo after deletion. Data stays in the browser.',
        'Recharts visualizes the running balance after each transaction, alongside a category breakdown and a summary of the last 30 days.',
        'A least-squares model fits the balance history and projects its trend 30 days ahead. Every edit recalculates the line, slope, and R² so the strength of the fit stays visible.',
        'Five display currencies share a USD storage model. Conversion uses fixed rates, and sample transactions make the demo immediately explorable.'
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
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe Pro',
    category: 'Browser games',
    summary: 'Two players share a board, take turns, and keep score across rounds. The game highlights the winning line or records a draw.',
    description: 'A local two-player browser game built with HTML, CSS and JavaScript. Move validation, win detection and scoring run entirely in the page.',
    repo: 'https://github.com/adityatiwari9t8/TicTacToe',
    highlights: [
      { value: '8 winning lines', label: 'three rows, three columns and two diagonals' },
      { value: '2 players', label: 'take turns on the same device' }
    ],
    gradient: 'from-slate-100 to-white dark:from-neutral-800 dark:to-neutral-900',
    imageLight: '/projects/tic-tac-toe.webp', imageDark: '/projects/tic-tac-toe.webp',
    imageWidth: 1120, imageHeight: 760, imageAlt: 'Tic Tac Toe Pro during a round with X in two corners and O in the centre',
    study: {
      problem: 'Each move should advance the turn exactly once, and a finished round should stop accepting moves.',
      built: [
        'Track occupied cells and compare each board state against the eight winning lines.',
        'Highlight a win, detect a full-board draw, and update the scoreboard.',
        'Reset the board independently of the session scores so the same players can start another round.'
      ],
      learned: 'Round state and score state have different lifetimes. Separating them makes a rematch straightforward.',
      limits: ['Players share one device. Scores last for the current page session.'],
      ideas: [], stack: ['JavaScript', 'HTML', 'CSS']
    }
  }
];
