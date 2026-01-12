
import React from 'react';
import { PROJECTS } from '../constants';
import { ExternalLink } from 'lucide-react';

interface PortfolioProps {
  onLaunchDemo?: (id: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onLaunchDemo }) => {
  return (
    <div className="space-y-12">
      <div className="flex items-center space-x-4">
        <div className="w-1.5 h-12 bg-[#3d4977] rounded-full" />
        <h2 className="text-4xl font-extrabold text-[#1e293b] dark:text-white">Engineering Portfolio(Projects)</h2>
      </div>

      <div className="space-y-8">
        {PROJECTS.map((project) => (
          <div 
            key={project.id}
            className={`
              group relative bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-500 overflow-hidden
              hover:shadow-2xl hover:-translate-y-2
              hover:bg-slate-50/80 dark:hover:bg-white/[0.03] 
              hover:border-[#3d4977]/30 dark:hover:border-slate-500/30
            `}
          >
            {/* Category Badge */}
            <div className="absolute top-0 right-0 px-6 py-2 bg-slate-600 dark:bg-slate-700 text-white text-[10px] font-bold tracking-widest rounded-bl-2xl transition-all duration-500 group-hover:bg-[#3d4977] dark:group-hover:bg-slate-600">
              {project.category}
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Icon Container */}
              <div className={`
                w-20 h-20 shrink-0 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner transition-all duration-500
                group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-800
              `}>
                <div className="text-slate-500 dark:text-slate-400 transition-colors duration-500 group-hover:text-[#3d4977] dark:group-hover:text-white">
                  {project.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className={`
                      text-3xl font-extrabold text-[#1e293b] dark:text-white transition-all duration-500 transform
                      group-hover:text-[#3d4977] dark:group-hover:text-white
                    `}>
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider transition-colors duration-500 group-hover:bg-white dark:group-hover:bg-slate-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg max-w-4xl transition-colors duration-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  {project.description}
                </p>

                {/* Links */}
                <div className="flex flex-wrap gap-8 pt-4">
                  <button 
                    onClick={() => onLaunchDemo?.(project.id)}
                    className="flex items-center space-x-2 font-bold text-slate-600 dark:text-slate-400 hover:text-[#3d4977] dark:hover:text-white transition-all duration-300 text-sm"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Launch Demo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
