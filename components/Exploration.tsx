import React from "react";
import { EXPLORATION_TOPICS } from "../constants";

const Exploration: React.FC = () => {
  return (
    <section className="space-y-20">

      {/* ================= HEADER ================= */}
      <div className="space-y-6 max-w-4xl">

        <span className="
          text-xs font-semibold tracking-[0.25em] uppercase
          text-[#3d4977] dark:text-blue-400
        ">
          Current Exploration
        </span>

        <h2 className="
          text-4xl md:text-5xl font-extrabold
          text-[#1e293b] dark:text-white
          leading-tight
        ">
          What I’m Currently Exploring
        </h2>

        <p className="
          text-lg
          text-slate-500 dark:text-slate-400
          leading-relaxed
        ">
          I’m interested in how software systems influence real-world decisions —
          from learning platforms and financial tools to organizational workflows.
          My curiosity centers on understanding how technical design, data, and
          human behavior interact as systems scale within complex environments.
        </p>
      </div>

      {/* ================= TOPIC GRID ================= */}
      <div className="
        grid md:grid-cols-2
        gap-8
      ">
        {EXPLORATION_TOPICS.map((topic, idx) => (
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

            <p className="
              text-lg font-medium
              text-slate-600 dark:text-slate-300
              leading-relaxed
            ">
              {topic}
            </p>

          </div>
        ))}
      </div>

      {/* ================= CLOSING ================= */}
      <div className="pt-6 text-center">
        <p className="
          italic
          text-slate-400 dark:text-slate-500
          max-w-2xl mx-auto
        ">
          Currently exploring how AI adoption, data systems, and human decision
          processes evolve together as technology becomes increasingly embedded
          within organizations.
        </p>
      </div>

    </section>
  );
};

export default Exploration;