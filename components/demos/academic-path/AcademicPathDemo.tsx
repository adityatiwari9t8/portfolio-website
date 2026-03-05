import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Sparkles, BookOpen, CheckCircle2, RotateCcw, Filter, X, ExternalLink, ArrowRight, Target, Library, Layers } from 'lucide-react';

import { RoadmapModule } from './types';
import { COLOR_THEMES, SKILL_CATEGORIES } from './constants';
import { generateRoadmap } from './utils';

export default function AcademicPathDemo() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailModule, setActiveDetailModule] = useState<RoadmapModule | null>(null);
  const [roadmapModulesState, setRoadmapModulesState] = useState<RoadmapModule[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeDetailModule) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeDetailModule]);

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

      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden p-6 md:p-10">
        
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

      {selectedSkills.length > 0 && !showResult && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-full duration-300 pointer-events-none p-4 md:p-6">
          <div className="max-w-5xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.4)] rounded-2xl md:rounded-[2rem] p-3 md:p-4 pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
            
            <div className="w-full sm:flex-1 flex items-center gap-4 md:gap-6 overflow-hidden pl-2">
              <div className="flex flex-col shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Stack</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-200 leading-none">{selectedSkills.length}</span>
              </div>
              
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 shrink-0 hidden sm:block" />
              
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
      
    </div>
  );
}