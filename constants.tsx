
import React from 'react';
import { 
  Database, 
  Layers, 
  Cpu, 
  Cloud, 
  Server, 
  Globe, 
  Code2, 
  Share2, 
  Zap, 
  Layout, 
  Terminal,
  BookOpen,
  PieChart,
  Grid
} from 'lucide-react';
import { Project, SkillCategory, Service, EducationItem } from './types';

export const SERVICES: Service[] = [
  {
    title: 'Distributed Systems',
    description: 'Building fault-tolerant, scalable architectures using consensus algorithms like Raft and ensuring high availability across nodes.',
    icon: <Database className="w-6 h-6 text-slate-600" />
  },
  {
    title: 'Full-Stack Development',
    description: 'Architecting end-to-end applications with modern frameworks like React, Node.js, and Python, focusing on performance and UX.',
    icon: <Layers className="w-6 h-6 text-slate-600" />
  },
  {
    title: 'AI & Machine Learning',
    description: 'Implementing and optimizing neural networks and computer vision pipelines using PyTorch and TensorFlow for real-world problems.',
    icon: <Cpu className="w-6 h-6 text-slate-600" />
  },
  {
    title: 'Cloud Infrastructure',
    description: 'Containerizing services with Docker and orchestrating complex environments with Kubernetes for seamless deployment and scaling.',
    icon: <Cloud className="w-6 h-6 text-slate-600" />
  },
  {
    title: 'System Design',
    description: 'Designing robust backend systems with a focus on data consistency, low latency, and efficient communication via gRPC and Kafka.',
    icon: <Server className="w-6 h-6 text-slate-600" />
  },
  {
    title: 'API Development',
    description: 'Crafting well-documented, secure, and performant RESTful and GraphQL APIs that serve as the backbone for modern software suites.',
    icon: <Globe className="w-6 h-6 text-slate-600" />
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Core Languages',
    icon: <Terminal className="w-5 h-5 text-slate-500" />,
    skills: ['C/C++', 'RUST', 'GOLANG', 'JAVA', 'PYTHON', 'TYPESCRIPT', 'SQL']
  },
  {
    title: 'Distributed Systems',
    icon: <Share2 className="w-5 h-5 text-slate-500" />,
    skills: ['RAFT CONSENSUS', 'GRPC', 'APACHE KAFKA', 'REDIS', 'ZOOKEEPER', 'ZEROMQ']
  },
  {
    title: 'Cloud & Infrastructure',
    icon: <Cloud className="w-5 h-5 text-slate-500" />,
    skills: ['AWS', 'GCP', 'DOCKER', 'KUBERNETES', 'TERRAFORM', 'CI/CD', 'LINUX KERNEL']
  },
  {
    title: 'AI & Neural Engineering',
    icon: <Zap className="w-5 h-5 text-slate-500" />,
    skills: ['PYTORCH', 'TENSORFLOW', 'LANGCHAIN', 'OPENCV', 'VECTOR DBS', 'CUDA']
  },
  {
    title: 'Database Architecture',
    icon: <Database className="w-5 h-5 text-slate-500" />,
    skills: ['POSTGRESQL', 'MONGODB', 'CASSANDRA', 'ELASTICSEARCH', 'PINECONE', 'ETL']
  },
  {
    title: 'Web & API Systems',
    icon: <Layout className="w-5 h-5 text-slate-500" />,
    skills: ['REACT/NEXT.JS', 'NODE.JS', 'FASTAPI', 'SPRING BOOT', 'GRAPHQL', 'OAUTH2']
  }
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Academic Path Intelligence',
    category: 'CORE ENGINEERING',
    tags: ['PYTHON', 'SCIKIT-LEARN', 'PANDAS', 'REACT'],
    description: 'Implemented a content-based filtering system to architect academic trajectories based on historical performance data and competency profiling. The engine utilizes weighted vector similarity to map user skills to curriculum requirements.',
    icon: <BookOpen className="w-10 h-10 text-slate-500" />,
    githubUrl: '#',
    liveUrl: '#',
    quickView: true
  },
  {
    id: '2',
    title: 'Expense Insight Pro',
    category: 'FULL STACK',
    tags: ['TYPESCRIPT', 'NODE.JS', 'MONGODB', 'DATAVIS'],
    description: 'A financial intelligence suite featuring predictive liquidity forecasting and category-specific budget orchestration. Engineered with a low-latency transactional ledger and dual-axis cash flow visualization.',
    icon: <PieChart className="w-10 h-10 text-slate-500" />,
    githubUrl: '#',
    liveUrl: '#',
    quickView: true
  },
  {
    id: '3',
    title: 'Backtrack Sudoku Visualizer',
    category: 'ALGORITHMS',
    tags: ['ALGORITHMS', 'REACT', 'FRAMER MOTION'],
    description: 'A real-time visualization tool for the Sudoku backtracking algorithm. Features controllable execution speed, state tracking, and a recursive step-by-step breakdown of the solving process.',
    icon: <Grid className="w-10 h-10 text-slate-500" />,
    githubUrl: '#',
    liveUrl: '#',
    quickView: false
  }
];

export const EDUCATION: EducationItem[] = [
  {
    degree: 'B.Tech in Computer Science Engineering',
    institution: 'IILM University Gurugram',
    period: '2025 – 2029',
    location: 'Gurugram, India',
    coursework: ['DSA', 'Operating Systems', 'DBMS', 'Computer Networks', 'OOP', 'Distributed Systems']
  }
];
