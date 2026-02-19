import React from 'react';
import { PROJECTS } from '../constants';
import { ExternalLink } from 'lucide-react';

interface PortfolioProps {
  onLaunchDemo?: (id: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onLaunchDemo }) => {
  return (
    <div className="space-y-20">

      {/* ---------- SECTION HEADER ---------- */}
      <div className="space-y-6 max-w-4xl">

        <span className="
          text-xs font-semibold tracking-[0.25em] uppercase
          text-[#3d4977] dark:text-blue-400
        ">
          Selected Work
        </span>

        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1e293b] dark:text-white leading-tight">
          Systems I’ve Designed & Built
        </h2>

        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          A collection of systems focused on solving real-world problems through
          structured thinking, data-driven design, and practical engineering execution.
        </p>
      </div>

      {/* ---------- PROJECTS ---------- */}
      <div className="grid gap-12">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="
              group relative
              bg-white dark:bg-slate-900
              rounded-[2.5rem] p-10 lg:p-14
              border border-slate-100 dark:border-slate-800
              shadow-sm
              transition-all duration-500
              hover:shadow-[0_35px_90px_rgba(0,0,0,0.15)]
              hover:-translate-y-2
              overflow-hidden isolate
            "
          >

            {/* Background Glow */}
            <div className="
              absolute -right-24 -top-24 w-[28rem] h-[28rem]
              bg-gradient-to-tr from-[#3d4977]/10 to-blue-400/10
              rounded-full blur-3xl opacity-0
              group-hover:opacity-100
              transition duration-700 -z-10
            " />

            <div className="flex flex-col lg:flex-row gap-12 items-start">

              {/* ICON */}
              <div className="shrink-0">
                <div className="
                  w-24 h-24 rounded-[2rem]
                  bg-slate-50 dark:bg-slate-800
                  flex items-center justify-center
                  border border-slate-100 dark:border-slate-700
                  transition-all duration-500
                  group-hover:scale-110 group-hover:shadow-lg
                ">
                  <div className="
                    text-slate-400
                    group-hover:text-[#3d4977]
                    dark:group-hover:text-blue-400
                    transition-colors
                    scale-125
                  ">
                    {project.icon}
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex-1 space-y-6">

                {/* TITLE + CATEGORY */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">

                    <h3 className="
                      text-3xl lg:text-4xl font-bold
                      text-[#1e293b] dark:text-white
                      transition-colors duration-300
                      group-hover:text-[#3d4977]
                      dark:group-hover:text-blue-400
                    ">
                      {project.title}
                    </h3>

                    <span className="
                      px-4 py-1.5
                      text-xs font-bold uppercase tracking-widest
                      bg-slate-50 dark:bg-slate-800
                      border border-slate-100 dark:border-slate-700
                      rounded-full text-slate-500 dark:text-slate-300
                    ">
                      {project.category}
                    </span>
                  </div>

                  {/* TAGS */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="
                          px-3 py-1 rounded-lg text-xs font-medium
                          bg-slate-50 dark:bg-slate-800
                          border border-slate-100 dark:border-slate-700
                          text-slate-500 dark:text-slate-400
                        "
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="
                  text-lg leading-relaxed
                  text-slate-500 dark:text-slate-400
                  group-hover:text-slate-700
                  dark:group-hover:text-slate-300
                  transition-colors
                  max-w-3xl
                ">
                  {project.description}
                </p>

                {/* CTA */}
                <div className="pt-4">
                  <button
                    onClick={() => onLaunchDemo?.(project.id)}
                    className="
                      flex items-center space-x-2
                      px-7 py-3.5
                      bg-[#3d4977]
                      hover:bg-[#2d365a]
                      text-white rounded-xl font-semibold
                      shadow-lg shadow-blue-900/20
                      transition-all duration-300
                      hover:-translate-y-1 hover:shadow-xl
                      active:scale-95
                    "
                  >
                    <span>Open Live Demo</span>
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
