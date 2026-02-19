import React from 'react';
import { EDUCATION } from '../constants';
import { Calendar, MapPin, GraduationCap } from 'lucide-react';

const Education: React.FC = () => {
  return (
    <div className="space-y-20">

      {/* ---------- SECTION HEADER ---------- */}
      <div className="space-y-6 max-w-4xl">

        <span className="
          text-xs font-semibold tracking-[0.25em] uppercase
          text-[#3d4977] dark:text-blue-400
        ">
          Academic Journey
        </span>

        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1e293b] dark:text-white leading-tight">
          Education & Foundations
        </h2>

        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          My academic journey focuses on building strong computer science
          foundations while exploring how technical systems translate into
          real-world impact. I treat coursework as a framework for developing
          structured thinking, problem-solving intuition, and long-term
          technical depth.
        </p>
      </div>

      {/* ---------- TIMELINE ---------- */}
      <div className="relative pl-4 md:pl-10 space-y-16">

        {/* Timeline Line */}
        <div className="
          absolute left-[4px] md:left-[9px] top-4 bottom-4 w-[2px]
          bg-gradient-to-b from-[#3d4977]/80 via-blue-400/60 to-transparent
          rounded-full
        " />

        {EDUCATION.map((item, idx) => (
          <div key={idx} className="relative group">

            {/* Timeline Dot */}
            <div className="absolute -left-[40px] md:-left-[36px] top-2">
              <div className="relative flex h-6 w-6">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-30 blur-md"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-[#3d4977] border-4 border-white dark:border-slate-950 shadow-lg"></span>
              </div>
            </div>

            {/* CARD */}
            <div className="
              space-y-6
              bg-white dark:bg-slate-900
              p-8 md:p-10
              rounded-[2rem]
              border border-slate-100 dark:border-slate-800
              shadow-sm
              transition-all duration-500
              hover:shadow-[0_25px_70px_rgba(0,0,0,0.12)]
              hover:-translate-y-1
            ">

              {/* TOP ROW */}
              <div className="flex flex-col md:flex-row md:justify-between gap-6">

                <div className="space-y-2">
                  <h3 className="
                    text-2xl md:text-3xl font-extrabold
                    text-[#1e293b] dark:text-white
                    group-hover:text-[#3d4977]
                    dark:group-hover:text-blue-400
                    transition-colors
                  ">
                    {item.degree}
                  </h3>

                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-500 dark:text-slate-400">
                    <GraduationCap className="w-5 h-5" />
                    {item.institution}
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                    <Calendar className="w-4 h-4" />
                    {item.period}
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </div>
                </div>

              </div>

              {/* COURSEWORK */}
              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">

                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3">
                  <span className="w-8 h-px bg-slate-300"></span>
                  Key Coursework
                </h4>

                <div className="flex flex-wrap gap-3">
                  {item.coursework.map(course => (
                    <span
                      key={course}
                      className="
                        px-4 py-2 rounded-xl text-sm font-semibold
                        bg-slate-50 dark:bg-slate-800
                        text-slate-600 dark:text-slate-300
                        border border-slate-100 dark:border-slate-700
                        transition-all duration-300
                        hover:bg-[#3d4977]
                        hover:text-white
                        dark:hover:bg-blue-600
                      "
                    >
                      {course}
                    </span>
                  ))}
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
