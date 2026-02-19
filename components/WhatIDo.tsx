import React from 'react';
import { SERVICES } from '../constants';

const WhatIDo: React.FC = () => {
  return (
    <div className="space-y-16">

      {/* Section Header */}
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-1.5 h-12 bg-gradient-to-b from-[#3d4977] to-blue-500 rounded-full" />
          <h2 className="text-4xl font-extrabold text-[#1e293b] dark:text-white">
            How I Think & Build
          </h2>
        </div>

        {/* Primary Philosophy */}
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-4xl leading-relaxed font-light">
          I approach technology as a tool for improving decision-making and enabling
          meaningful outcomes. My work focuses on understanding problems deeply,
          structuring them clearly, and designing systems that translate data into
          actionable insight.
        </p>

        {/* Strategic Framing */}
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-4xl leading-relaxed font-light">
          I am particularly interested in challenges at the intersection of technology,
          analytics, and organizational strategy — where engineering decisions influence
          how individuals, teams, and institutions operate and grow. My goal is to
          develop solutions that combine strong technical execution with long-term
          strategic thinking.
        </p>

        {/* Vision Line (MBA Signal) */}
        <p className="italic text-slate-400 dark:text-slate-500 max-w-3xl leading-relaxed">
          Long-term, I aim to bridge technical systems and business leadership by
          building technology that drives scalable impact and better organizational
          decision-making.
        </p>
      </div>

      {/* Capability Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service, idx) => (
          <div
            key={idx}
            className="
              group bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800
              transition-all duration-500 relative overflow-hidden
              hover:shadow-2xl hover:-translate-y-2 hover:border-[#3d4977]/30 dark:hover:border-blue-500/30
            "
          >
            <div className="relative z-10">

              {/* Icon */}
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-700 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-500">
                <div className="text-slate-400 group-hover:text-[#3d4977] dark:group-hover:text-blue-400 transition-colors">
                  {service.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-4 group-hover:text-[#3d4977] dark:group-hover:text-blue-400 transition-colors duration-300">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                {service.description}
              </p>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default WhatIDo;
