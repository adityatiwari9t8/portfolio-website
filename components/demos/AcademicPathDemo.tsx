
import React, { useState, useMemo } from 'react';
import { Search, Sparkles, BookOpen, CheckCircle2, RotateCcw, Filter, X, ExternalLink, ArrowRight, Target, Library } from 'lucide-react';

interface RoadmapModule {
  phase: string;
  subject: string;
  effort: string;
  color: string;
  desc: string;
  details: {
    objectives: string[];
    topics: string[];
    resources: string[];
  };
}

/* Default modules shown when no roadmap is generated */
const defaultModules: RoadmapModule[] = [
  {
    phase: 'Bridge Phase',
    subject: 'Programming Foundations',
    effort: 'High',
    color: 'green',
    desc: 'Brush up on foundational programming skills.',
    details: {
      objectives: ['Understand core programming concepts'],
      topics: ['Programming Foundations'],
      resources: ['MIT OpenCourseWare', 'CS50']
    }
  },
  {
    phase: 'Core Track',
    subject: 'Frontend Engineering Foundations',
    effort: 'Critical',
    color: 'indigo',
    desc: 'Solidify web fundamentals and modern frontend tooling.',
    details: {
      objectives: ['Build interactive UIs'],
      topics: ['HTML/CSS', 'JavaScript', 'TypeScript'],
      resources: ['Frontend Masters', 'MDN']
    }
  },
  {
    phase: 'Core Track',
    subject: 'Backend & API Development',
    effort: 'Critical',
    color: 'blue',
    desc: 'Learn server-side development and API design.',
    details: {
      objectives: ['Design robust APIs'],
      topics: ['REST API Design', 'SQL'],
      resources: ['Coursera', 'System Design Primer']
    }
  }
];

/* ================= SUBJECT INTELLIGENCE ================= */

interface SubjectModel {
  name: string;
  level: 'bridge' | 'core' | 'advanced';
  requires: string[];
  triggers: string[];
  color: string;
}

const SUBJECT_MODELS: SubjectModel[] = [
  /* ---------- Programming ---------- */
  {
    name: 'Programming Foundations',
    level: 'bridge',
    requires: [],
    triggers: ['Python', 'C++', 'Java', 'JavaScript', 'TypeScript', 'Go', 'Rust'],
    color: 'green'
  },

  /* ---------- Frontend ---------- */
  {
    name: 'Frontend Engineering Foundations',
    level: 'core',
    requires: ['Web Basics (HTML/CSS)'],
    triggers: ['Web Basics (HTML/CSS)', 'JavaScript', 'TypeScript'],
    color: 'indigo'
  },

  /* ---------- Backend & APIs ---------- */
  {
    name: 'Backend & API Development',
    level: 'core',
    requires: ['Programming Foundations'],
    triggers: ['REST API Design', 'GraphQL', 'SQL'],
    color: 'blue'
  },

  /* ---------- Data Structures ---------- */
  {
    name: 'Algorithms & Data Structures Foundations',
    level: 'bridge',
    requires: [],
    triggers: ['Data Structures', 'Algorithms'],
    color: 'yellow'
  },

  /* ---------- Systems ---------- */
  {
    name: 'Operating Systems & Concurrency',
    level: 'core',
    requires: ['Data Structures'],
    triggers: ['Operating Systems', 'Computer Architecture'],
    color: 'purple'
  },
  {
    name: 'Computer Networks & Distributed Thinking',
    level: 'core',
    requires: ['Operating Systems'],
    triggers: ['Computer Networks', 'Kafka', 'gRPC'],
    color: 'pink'
  },

  /* ---------- Databases ---------- */
  {
    name: 'Database Systems & Data Modeling',
    level: 'core',
    requires: [],
    triggers: ['Database Systems', 'SQL', 'Redis'],
    color: 'cyan'
  },

  /* ---------- Mathematics ---------- */
  {
    name: 'Probability & Statistical Reasoning',
    level: 'bridge',
    requires: [],
    triggers: ['Probability', 'Statistics', 'Information Theory'],
    color: 'emerald'
  },

  /* ---------- ML / AI ---------- */
  {
    name: 'Machine Learning Foundations',
    level: 'core',
    requires: ['Linear Algebra', 'Probability'],
    triggers: ['Scikit-Learn', 'Reinforcement Learning'],
    color: 'orange'
  },
  {
    name: 'Deep Learning & Representation Learning',
    level: 'advanced',
    requires: ['Machine Learning Foundations'],
    triggers: ['Neural Networks', 'Deep Learning', 'PyTorch', 'TensorFlow'],
    color: 'red'
  },
  {
    name: 'LLMs & Generative Systems',
    level: 'advanced',
    requires: ['Deep Learning & Representation Learning'],
    triggers: ['Generative AI', 'LLMs', 'NLP'],
    color: 'violet'
  },

  /* ---------- DevOps ---------- */
  {
    name: 'Cloud-Native & DevOps Engineering',
    level: 'core',
    requires: ['Operating Systems'],
    triggers: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
    color: 'sky'
  },

  /* ---------- System Design ---------- */
  {
    name: 'Scalable System Design',
    level: 'advanced',
    requires: ['Algorithms', 'Operating Systems'],
    triggers: ['System Design', 'Microservices'],
    color: 'slate'
  }
];

