import React from 'react';
import { PROJECTS } from '../constants';
import { ExternalLink } from 'lucide-react';

interface PortfolioProps {
  onLaunchDemo?: (id: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onLaunchDemo }) => {
  return (
    <div className="space-y-16">

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-1.5 h-12 bg-gradient-to-b from-[#3d4977] to-blue-500 rounded-full" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1e293b] dark:text-white">
              Selected Projects & Systems
            </h2>
          </div>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-3xl">
            A collection of systems focused on solving real problems through data,
            structured thinking, and practical engineering execution.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-10">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="
              group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 lg:p-12
              shadow-sm border border-slate-100 dark:border-slate-800
              transition-all duration-500 overflow-hidden isolate
              hover:shadow-2xl hover:-translate-y-2
              hover:border-[#3d4977]/30 dark:hover:border-blue-500/30
            "
          >

            {/* Hover Background */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-slate-50 dark:bg-slate-800/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

            <div className="flex flex-col lg:flex-row gap-10 items-start relative z-10">

              {/* Icon */}
              <div className="shrink-0 relative">
                <div className="
                  w-24 h-24 bg-white dark:bg-slate-800
                  rounded-[2rem] flex items-center justify-center
                  border border-slate-100 dark:border-slate-700
                  shadow-sm group-hover:shadow-md transition-all duration-500 group-hover:scale-105
                ">
                  <div className="text-slate-400 transition-colors duration-500 group-hover:text-[#3d4977] dark:group-hover:text-blue-400 transform scale-125">
                    {project.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-6">

                {/* Title + Category */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h3 className="text-3xl font-bold text-[#1e293b] dark:text-white group-hover:text-[#3d4977] dark:group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </h3>

                    <span className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-full border border-slate-100 dark:border-slate-700">
                      {project.category}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-300">
                  {project.description}
                </p>

                {/* ⭐ Decision Impact (MBA SIGNAL) */}
                <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed">
                  <strong>Decision Impact:</strong> This system was designed to improve
                  decision-making by transforming structured data into actionable insights,
                  reducing manual analysis and enabling clearer outcomes.
                </p>

                {/* CTA */}
                <div className="pt-4 flex items-center gap-6">
                  <button
                    onClick={() => onLaunchDemo?.(project.id)}
                    className="flex items-center space-x-2 px-6 py-3 bg-[#3d4977] hover:bg-[#2d365a] text-white rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-1 active:scale-95"
                  >
                    <span>Launch Demo</span>
                    <ExternalLink className="w-4 h-4" />
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
