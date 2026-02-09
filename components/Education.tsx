import React from 'react';
import { EDUCATION } from '../constants';
import { Calendar, MapPin, GraduationCap } from 'lucide-react';

const Education: React.FC = () => {
  return (
    <div className="space-y-16">
      <div className="flex items-center space-x-4">
        <div className="w-1.5 h-12 bg-gradient-to-b from-[#3d4977] to-blue-500 rounded-full" />
        <h2 className="text-4xl font-extrabold text-[#1e293b] dark:text-white">Education</h2>
      </div>

      <div className="relative pl-4 md:pl-8 space-y-16">
        {/* Modern Gradient Line */}
        <div className="absolute left-[3px] md:left-[7px] top-4 bottom-4 w-1 bg-gradient-to-b from-[#3d4977] via-blue-400 to-slate-200 dark:to-slate-800 rounded-full" />

        {EDUCATION.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot with Pulse */}
            <div className="absolute -left-[41px] md:-left-[37px] top-2">
                <div className="relative flex h-5 w-5 md:h-6 md:w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 md:h-6 md:w-6 bg-[#3d4977] border-4 border-white dark:border-slate-900 shadow-lg"></span>
                </div>
            </div>
            
            <div className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] dark:text-white group-hover:text-[#3d4977] dark:group-hover:text-blue-400 transition-colors">
                    {item.degree}
                  </h3>
                  <div className="flex items-center gap-2 text-xl font-bold text-slate-500 dark:text-slate-400">
                    <GraduationCap className="w-6 h-6" />
                    {item.institution}
                  </div>
                </div>
                
                <div className="flex flex-col items-start md:items-end gap-2 text-slate-400 font-medium text-sm">
                  <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                    <Calendar className="w-4 h-4" />
                    <span>{item.period}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-8 h-px bg-slate-300"></span>
                    Key Coursework
                </h4>
                <div className="flex flex-wrap gap-3">
                  {item.coursework.map(course => (
                    <span 
                        key={course} 
                        className="px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-[#3d4977] hover:text-white dark:hover:bg-blue-600 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 transition-all duration-300 cursor-default"
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