const missingFrom = (have: string[], need: string[]) =>
  need.filter(n => !have.includes(n));

/* ================= COMPONENT ================= */

const AcademicPathDemo: React.FC = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailModule, setActiveDetailModule] = useState<RoadmapModule | null>(null);
  const [roadmapModulesState, setRoadmapModulesState] = useState<RoadmapModule[]>([]);

  const skillCategories = useMemo(() => [
    {
      name: 'Programming Languages',
      skills: ['Python', 'C++', 'Java', 'Rust', 'Go', 'TypeScript', 'JavaScript', 'SQL', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Haskell']
    },
    {
      name: 'CS Fundamentals',
      skills: ['Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks', 'Database Systems', 'OOP', 'Discrete Mathematics', 'Computer Architecture']
    },
    {
      name: 'Mathematics',
      skills: ['Linear Algebra', 'Multivariable Calculus', 'Statistics', 'Probability', 'Numerical Methods', 'Optimization Theory', 'Information Theory']
    },
    {
      name: 'AI & Machine Learning',
      skills: ['Neural Networks', 'Deep Learning', 'Computer Vision', 'NLP', 'Reinforcement Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Generative AI', 'LLMs']
    },
    {
      name: 'DevOps & Systems',
      skills: ['Docker', 'Kubernetes', 'Git', 'CI/CD', 'AWS', 'Google Cloud', 'Terraform', 'Linux/Unix', 'gRPC', 'Kafka', 'Redis']
    },
    {
      name: 'Software Engineering',
      skills: ['System Design', 'Agile Methodology', 'Microservices', 'GraphQL', 'REST API Design', 'Unit Testing', 'Web Basics (HTML/CSS)']
    }
  ], []);

  const generateRoadmap = (sel: string[]): RoadmapModule[] => {
    if (!sel.length) return [];

    const activated = SUBJECT_MODELS.filter(m =>
      m.triggers.some(t => sel.includes(t))
    );

    const modules: RoadmapModule[] = [];

    activated.forEach(model => {
      const missing = missingFrom(sel, model.requires);

      if (missing.length > 0) {
        modules.push({
          phase: 'Bridge Phase',
          subject: `Foundations for ${model.name}`,
          effort: 'High',
          color: model.color,
          desc: 'Strengthen prerequisites before progressing.',
          details: {
            objectives: ['Close conceptual gaps'],
            topics: missing,
            resources: ['MIT OpenCourseWare', 'Coursera Foundations']
          }
        });
      } else {
        modules.push({
          phase: model.level === 'advanced' ? 'Advanced Track' : 'Core Track',
          subject: model.name,
          effort: model.level === 'advanced' ? 'Advanced' : 'Critical',
          color: model.color,
          desc: 'Next logical step based on your current skill profile.',
          details: {
            objectives: [`Master ${model.name}`],
            topics: model.triggers,
            resources: ['Top University Courses', 'Industry Playbooks']
          }
        });
      }
    });

    return Array.from(
      new Map(modules.map(m => [m.subject, m])).values()
    ).slice(0, 3);
  };

  const allSkills = useMemo(() => skillCategories.flatMap(c => c.skills), [skillCategories]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return skillCategories;
    return skillCategories.map(cat => ({
      ...cat,
      skills: cat.skills.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    })).filter(cat => cat.skills.length > 0);
  }, [searchQuery, skillCategories]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowResult(false);
    setTimeout(() => {
      setRoadmapModulesState(generateRoadmap(selectedSkills));
      setIsGenerating(false);
      setShowResult(true);
    }, 1200);
  };

  const reset = () => {
    setSelectedSkills([]);
    setShowResult(false);
    setSearchQuery('');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-16 px-4 md:px-6 space-y-8 md:space-y-12">
      {/* Detail Modal */}
      {activeDetailModule && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveDetailModule(null)} />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className={`h-2 w-full bg-${activeDetailModule.color}-500`} />
            <div className="p-8 md:p-10 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest text-${activeDetailModule.color}-500`}>{activeDetailModule.phase}</span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{activeDetailModule.subject}</h2>
                </div>
                <button onClick={() => setActiveDetailModule(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="flex items-center space-x-2 text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span>Learning Objectives</span>
                  </h4>
                  <ul className="space-y-3">
                    {activeDetailModule.details.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start space-x-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        <ArrowRight className="w-4 h-4 text-slate-300 mt-1 shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="flex items-center space-x-2 text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      <Filter className="w-4 h-4 text-indigo-500" />
                      <span>Key Topics</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeDetailModule.details.topics.map((topic, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded text-[11px] font-bold">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="flex items-center space-x-2 text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      <Library className="w-4 h-4 text-purple-500" />
                      <span>Resources</span>
                    </h4>
                    <ul className="space-y-2">
                      {activeDetailModule.details.resources.map((res, i) => (
                        <li key={i} className="flex items-center justify-between text-[11px] font-bold text-slate-400 hover:text-blue-500 transition-colors cursor-pointer group">
                          <span className="truncate mr-2">{res}</span>
                          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActiveDetailModule(null)}
                className={`w-full py-4 bg-${activeDetailModule.color}-500 hover:bg-${activeDetailModule.color}-600 text-white font-bold rounded-xl shadow-lg transition-all`}
              >
                Enroll in Module
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
          <span>Curriculum Intelligence Engine</span>
        </div>
        <h1 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">Academic Path Intelligence</h1>
        <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto px-2">
          Map your current technical stack to discover the most efficient route toward mastery in Distributed Systems and AI.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left: Skill Selection Area */}
        <div className="flex-1 p-6 md:p-10 space-y-8 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700 overflow-y-auto max-h-[800px] custom-scrollbar">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg md:text-xl font-bold flex items-center space-x-2 text-slate-800 dark:text-slate-200">
              <Filter className="w-5 h-5 text-blue-500" />
              <span>Technical Inventory</span>
            </h3>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter skills..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {selectedSkills.length > 0 && (
                <button onClick={reset} className="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Clear selection">
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-10">
            {filteredCategories.map((category) => (
              <div key={category.name} className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700/50 pb-2">{category.name}</h4>
                <div className="flex flex-wrap gap-2 md:gap-2.5">
                  {category.skills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`
                        px-3 md:px-4 py-1.5 md:py-2 rounded-lg border text-[11px] md:text-xs font-bold transition-all
                        ${selectedSkills.includes(skill) 
                          ? 'bg-[#3d4977] border-[#3d4977] text-white shadow-md' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-[#3d4977] dark:hover:bg-slate-750'}
                      `}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary & Action */}
        <div className="w-full md:w-80 p-6 md:p-10 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-between">
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Selection Summary</h4>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Skills Selected</span>
                <span className="text-blue-600 dark:text-blue-400">{selectedSkills.length} / {allSkills.length}</span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${(selectedSkills.length / allSkills.length) * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                {selectedSkills.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[9px] font-bold">
                    {s}
                  </span>
                ))}
                {selectedSkills.length === 0 && (
                  <p className="text-[11px] text-slate-400 italic">No skills selected yet...</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={handleGenerate}
              disabled={selectedSkills.length === 0 || isGenerating}
              className={`
                w-full py-4 rounded-xl font-bold text-sm transition-all flex flex-col items-center justify-center gap-2
                ${isGenerating ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-[#3d4977] text-white hover:bg-[#2d365a] shadow-xl hover:-translate-y-1'}
                ${selectedSkills.length === 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}
              `}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-3 border-slate-400 border-t-white rounded-full animate-spin" />
                  <span className="text-[10px] uppercase tracking-widest font-black">Analyzing...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  <span>Generate Roadmap</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showResult && (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-1.5 h-10 bg-blue-500 rounded-full" />
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Personalized Engineering Roadmap</h2>
                <p className="text-xs text-slate-500">Based on your proficiency in {selectedSkills.length} areas</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
              <span>Confidence Score: 94%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {(roadmapModulesState.length ? roadmapModulesState : defaultModules).map((node: RoadmapModule, i: number) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-lg group hover:border-blue-400 transition-all hover:shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-10 h-10 md:w-12 md:h-12 bg-${node.color}-50 dark:bg-${node.color}-900/30 rounded-xl flex items-center justify-center text-${node.color}-600`}>
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600">Module 0{i+1}</span>
                </div>
                <h4 className={`text-[10px] font-bold text-${node.color}-500 uppercase tracking-[0.15em] mb-2`}>{node.phase}</h4>
                <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-white mb-3 leading-tight group-hover:text-blue-600 transition-colors">{node.subject}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{node.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
                  <div className="flex items-center text-[10px] font-bold text-slate-400">
                    <span className="mr-2">Intensity:</span>
                    <span className="text-slate-600 dark:text-slate-300">{node.effort}</span>
                  </div>
                  <button 
                    onClick={() => setActiveDetailModule(node)}
                    className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicPathDemo;
