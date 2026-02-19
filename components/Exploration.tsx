import React from "react";

const Exploration: React.FC = () => {
  const topics = [
    "Decision-making systems built on data and analytics",
    "Product and system design for scalable organizations",
    "Technology’s role in financial and operational strategy",
    "The intersection of engineering, product thinking, and leadership",
  ];

  return (
    <div className="space-y-20">

      {/* ---------- SECTION HEADER ---------- */}
      <div className="space-y-6 max-w-4xl">

        <span className="
          text-xs font-semibold tracking-[0.25em] uppercase
          text-[#3d4977] dark:text-blue-400
        ">
          Current Exploration
        </span>

        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1e293b] dark:text-white leading-tight">
          What I’m Currently Exploring
        </h2>

        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          I’m interested in how software systems influence real-world decisions —
          from learning platforms and financial tools to organizational workflows.
          My curiosity centers on understanding how technical design, data, and
          human behavior interact as systems scale within complex environments.
        </p>
      </div>

      {/* ---------- TOPIC GRID ---------- */}
      <div className="grid md:grid-cols-2 gap-8">

        {topics.map((topic, idx) => (
          <div
            key={idx}
            className="
              group relative
              bg-white dark:bg-slate-900
              p-8 rounded-[2rem]
              border border-slate-100 dark:border-slate-800
              shadow-sm
              transition-all duration-500
              hover:-translate-y-2
              hover:shadow-[0_25px_70px_rgba(0,0,0,0.12)]
              overflow-hidden
            "
          >

            {/* Subtle glow */}
            <div className="
              absolute inset-0 opacity-0
              group-hover:opacity-100
              transition duration-700
              bg-gradient-to-tr from-[#3d4977]/5 to-blue-400/5
            " />

            <p className="
              relative z-10
              text-lg font-medium
              text-slate-600 dark:text-slate-300
              leading-relaxed
            ">
              {topic}
            </p>

          </div>
        ))}

      </div>

      {/* ---------- CLOSING THOUGHT ---------- */}
      <div className="pt-4 text-center">
        <p className="italic text-slate-400 dark:text-slate-500 max-w-2xl mx-auto">
          Currently exploring how AI adoption, data systems, and human decision
          processes evolve together as technology becomes increasingly embedded
          within organizations.
        </p>
      </div>

    </div>
  );
};

export default Exploration;
