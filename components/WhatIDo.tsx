import React from 'react';
import { SERVICES } from '../constants';

const WhatIDo: React.FC = () => {
  return (
    <div className="space-y-20">

      {/* ================= HEADER ================= */}
      <div className="space-y-8 max-w-4xl">

        <div className="flex items-center space-x-4">
          <div className="w-1.5 h-14 bg-gradient-to-b from-[#3d4977] to-blue-500 rounded-full" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1e293b] dark:text-white tracking-tight">
            How I Think & Build
          </h2>
        </div>

        {/* Divider */}
        <div className="w-20 h-[2px] bg-gradient-to-r from-[#3d4977] to-transparent rounded-full" />

        {/* Philosophy */}
        <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-light">
          I approach technology as a way to understand complex problems and build
          systems that make information clearer and more useful. My work focuses on
          breaking challenges into structured components and designing solutions that
          combine strong engineering fundamentals with thoughtful user experience.
        </p>

        {/* Strategic Framing */}
        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-light">
          I am particularly interested in problems at the intersection of software
          engineering, data, and real-world decision processes — where technical
          systems influence how people learn, manage resources, and interact with
          information. I enjoy building products that transform complexity into
          intuitive and practical tools.
        </p>

      </div>

      {/* ================= SERVICES GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        {SERVICES.map((service, idx) => (
          <div
            key={idx}
            className="
              group relative bg-white dark:bg-slate-900
              p-10 rounded-[2.5rem]
              border border-slate-100 dark:border-slate-800
              shadow-sm
              transition-all duration-500
              hover:shadow-2xl hover:-translate-y-2
              hover:border-[#3d4977]/30 dark:hover:border-blue-500/30
              overflow-hidden
            "
          >

            {/* Hover Glow */}
            <div className="
              absolute -top-24 -right-24 w-72 h-72
              bg-slate-50 dark:bg-slate-800/50
              rounded-full blur-3xl opacity-0
              group-hover:opacity-100
              transition-opacity duration-500
            " />

            <div className="relative z-10">

              {/* Icon */}
              <div className="
                w-16 h-16 mb-8
                bg-white dark:bg-slate-800
                rounded-2xl
                flex items-center justify-center
                border border-slate-100 dark:border-slate-700
                shadow-sm
                group-hover:scale-110 group-hover:shadow-md
                transition-all duration-500
              ">
                <div className="text-slate-400 group-hover:text-[#3d4977] dark:group-hover:text-blue-400 transition-colors">
                  {service.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="
                text-2xl font-bold mb-4
                text-[#1e293b] dark:text-white
                group-hover:text-[#3d4977] dark:group-hover:text-blue-400
                transition-colors duration-300
              ">
                {service.title}
              </h3>

              {/* Description */}
              <p className="
                text-slate-500 dark:text-slate-400
                leading-relaxed
                group-hover:text-slate-700 dark:group-hover:text-slate-300
                transition-colors
              ">
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
