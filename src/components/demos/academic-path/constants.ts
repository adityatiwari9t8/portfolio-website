import { Resource, SkillCategory, SubjectModel } from './types';

export const COLOR_THEMES: Record<string, { bg: string; hover: string; text: string; lightBg: string; border: string }> = {
  green: { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', text: 'text-emerald-600 dark:text-emerald-400', lightBg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800' },
  indigo: { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600', text: 'text-indigo-600 dark:text-indigo-400', lightBg: 'bg-indigo-50 dark:bg-indigo-900/30', border: 'border-indigo-200 dark:border-indigo-800' },
  blue: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', text: 'text-blue-600 dark:text-blue-400', lightBg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800' },
  yellow: { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', text: 'text-yellow-600 dark:text-yellow-400', lightBg: 'bg-yellow-50 dark:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-800' },
  purple: { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', text: 'text-purple-600 dark:text-purple-400', lightBg: 'bg-purple-50 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800' },
  pink: { bg: 'bg-pink-500', hover: 'hover:bg-pink-600', text: 'text-pink-600 dark:text-pink-400', lightBg: 'bg-pink-50 dark:bg-pink-900/30', border: 'border-pink-200 dark:border-pink-800' },
  cyan: { bg: 'bg-cyan-500', hover: 'hover:bg-cyan-600', text: 'text-cyan-600 dark:text-cyan-400', lightBg: 'bg-cyan-50 dark:bg-cyan-900/30', border: 'border-cyan-200 dark:border-cyan-800' },
  emerald: { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', text: 'text-emerald-600 dark:text-emerald-400', lightBg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800' },
  orange: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', text: 'text-orange-600 dark:text-orange-400', lightBg: 'bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800' },
  red: { bg: 'bg-rose-500', hover: 'hover:bg-rose-600', text: 'text-rose-600 dark:text-rose-400', lightBg: 'bg-rose-50 dark:bg-rose-900/30', border: 'border-rose-200 dark:border-rose-800' },
  violet: { bg: 'bg-violet-500', hover: 'hover:bg-violet-600', text: 'text-violet-600 dark:text-violet-400', lightBg: 'bg-violet-50 dark:bg-violet-900/30', border: 'border-violet-200 dark:border-violet-800' },
  sky: { bg: 'bg-sky-500', hover: 'hover:bg-sky-600', text: 'text-sky-600 dark:text-sky-400', lightBg: 'bg-sky-50 dark:bg-sky-900/30', border: 'border-sky-200 dark:border-sky-800' },
  slate: { bg: 'bg-neutral-600', hover: 'hover:bg-neutral-700', text: 'text-neutral-600 dark:text-neutral-400', lightBg: 'bg-neutral-100 dark:bg-neutral-800', border: 'border-neutral-300 dark:border-neutral-700' },
};

export const SUBJECT_MODELS: SubjectModel[] = [
  {
    name: 'Programming Foundations',
    level: 'bridge',
    requires: [],
    triggers: ['Python', 'C++', 'Java', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Haskell', 'OOP'],
    color: 'green',
    summary: 'Variables, control flow, functions and data structures in one language, plus the habit of reading errors and documentation.',
    objectives: ['Write and debug small programs from scratch', 'Break a problem into functions you can test on their own', 'Read error messages and documentation without help'],
    topics: ['Control flow', 'Functions and recursion', 'Collections', 'File I/O', 'Debugging', 'Testing basics'],
    resources: [
      { title: 'CS50x: Introduction to Computer Science', url: 'https://cs50.harvard.edu/x/', kind: 'Course' },
      { title: 'The Python Tutorial', url: 'https://docs.python.org/3/tutorial/', kind: 'Docs' }
    ]
  },
  {
    name: 'Frontend Engineering Foundations',
    level: 'core',
    requires: ['Web Basics (HTML/CSS)'],
    triggers: ['Web Basics (HTML/CSS)', 'JavaScript', 'TypeScript'],
    color: 'indigo',
    summary: 'How browsers render pages, and how to build interactive interfaces that stay maintainable as they grow.',
    objectives: ['Build a responsive page without a framework', 'Explain the event loop and write async code with confidence', 'Split a UI into components with clear ownership of state'],
    topics: ['Semantic HTML', 'CSS layout (flexbox and grid)', 'The DOM and events', 'Async JavaScript', 'Component-based UI', 'Accessibility basics'],
    resources: [
      { title: 'MDN: Learn web development', url: 'https://developer.mozilla.org/en-US/docs/Learn', kind: 'Docs' },
      { title: 'The Modern JavaScript Tutorial', url: 'https://javascript.info/', kind: 'Tutorial' }
    ]
  },
  {
    name: 'Backend & API Development',
    level: 'core',
    requires: ['Programming Foundations'],
    triggers: ['REST API Design', 'GraphQL', 'SQL', 'Unit Testing'],
    color: 'blue',
    summary: 'Designing services that accept requests, check them, store data safely and fail in ways clients can understand.',
    objectives: ['Design a small REST API with consistent errors', 'Store and query data without trusting user input', 'Explain how sessions and tokens differ'],
    topics: ['HTTP and REST', 'Routing and middleware', 'Authentication', 'Validation', 'Persistence with SQL', 'Testing endpoints'],
    resources: [
      { title: 'roadmap.sh: Backend developer', url: 'https://roadmap.sh/backend', kind: 'Roadmap' },
      { title: 'MDN: HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', kind: 'Docs' }
    ]
  },
  {
    name: 'Algorithms & Data Structures',
    level: 'bridge',
    requires: [],
    triggers: ['Data Structures', 'Algorithms', 'Discrete Mathematics'],
    color: 'yellow',
    summary: 'Choosing the right structure for a problem and reasoning about how its cost grows with the input.',
    objectives: ['Analyse the time and space cost of a solution', 'Pick a structure that fits the access pattern', 'Solve medium-difficulty problems in a fixed time'],
    topics: ['Arrays and hashing', 'Stacks, queues and linked lists', 'Trees and graphs', 'Sorting and searching', 'Dynamic programming', 'Big-O analysis'],
    resources: [
      { title: 'MIT 6.006: Introduction to Algorithms', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/', kind: 'Course' },
      { title: 'VisuAlgo', url: 'https://visualgo.net/en', kind: 'Visualiser' }
    ]
  },
  {
    name: 'Operating Systems & Concurrency',
    level: 'core',
    requires: ['Data Structures'],
    triggers: ['Operating Systems', 'Computer Architecture'],
    color: 'purple',
    summary: 'What the machine does underneath your program: processes, memory, scheduling and the hazards of sharing state.',
    objectives: ['Explain how a process differs from a thread', 'Reason about race conditions and deadlock', 'Describe how virtual memory and the file system work'],
    topics: ['Processes and threads', 'Scheduling', 'Virtual memory', 'Synchronisation', 'File systems', 'I/O'],
    resources: [
      { title: 'Operating Systems: Three Easy Pieces', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', kind: 'Book' },
      { title: 'The Missing Semester of Your CS Education', url: 'https://missing.csail.mit.edu/', kind: 'Course' }
    ]
  },
  {
    name: 'Computer Networks & Distributed Thinking',
    level: 'core',
    requires: ['Operating Systems'],
    triggers: ['Computer Networks', 'Kafka', 'gRPC'],
    color: 'pink',
    summary: 'How machines talk to each other, and why anything spread over a network has to expect delay and failure.',
    objectives: ['Trace a request from browser to server and back', 'Compare TCP and UDP and say when each fits', 'Explain why distributed systems trade consistency for availability'],
    topics: ['Layered network model', 'TCP and UDP', 'DNS and HTTP', 'Sockets', 'Replication and consistency', 'Message queues'],
    resources: [
      { title: "Beej's Guide to Network Programming", url: 'https://beej.us/guide/bgnet/', kind: 'Book' },
      { title: 'Cloudflare Learning Center', url: 'https://www.cloudflare.com/learning/', kind: 'Articles' }
    ]
  },
  {
    name: 'Database Systems & Modeling',
    level: 'core',
    requires: [],
    triggers: ['Database Systems', 'SQL', 'Redis'],
    color: 'cyan',
    summary: 'Modelling data so it stays consistent, and understanding what a query costs before you run it.',
    objectives: ['Design a normalised schema for a small domain', 'Write joins and aggregates, and read a query plan', 'Explain what a transaction guarantees'],
    topics: ['Relational modelling', 'SQL queries and joins', 'Indexes', 'Transactions and ACID', 'Normalisation', 'Caching'],
    resources: [
      { title: 'CMU 15-445: Database Systems', url: 'https://15445.courses.cs.cmu.edu/', kind: 'Course' },
      { title: 'PostgreSQL tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html', kind: 'Docs' }
    ]
  },
  {
    name: 'Probability & Statistical Reasoning',
    level: 'bridge',
    requires: [],
    triggers: ['Probability', 'Statistics', 'Information Theory'],
    color: 'emerald',
    summary: 'Thinking clearly about uncertainty, which is the footing that machine learning stands on.',
    objectives: ['Use conditional probability and Bayes\' rule', 'Describe common distributions and when they appear', 'Run and interpret a simple hypothesis test'],
    topics: ['Random variables', 'Conditional probability', 'Distributions', 'Expectation and variance', 'Sampling and estimation', 'Hypothesis testing'],
    resources: [
      { title: 'Harvard Stat 110: Probability', url: 'https://projects.iq.harvard.edu/stat110', kind: 'Course' },
      { title: 'Seeing Theory', url: 'https://seeing-theory.brown.edu/', kind: 'Visualiser' }
    ]
  },
  {
    name: 'Machine Learning Foundations',
    level: 'core',
    requires: ['Linear Algebra', 'Probability'],
    triggers: ['Scikit-Learn', 'Reinforcement Learning', 'Multivariable Calculus', 'Numerical Methods', 'Optimization Theory'],
    color: 'orange',
    summary: 'Learning a function from data, and knowing when a model has learned something versus memorised the training set.',
    objectives: ['Fit and evaluate a regression and a classifier', 'Explain bias, variance and overfitting', 'Split data properly and pick a metric that matches the goal'],
    topics: ['Supervised and unsupervised learning', 'Linear and logistic regression', 'Bias and variance', 'Train, validation and test splits', 'Evaluation metrics', 'Regularisation'],
    resources: [
      { title: 'scikit-learn user guide', url: 'https://scikit-learn.org/stable/user_guide.html', kind: 'Docs' },
      { title: 'Stanford CS229: Machine Learning', url: 'https://cs229.stanford.edu/', kind: 'Course' }
    ]
  },
  {
    name: 'Deep Learning & Representation',
    level: 'advanced',
    requires: ['Machine Learning Foundations'],
    triggers: ['Neural Networks', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Computer Vision'],
    color: 'red',
    summary: 'Training layered models end to end, and how they learn useful representations rather than hand-built features.',
    objectives: ['Train a small network and diagnose a run that is not learning', 'Explain backpropagation and what an optimiser does', 'Choose between convolutional and sequence architectures'],
    topics: ['Backpropagation', 'Optimisers', 'Convolutional networks', 'Sequence models', 'Embeddings', 'Training diagnostics'],
    resources: [
      { title: 'Dive into Deep Learning', url: 'https://d2l.ai/', kind: 'Book' },
      { title: 'fast.ai: Practical Deep Learning', url: 'https://course.fast.ai/', kind: 'Course' }
    ]
  },
  {
    name: 'LLMs & Generative Systems',
    level: 'advanced',
    requires: ['Deep Learning & Representation'],
    triggers: ['Generative AI', 'LLMs', 'NLP'],
    color: 'violet',
    summary: 'How language models are built and adapted, and how to put one inside a system without trusting it blindly.',
    objectives: ['Explain tokenisation and attention in a transformer', 'Compare prompting, retrieval and fine-tuning for a task', 'Design an evaluation for a model-backed feature'],
    topics: ['Tokenisation', 'Transformers and attention', 'Pretraining and fine-tuning', 'Prompting and retrieval', 'Evaluation', 'Safety and failure modes'],
    resources: [
      { title: 'Neural Networks: Zero to Hero', url: 'https://karpathy.ai/zero-to-hero.html', kind: 'Course' },
      { title: 'Hugging Face Learn', url: 'https://huggingface.co/learn', kind: 'Courses' }
    ]
  },
  {
    name: 'Cloud-Native & DevOps',
    level: 'core',
    requires: ['Operating Systems'],
    triggers: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Git', 'Linux/Unix', 'Google Cloud'],
    color: 'sky',
    summary: 'Packaging software so it runs the same everywhere, and shipping it through automated, repeatable pipelines.',
    objectives: ['Containerise an application and run it locally', 'Set up a pipeline that tests and deploys on every merge', 'Describe infrastructure as code rather than clicking through a console'],
    topics: ['Containers', 'Images and registries', 'Orchestration', 'CI/CD pipelines', 'Infrastructure as code', 'Monitoring'],
    resources: [
      { title: 'Docker: Get started', url: 'https://docs.docker.com/get-started/', kind: 'Docs' },
      { title: 'Kubernetes tutorials', url: 'https://kubernetes.io/docs/tutorials/', kind: 'Docs' }
    ]
  },
  {
    name: 'Scalable System Design',
    level: 'advanced',
    requires: ['Algorithms', 'Operating Systems'],
    triggers: ['System Design', 'Microservices'],
    color: 'slate',
    summary: 'Putting the parts together so a service keeps working as traffic, data and the team grow.',
    objectives: ['Sketch a design from requirements and estimate its load', 'Explain the trade-offs between caching, sharding and replication', 'Identify the single points of failure in a design'],
    topics: ['Load balancing', 'Caching', 'Sharding and replication', 'Queues and async work', 'Rate limiting', 'Consistency trade-offs'],
    resources: [
      { title: 'The System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', kind: 'Guide' },
      { title: 'Google SRE Book', url: 'https://sre.google/sre-book/table-of-contents/', kind: 'Book' }
    ]
  }
];

/** Prerequisite skills that have no subject of their own: where to go to close the gap. */
export const GAP_RESOURCES: Record<string, Resource> = {
  'Linear Algebra': { title: '3Blue1Brown: Essence of linear algebra', url: 'https://www.3blue1brown.com/topics/linear-algebra', kind: 'Videos' },
  'Web Basics (HTML/CSS)': { title: 'MDN: Structuring the web with HTML', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', kind: 'Docs' }
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  { name: 'Programming Languages', skills: ['Python', 'C++', 'Java', 'Rust', 'Go', 'TypeScript', 'JavaScript', 'SQL', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Haskell'] },
  { name: 'CS Fundamentals', skills: ['Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks', 'Database Systems', 'OOP', 'Discrete Mathematics', 'Computer Architecture'] },
  { name: 'Mathematics', skills: ['Linear Algebra', 'Multivariable Calculus', 'Statistics', 'Probability', 'Numerical Methods', 'Optimization Theory', 'Information Theory'] },
  { name: 'AI & Machine Learning', skills: ['Neural Networks', 'Deep Learning', 'Computer Vision', 'NLP', 'Reinforcement Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Generative AI', 'LLMs'] },
  { name: 'DevOps & Systems', skills: ['Docker', 'Kubernetes', 'Git', 'CI/CD', 'AWS', 'Google Cloud', 'Terraform', 'Linux/Unix', 'gRPC', 'Kafka', 'Redis'] },
  { name: 'Software Engineering', skills: ['System Design', 'Agile Methodology', 'Microservices', 'GraphQL', 'REST API Design', 'Unit Testing', 'Web Basics (HTML/CSS)'] }
];

export const EXAMPLES: { label: string; skills: string[] }[] = [
  { label: 'Self-taught web developer', skills: ['JavaScript', 'TypeScript', 'Web Basics (HTML/CSS)', 'Git', 'REST API Design'] },
  { label: 'Aspiring ML engineer', skills: ['Python', 'Statistics', 'Neural Networks', 'PyTorch'] },
  { label: 'Backend to infrastructure', skills: ['Java', 'SQL', 'Docker', 'System Design'] }
];
