import React from 'react';
import { EDUCATION } from '../constants';
import { Calendar, MapPin } from 'lucide-react';

const Education: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="flex items-center space-x-4">
        <div className="w-1.5 h-12 bg-[#3d4977] rounded-full" />
        <h2 className="text-4xl font-extrabold text-[#1e293b]">Education</h2>
      </div>

      <div className="relative pl-8 space-y-12">
        {/* Vertical line */}
        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-slate-200" />

        {EDUCATION.map((item, idx) => (
          <div key={idx} className="relative">
            {/* Dot */}
            <div className="absolute -left-[36px] top-2 w-4 h-4 rounded-full bg-[#3d4977] border-4 border-white shadow-sm" />
            
            <div className="space-y-4">
              <h3 className="text-3xl font-extrabold text-[#1e293b]">
                {item.degree}
              </h3>
              <p className="text-xl font-bold text-slate-500">
                {item.institution}
              </p>
              
              <div className="flex flex-wrap gap-6 text-slate-400 font-medium">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{item.period}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>{item.location}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold text-slate-600 uppercase tracking-widest">
                  Key Coursework
                </h4>
                <div className="flex flex-wrap gap-3">
                  {item.coursework.map(course => (
                    <span key={course} className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm hover:border-[#3d4977]/30 transition-all">
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