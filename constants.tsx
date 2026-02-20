import React from 'react';
import {
  Database,
  Layers,
  Cpu,
  Cloud,
  Server,
  Globe,
  Terminal,
  Share2,
  Zap,
  Layout,
  BookOpen,
  PieChart,
  Grid
} from 'lucide-react';

import { Project, SkillCategory, Service, EducationItem } from './types';

/* =========================================================
   SERVICES
========================================================= */

export const SERVICES: Service[] = [
  {
    title: 'Distributed Systems',
    description:
      'Building scalable and fault-tolerant architectures with strong system design principles.',
    icon: <Database className="w-6 h-6" />
  },
  {
    title: 'Full-Stack Development',
    description:
      'Designing performant web applications with React, Node.js, and modern UX practices.',
    icon: <Layers className="w-6 h-6" />
  },
  {
    title: 'AI & Machine Learning',
    description:
      'Developing intelligent systems using neural networks and applied machine learning.',
    icon: <Cpu className="w-6 h-6" />
  },
  {
    title: 'Cloud Infrastructure',
    description:
      'Containerized deployment pipelines using Docker and scalable cloud environments.',
    icon: <Cloud className="w-6 h-6" />
  },
  {
    title: 'System Design',
    description:
      'Architecting backend systems focused on performance, reliability, and scalability.',
    icon: <Server className="w-6 h-6" />
  },
  {
    title: 'API Development',
    description:
      'Designing secure and efficient REST & GraphQL APIs powering modern applications.',
    icon: <Globe className="w-6 h-6" />
  }
];

/* =========================================================
   SKILLS
========================================================= */

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Core Languages',
    icon: <Terminal className="w-5 h-5" />,
    skills: ['C++', 'Java', 'Python', 'TypeScript', 'SQL']
  },
  {
    title: 'Distributed Systems',
    icon: <Share2 className="w-5 h-5" />,
    skills: ['Raft', 'Kafka', 'Redis', 'gRPC']
  },
  {
    title: 'Cloud & Infrastructure',
    icon: <Cloud className="w-5 h-5" />,
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
  },
  {
    title: 'AI & ML',
    icon: <Zap className="w-5 h-5" />,
    skills: ['PyTorch', 'TensorFlow', 'OpenCV', 'LLMs']
  },
  {
    title: 'Databases',
    icon: <Database className="w-5 h-5" />,
    skills: ['PostgreSQL', 'MongoDB', 'ElasticSearch']
  },
  {
    title: 'Web Systems',
    icon: <Layout className="w-5 h-5" />,
    skills: ['React', 'Next.js', 'Node.js', 'FastAPI']
  }
];

/* =========================================================
   PROJECTS  ⭐ FIXED IMAGE PATHS
========================================================= */

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Academic Path Intelligence',
    category: 'CORE ENGINEERING',
    description:
      'Designed an intelligent curriculum recommendation engine that maps prerequisite dependencies and generates personalized learning roadmaps.',

    imageLight: '/academic-light.png',
    imageDark: '/academic-dark.png'
  },
  {
    id: '2',
    title: 'Expense Insight Pro',
    category: 'FULL STACK',
    description:
      'Financial intelligence dashboard tracking multi-currency transactions with predictive balance forecasting.',

    imageLight: '/expense-light.png',
    imageDark: '/expense-dark.png'
  },
  {
    id: '3',
    title: 'Sudoku Algorithm Visualizer',
    category: 'ALGORITHMS',
    description:
      'Interactive visualization of DFS and backtracking algorithms solving Sudoku in real time.',

    imageLight: '/sudoku-light.png',
    imageDark: '/sudoku-dark.png'
  }
];

/* =========================================================
   EDUCATION
========================================================= */

export const EDUCATION: EducationItem[] = [
  {
    degree: 'B.Tech in Computer Science Engineering',
    institution: 'IILM University Gurugram',
    period: '2025 – 2029',
    location: 'Gurugram, India',
    coursework: [
      'Data Structures',
      'Operating Systems',
      'DBMS',
      'Computer Networks',
      'OOP'
    ]
  }
];