import React from 'react';
import { PROJECTS } from '../constants';
import { ExternalLink } from 'lucide-react';

interface PortfolioProps {
  onLaunchDemo?: (id: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onLaunchDemo }) => {
  return (
    <section className="space-y-24">

      {/* ================= HEADER ================= */}
      <div className="space-y-6 max-w-3xl">

        <span className="
          text-xs font-semibold tracking-[0.25em] uppercase
          text-[#3d4977] dark:text-blue-400
        ">
          Selected Work
        </span>

        <h2 className="
          text-4xl md:text-5xl font-extrabold
          text-[#1e293b] dark:text-white
        ">
          Systems I’ve Designed & Built
        </h2>

        <p className="text-lg text-slate-500 dark:text-slate-400">
          A collection of systems focused on solving real-world problems through
          structured thinking and practical engineering execution.
        </p>
      </div>

      {/* ================= PROJECT GRID ================= */}
      <div className="
        grid gap-12
        sm:grid-cols-1
        lg:grid-cols-2
        max-w-6xl mx-auto
      ">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="
              group
              rounded-3xl
              overflow-hidden
              border border-slate-200 dark:border-white/10

              bg-white
              dark:bg-gradient-to-b
              dark:from-slate-900
              dark:via-slate-900
              dark:to-slate-950

              shadow-sm
              transition-all duration-300
              hover:shadow-xl hover:-translate-y-1

              flex flex-col
              h-[520px] md:h-[560px]
            "
          >

            {/* ================= IMAGE SUB-CARD ================= */}
            {/* Minimal bottom padding (pb-1 / pb-2) to bring the text extremely close */}
            <div className="p-4 md:p-5 pb-1 md:pb-2 h-[250px] md:h-[280px] shrink-0">
              
              {/* Inner div acting as the sub-card */}
              <div className="
                relative w-full h-full 
                rounded-2xl overflow-hidden 
                border border-slate-100 dark:border-slate-800
                shadow-sm
                bg-slate-50 dark:bg-slate-800/50
              ">
                {/* Light Mode Image */}
                <img
                  src={project.imageLight}
                  alt={project.title}
                  className="
                    w-full h-full
                    object-cover object-top
                    dark:hidden
                    transition-transform duration-500
                    group-hover:scale-[1.03]
                  "
                />

                {/* Dark Mode Image */}
                <img
                  src={project.imageDark}
                  alt={project.title}
                  className="
                    hidden dark:block
                    w-full h-full
                    object-cover object-top
                    transition-transform duration-500
                    group-hover:scale-[1.03]
                  "
                />
              </div>
            </div>

            {/* ================= CONTENT ================= */}
            {/* Minimal top padding (pt-2) to close the gap from the bottom up */}
            <div className="px-5 md:px-6 pt-2 pb-6 md:pb-8 flex flex-col justify-between grow">

              <div className="space-y-4">
                <h3 className="
                  text-xl md:text-2xl font-bold
                  text-[#1e293b] dark:text-white
                ">
                  {project.title}
                </h3>

                <span className="
                  inline-block px-3 py-1
                  text-xs font-semibold uppercase tracking-wider
                  rounded-full
                  bg-slate-100 dark:bg-white/5
                  text-slate-600 dark:text-slate-300
                ">
                  {project.category}
                </span>

                <p className="
                  text-sm md:text-base
                  text-slate-600 dark:text-slate-400
                  leading-relaxed
                ">
                  {project.description}
                </p>
              </div>

              {/* DEMO BUTTON */}
              <button
                onClick={() => onLaunchDemo?.(project.id)}
                className="
                  inline-flex items-center gap-2
                  font-semibold
                  text-[#3d4977]
                  dark:text-blue-400
                  hover:gap-3
                  transition-all
                "
              >
                Open Live Demo
                <ExternalLink className="w-4 h-4" />
              </button>

            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;