import React from 'react';
import { SKILL_CATEGORIES } from '../constants';
import { Sparkles } from 'lucide-react';

const TechnicalArsenal: React.FC = () => {
  return (
    <div className="space-y-16">

      {/* Section Header */}
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-1.5 h-12 bg-gradient-to-b from-[#3d4977] to-blue-500 rounded-full" />
          <h2 className="text-4xl font-extrabold text-[#1e293b] dark:text-white">
            Engineering Foundations
          </h2>
        </div>

        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-4xl leading-relaxed font-light">
          My technical work is grounded in strong computer science fundamentals,
          modern software engineering practices, and systems-level thinking.
          I focus on understanding how technologies interact within larger
          architectures rather than treating tools in isolation.
        </p>
      </div>

      {/* Skill Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <div 
            key={idx} 
            className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-lg hover:shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner group-hover:scale-110 transition-transform">
                <div className="text-[#3d4977] dark:text-blue-400">
                  {cat.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#1e293b] dark:text-white">
                {cat.title}
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {cat.skills.map((skill) => (
                <div key={skill} className="relative group/skill">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3d4977] to-blue-500 rounded-lg blur opacity-0 group-hover/skill:opacity-50 transition duration-200" />
                  <span className="relative block px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide group-hover/skill:text-white group-hover/skill:bg-slate-900 transition-colors">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalArsenal;
