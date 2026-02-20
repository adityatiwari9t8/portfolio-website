import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Sparkles, BookOpen, CheckCircle2, RotateCcw, Filter, X, ExternalLink, ArrowRight, Target, Library, Layers } from 'lucide-react';

// --- TYPES ---
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

interface SubjectModel {
  name: string;
  level: 'bridge' | 'core' | 'advanced';
  requires: string[];
  triggers: string[];
  color: string;
}

// --- TAILWIND DYNAMIC COLOR MAP ---
const COLOR_THEMES: Record<string, { bg: string; hover: string; text: string; lightBg: string; border: string }> = {
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

// --- DATA MODELS ---
const SUBJECT_MODELS: SubjectModel[] = [
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

const SKILL_CATEGORIES = [
  { name: 'Programming Languages', skills: ['Python', 'C++', 'Java', 'Rust', 'Go', 'TypeScript', 'JavaScript', 'SQL', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Haskell'] },
  { name: 'CS Fundamentals', skills: ['Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks', 'Database Systems', 'OOP', 'Discrete Mathematics', 'Computer Architecture'] },
  { name: 'Mathematics', skills: ['Linear Algebra', 'Multivariable Calculus', 'Statistics', 'Probability', 'Numerical Methods', 'Optimization Theory', 'Information Theory'] },
  { name: 'AI & Machine Learning', skills: ['Neural Networks', 'Deep Learning', 'Computer Vision', 'NLP', 'Reinforcement Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Generative AI', 'LLMs'] },
  { name: 'DevOps & Systems', skills: ['Docker', 'Kubernetes', 'Git', 'CI/CD', 'AWS', 'Google Cloud', 'Terraform', 'Linux/Unix', 'gRPC', 'Kafka', 'Redis'] },
  { name: 'Software Engineering', skills: ['System Design', 'Agile Methodology', 'Microservices', 'GraphQL', 'REST API Design', 'Unit Testing', 'Web Basics (HTML/CSS)'] }
];

const missingFrom = (have: string[], need: string[]) => need.filter(n => !have.includes(n));

// --- COMPONENT ---
export default function AcademicPathDemo() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailModule, setActiveDetailModule] = useState<RoadmapModule | null>(null);
  const [roadmapModulesState, setRoadmapModulesState] = useState<RoadmapModule[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus trap and body scroll lock for modal
  useEffect(() => {
    if (activeDetailModule) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeDetailModule]);

  const generateRoadmap = (sel: string[]): RoadmapModule[] => {
    if (!sel.length) return [];
    
    const activated = SUBJECT_MODELS.filter(m => m.triggers.some(t => sel.includes(t)));
    const modules: RoadmapModule[] = [];

    activated.forEach(model => {
      const missing = missingFrom(sel, model.requires);
      if (missing.length > 0) {
        modules.push({
          phase: 'Bridge Phase', subject: `Foundations for ${model.name}`, effort: 'High', color: model.color,
          desc: `Strengthen prerequisite concepts (${missing.join(', ')}) before progressing.`,
          details: { objectives: ['Close conceptual gaps', `Prepare for ${model.name}`], topics: missing, resources: ['MIT OpenCourseWare', 'Coursera Fundamentals'] }
        });
      } else {
        modules.push({
          phase: model.level === 'advanced' ? 'Advanced Track' : 'Core Track', subject: model.name, effort: model.level === 'advanced' ? 'Advanced' : 'Critical', color: model.color,
          desc: 'The next logical step based on your current demonstrated skill profile.',
          details: { objectives: [`Master ${model.name}`, 'Apply concepts to real-world projects'], topics: model.triggers.slice(0, 4), resources: ['Top University Courses', 'Industry Playbooks'] }
        });
      }
    });

    const uniqueModules = Array.from(new Map(modules.map(m => [m.subject, m])).values())
      .sort((a, b) => (a.phase === 'Bridge Phase' ? -1 : 1))
      .slice(0, 3);

    if (uniqueModules.length === 0) {
      return [{
        phase: 'Exploration Track', subject: 'Broaden Your Foundations', effort: 'Variable', color: 'slate',
        desc: 'Your current selections are niche. Consider expanding your core fundamentals to generate a specific roadmap.',
        details: { objectives: ['Explore core CS concepts', 'Identify a specialization'], topics: ['General Computing', 'Software Architecture'], resources: ['Roadmap.sh', 'TeachYourselfCS'] }
      }];
    }

    return uniqueModules;
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return SKILL_CATEGORIES;
    const lowerQuery = searchQuery.toLowerCase();
    return SKILL_CATEGORIES.map(cat => ({
      ...cat,
      skills: cat.skills.filter(s => s.toLowerCase().includes(lowerQuery))
    })).filter(cat => cat.skills.length > 0);
  }, [searchQuery]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    if (showResult) setShowResult(false);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowResult(false);
    setTimeout(() => {
      setRoadmapModulesState(generateRoadmap(selectedSkills));
      setIsGenerating(false);
      setShowResult(true);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }, 1200);
  };

  const reset = () => {
    setSelectedSkills([]);
    setShowResult(false);
    setSearchQuery('');
  };

  return (
    <div className={`max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-8 space-y-12 relative ${selectedSkills.length > 0 && !showResult ? 'pb-40' : 'pb-12'}`}>
      
      {/* MODAL (Remains unchanged) */}
      {activeDetailModule && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setActiveDetailModule(null)} />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className={`h-2 w-full shrink-0 ${COLOR_THEMES[activeDetailModule.color]?.bg || 'bg-slate-500'}`} />
            <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${COLOR_THEMES[activeDetailModule.color]?.text || 'text-slate-500'}`}>
                    {activeDetailModule.phase}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {activeDetailModule.subject}
                  </h2>
                </div>
                <button onClick={() => setActiveDetailModule(null)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full transition-colors text-slate-500 shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="flex items-center space-x-2 text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span>Learning Objectives</span>
                  </h4>
                  <ul className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                    {activeDetailModule.details.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300">
                        <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="flex items-center space-x-2 text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      <Layers className="w-5 h-5 text-indigo-500" />
                      <span>Key Topics</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeDetailModule.details.topics.map((topic, i) => (
                        <span key={i} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold border border-indigo-100 dark:border-indigo-800/50">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="flex items-center space-x-2 text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      <Library className="w-5 h-5 text-purple-500" />
                      <span>Resources</span>
                    </h4>
                    <ul className="space-y-2">
                      {activeDetailModule.details.resources.map((res, i) => (
                        <li key={i} className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                          <span className="truncate mr-2">{res}</span>
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-800">
              <button onClick={() => setActiveDetailModule(null)} className={`w-full py-4 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all ${COLOR_THEMES[activeDetailModule.color]?.bg || 'bg-slate-600'} ${COLOR_THEMES[activeDetailModule.color]?.hover || 'hover:bg-slate-700'}`}>
                Enroll in Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-blue-100 dark:border-blue-800/50">
          <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
          <span>Curriculum Intelligence Engine</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Academic Path Intelligence</h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Map your current technical stack to discover the most efficient, personalized route toward software engineering mastery.
        </p>
      </div>

      {/* FULL-WIDTH MAIN LAYOUT */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden p-6 md:p-10">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-100 dark:border-slate-700/50">
          <h3 className="text-xl font-bold flex items-center space-x-2 text-slate-800 dark:text-slate-200 shrink-0">
            <Filter className="w-5 h-5 text-blue-500" />
            <span>Select Your Skills</span>
          </h3>
          
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search technologies, concepts, languages..."
              className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Full-Width Responsive Skills Grid */}
        <div className="min-h-[400px]">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700">
                <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No skills found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredCategories.map((category) => (
                <div key={category.name} className="space-y-4">
                  <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700/50 pb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                    {category.name}
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {category.skills.map(skill => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`
                            px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border
                            ${isSelected 
                              ? 'bg-[#2b3453] border-[#2b3453] text-white shadow-md transform scale-[1.02]' 
                              : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm hover:-translate-y-0.5'}
                          `}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STICKY BOTTOM DOCK (Replaces Right Panel) */}
      {selectedSkills.length > 0 && !showResult && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-full duration-300 pointer-events-none p-4 md:p-6">
          <div className="max-w-5xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.4)] rounded-2xl md:rounded-[2rem] p-3 md:p-4 pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
            
            {/* Dock Left: Stats & Scrollable Stack */}
            <div className="w-full sm:flex-1 flex items-center gap-4 md:gap-6 overflow-hidden pl-2">
              <div className="flex flex-col shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Stack</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-200 leading-none">{selectedSkills.length}</span>
              </div>
              
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 shrink-0 hidden sm:block" />
              
              {/* Horizontal Scroll Ribbon */}
              <div className="flex-1 flex gap-2 overflow-x-auto custom-scrollbar pb-1 pt-1 -mx-2 px-2 mask-linear-fade">
                {selectedSkills.map(s => (
                  <span key={s} className="shrink-0 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5 group">
                    {s}
                    <button onClick={(e) => { e.stopPropagation(); toggleSkill(s); }} className="text-slate-400 hover:text-rose-500 focus:outline-none">
                      <X className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Dock Right: Actions */}
            <div className="w-full sm:w-auto flex items-center gap-3 shrink-0 pr-1">
              <button 
                onClick={reset} 
                className="p-3 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/30 rounded-xl transition-colors"
                title="Clear Stack"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`
                  flex-1 sm:flex-none px-6 md:px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                  ${isGenerating ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-[#2b3453] text-white hover:bg-[#1f2640] shadow-lg hover:shadow-xl hover:-translate-y-0.5'}
                `}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Generate Map</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* RESULTS SECTION */}
      {showResult && (
        <div ref={resultsRef} className="animate-in fade-in slide-in-from-bottom-12 duration-700 space-y-8 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-14 bg-blue-500 rounded-full" />
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Your Optimized Roadmap</h2>
                <p className="text-sm text-slate-500 mt-1">Calculated based on {selectedSkills.length} selected competencies.</p>
              </div>
            </div>
            <button 
              onClick={() => { setShowResult(false); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth'}), 100); }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Edit Stack
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmapModulesState.map((node: RoadmapModule, i: number) => {
              const theme = COLOR_THEMES[node.color] || COLOR_THEMES.slate;
              
              return (
                <div key={i} className={`bg-white dark:bg-slate-800 p-8 rounded-[2rem] border ${theme.border} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden group`}>
                  
                  {/* Background decoration */}
                  <div className={`absolute top-0 right-0 w-40 h-40 ${theme.lightBg} rounded-bl-[120px] -z-10 transition-transform duration-500 group-hover:scale-110`} />

                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 ${theme.lightBg} rounded-2xl flex items-center justify-center ${theme.text}`}>
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-full">
                      Step 0{i+1}
                    </span>
                  </div>
                  
                  <div className="flex-1 mb-8">
                    <h4 className={`text-[10px] font-black ${theme.text} uppercase tracking-[0.15em] mb-3`}>{node.phase}</h4>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {node.subject}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {node.desc}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Expected Effort</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{node.effort}</span>
                    </div>
                    <button 
                      onClick={() => setActiveDetailModule(node)}
                      className={`px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-xs font-black uppercase ${theme.text} hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 group/btn`}
                    >
                      Details <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Styles for scrollbar and dock mask */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        /* Smooth fade for the scrolling tags in the dock */
        .mask-linear-fade {
          -webkit-mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
          mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
        }
      `}} />
    </div>
  );
}