
import React from 'react';
import { SERVICES } from '../constants';

const WhatIDo: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-1.5 h-12 bg-[#3d4977] rounded-full" />
          <h2 className="text-4xl font-extrabold text-[#1e293b] dark:text-white">What I do</h2>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
          I build data-driven systems that support better decision-making in education, finance,
          and technology. My work focuses on translating complex technical models into practical
          tools that help people and organizations choose more effectively.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service, idx) => (
          <div 
            key={idx} 
            className={`
              group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm transition-all duration-500 border border-slate-100 dark:border-slate-700 
              hover:-translate-y-2 hover:shadow-xl
              hover:bg-slate-50/80 dark:hover:bg-white/[0.03]
              hover:border-[#3d4977]/30 dark:hover:border-blue-400/30
            `}
          >
            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-500 shadow-inner">
              <div className="text-slate-600 dark:text-slate-400 group-hover:text-[#3d4977] dark:group-hover:text-blue-400 transition-colors">
                {service.icon}
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#1e293b] dark:text-white mb-4 group-hover:text-[#3d4977] dark:group-hover:text-white transition-colors duration-500">
              {service.title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatIDo;
