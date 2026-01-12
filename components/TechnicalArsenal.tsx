
import React from 'react';
import { SKILL_CATEGORIES } from '../constants';

const TechnicalArsenal: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="flex items-center space-x-4">
        <div className="w-1.5 h-12 bg-[#3d4977] rounded-full" />
        <h2 className="text-4xl font-extrabold text-[#1e293b] dark:text-white">Technical Arsenal</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-12">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1e293b] dark:text-white">{cat.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span 
                  key={skill}
                  className={`
                    px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shadow-sm transition-all duration-300 cursor-default
                    hover:border-[#3d4977]/40 dark:hover:border-blue-400/40 
                    hover:bg-slate-50 dark:hover:bg-white/[0.05]
                    hover:text-[#3d4977] dark:hover:text-white
                    hover:-translate-y-0.5
                  `}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalArsenal;
