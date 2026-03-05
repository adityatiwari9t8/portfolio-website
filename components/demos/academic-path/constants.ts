import { SubjectModel, SkillCategory } from './types';

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
  slate: { bg: 'bg-slate-600', hover: 'hover:bg-slate-700', text: 'text-slate-600 dark:text-slate-400', lightBg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-300 dark:border-slate-700' },
};

export const SUBJECT_MODELS: SubjectModel[] = [
  { name: 'Programming Foundations', level: 'bridge', requires: [], triggers: ['Python', 'C++', 'Java', 'JavaScript', 'TypeScript', 'Go', 'Rust'], color: 'green' },
  { name: 'Frontend Engineering Foundations', level: 'core', requires: ['Web Basics (HTML/CSS)'], triggers: ['Web Basics (HTML/CSS)', 'JavaScript', 'TypeScript'], color: 'indigo' },
  { name: 'Backend & API Development', level: 'core', requires: ['Programming Foundations'], triggers: ['REST API Design', 'GraphQL', 'SQL'], color: 'blue' },
  { name: 'Algorithms & Data Structures', level: 'bridge', requires: [], triggers: ['Data Structures', 'Algorithms'], color: 'yellow' },
  { name: 'Operating Systems & Concurrency', level: 'core', requires: ['Data Structures'], triggers: ['Operating Systems', 'Computer Architecture'], color: 'purple' },
  { name: 'Computer Networks & Distributed Thinking', level: 'core', requires: ['Operating Systems'], triggers: ['Computer Networks', 'Kafka', 'gRPC'], color: 'pink' },
  { name: 'Database Systems & Modeling', level: 'core', requires: [], triggers: ['Database Systems', 'SQL', 'Redis'], color: 'cyan' },
  { name: 'Probability & Statistical Reasoning', level: 'bridge', requires: [], triggers: ['Probability', 'Statistics', 'Information Theory'], color: 'emerald' },
  { name: 'Machine Learning Foundations', level: 'core', requires: ['Linear Algebra', 'Probability'], triggers: ['Scikit-Learn', 'Reinforcement Learning'], color: 'orange' },
  { name: 'Deep Learning & Representation', level: 'advanced', requires: ['Machine Learning Foundations'], triggers: ['Neural Networks', 'Deep Learning', 'PyTorch', 'TensorFlow'], color: 'red' },
  { name: 'LLMs & Generative Systems', level: 'advanced', requires: ['Deep Learning & Representation'], triggers: ['Generative AI', 'LLMs', 'NLP'], color: 'violet' },
  { name: 'Cloud-Native & DevOps', level: 'core', requires: ['Operating Systems'], triggers: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD'], color: 'sky' },
  { name: 'Scalable System Design', level: 'advanced', requires: ['Algorithms', 'Operating Systems'], triggers: ['System Design', 'Microservices'], color: 'slate' }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  { name: 'Programming Languages', skills: ['Python', 'C++', 'Java', 'Rust', 'Go', 'TypeScript', 'JavaScript', 'SQL', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Haskell'] },
  { name: 'CS Fundamentals', skills: ['Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks', 'Database Systems', 'OOP', 'Discrete Mathematics', 'Computer Architecture'] },
  { name: 'Mathematics', skills: ['Linear Algebra', 'Multivariable Calculus', 'Statistics', 'Probability', 'Numerical Methods', 'Optimization Theory', 'Information Theory'] },
  { name: 'AI & Machine Learning', skills: ['Neural Networks', 'Deep Learning', 'Computer Vision', 'NLP', 'Reinforcement Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Generative AI', 'LLMs'] },
  { name: 'DevOps & Systems', skills: ['Docker', 'Kubernetes', 'Git', 'CI/CD', 'AWS', 'Google Cloud', 'Terraform', 'Linux/Unix', 'gRPC', 'Kafka', 'Redis'] },
  { name: 'Software Engineering', skills: ['System Design', 'Agile Methodology', 'Microservices', 'GraphQL', 'REST API Design', 'Unit Testing', 'Web Basics (HTML/CSS)'] }
];