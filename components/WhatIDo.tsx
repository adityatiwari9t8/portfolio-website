import React from 'react';
import { SERVICES } from '../constants';

const WhatIDo: React.FC = () => {
  return (
    <section className="space-y-20">

      {/* ================= HEADER ================= */}
      <div className="space-y-8 max-w-4xl">

        <div className="flex items-center space-x-4">
          <div className="
            w-1.5 h-14
            bg-gradient-to-b from-[#3d4977] to-blue-500
            rounded-full
          " />

          <h2 className="
            text-4xl md:text-5xl font-extrabold
            text-[#1e293b] dark:text-white
            tracking-tight
          ">
            How I Think & Build
          </h2>
        </div>

        <div className="w-20 h-[2px] bg-gradient-to-r from-[#3d4977] to-transparent rounded-full" />

        <p className="
          text-xl text-slate-500 dark:text-slate-400
          leading-relaxed font-light
        ">
          I approach technology as a way to understand complex problems and build
          systems that make information clearer and more useful. My work focuses on
          breaking challenges into structured components and designing solutions that
          combine strong engineering fundamentals with thoughtful user experience.
        </p>

        <p className="
          text-lg text-slate-500 dark:text-slate-400
          leading-relaxed font-light
        ">
          I am particularly interested in problems at the intersection of software
          engineering, data, and real-world decision processes — where technical
          systems influence how people learn, manage resources, and interact with
          information.
        </p>
      </div>

      {/* ================= CAPABILITIES GRID ================= */}
      <div className="
        grid grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-8
      ">
        {SERVICES.map((service, idx) => (
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

            {/* ICON */}
            <div className="
              w-14 h-14 mb-6
              rounded-xl
              flex items-center justify-center

              bg-slate-100
              dark:bg-white/5

              border border-slate-200
              dark:border-white/10
            ">
              <div className="text-[#3d4977] dark:text-blue-400">
                {service.icon}
              </div>
            </div>

            {/* TITLE */}
            <h3 className="
              text-xl font-bold mb-3
              text-[#1e293b] dark:text-white
            ">
              {service.title}
            </h3>

            {/* DESCRIPTION */}
            <p className="
              text-slate-600 dark:text-slate-400
              leading-relaxed
            ">
              {service.description}
            </p>

          </div>
        ))}
      </div>

    </section>
  );
};

export default WhatIDo;
