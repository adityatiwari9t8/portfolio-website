import React from "react";
import { INSIGHTS } from "../constants";

const Insights: React.FC = () => {
  return (
    <section className="space-y-20">

      {/* ================= HEADER ================= */}
      <div className="space-y-6 max-w-4xl">

        <span className="
          text-xs font-semibold tracking-[0.25em] uppercase
          text-[#3d4977] dark:text-blue-400
        ">
          Writing & Thinking
        </span>

        <h2 className="
          text-4xl md:text-5xl font-extrabold
          text-[#1e293b] dark:text-white
        ">
          Ideas & Insights
        </h2>

        <p className="
          text-lg
          text-slate-500 dark:text-slate-400
        ">
          Reflections on technology, systems thinking, and decision-making beyond code.
        </p>
      </div>

      {/* ================= INSIGHT GRID ================= */}
      <div className="
        grid md:grid-cols-2 lg:grid-cols-3
        gap-8
      ">
        {INSIGHTS.map((item, idx) => (
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
              hover:-translate-y-1
              hover:shadow-lg
            "
          >

            {/* META */}
            <div className="
              text-xs font-semibold
              text-[#3d4977] dark:text-blue-400
              mb-4
            ">
              {item.category} • {item.readTime}
            </div>

            {/* TITLE */}
            <h3 className="
              text-xl font-bold
              text-[#1e293b] dark:text-white
              mb-4
              leading-snug
            ">
              {item.title}
            </h3>

            {/* DESCRIPTION */}
            <p className="
              text-slate-600 dark:text-slate-400
              leading-relaxed
            ">
              {item.description}
            </p>

          </div>
        ))}
      </div>

      {/* ================= FOOTNOTE ================= */}
      <p className="
        italic text-center
        text-slate-400 dark:text-slate-500
        max-w-2xl mx-auto pt-4
      ">
        Currently exploring how AI adoption and human decision systems evolve together.
      </p>

    </section>
  );
};

export default Insights;