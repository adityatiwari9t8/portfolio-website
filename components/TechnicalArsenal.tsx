import React from 'react';
import { SKILL_CATEGORIES } from '../constants';

const TechnicalArsenal: React.FC = () => {
  return (
    <section className="space-y-20">

      {/* HEADER */}
      <div className="space-y-6 max-w-4xl">

        <div className="flex items-center space-x-4">
          <div className="
            w-1.5 h-12
            bg-gradient-to-b from-[#3d4977] to-blue-500
            rounded-full
          " />

          <h2 className="
            text-4xl font-extrabold
            text-[#1e293b] dark:text-white
          ">
            Engineering & Systems Foundations
          </h2>
        </div>

        <p className="
          text-lg text-slate-500 dark:text-slate-400
          leading-relaxed font-light
        ">
          My technical work is grounded in strong computer science fundamentals,
          modern software engineering practices, and systems-level thinking.
          I focus on understanding how technologies interact within larger
          architectures rather than treating tools in isolation.
        </p>
      </div>

      {/* GRID */}
      <div className="
        grid grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-8
      ">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <div
            key={idx}
            className="
              group
              rounded-3xl
              border border-slate-200 dark:border-white/10

              bg-white
              dark:bg-gradient-to-b
              dark:from-slate-900
              dark:to-slate-950

              p-8
              shadow-sm
              transition-all duration-300
              hover:shadow-lg hover:-translate-y-1
            "
          >

            {/* HEADER */}
            <div className="flex items-center gap-4 mb-8">

              <div className="
                p-3 rounded-xl
                bg-slate-100 dark:bg-white/5
                border border-slate-200 dark:border-white/10
              ">
                <div className="text-[#3d4977] dark:text-blue-400">
                  {cat.icon}
                </div>
              </div>

              <h3 className="
                text-lg font-bold
                text-[#1e293b] dark:text-white
              ">
                {cat.title}
              </h3>
            </div>

            {/* SKILLS */}
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="
                    px-3 py-1.5
                    rounded-md
                    text-xs font-semibold uppercase tracking-wide

                    bg-slate-50
                    dark:bg-white/5

                    border border-slate-200
                    dark:border-white/10

                    text-slate-600
                    dark:text-slate-300

                    transition-colors
                    hover:bg-slate-100
                    dark:hover:bg-white/10
                  "
                >
                  {skill}
                </span>
              ))}
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};

export default TechnicalArsenal;
