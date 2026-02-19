import React from "react";

const Insights: React.FC = () => {
  const insights = [
    {
      title: "Why Data Systems Are Really Decision Systems",
      category: "Technology & Strategy",
      readTime: "4 min read",
      description:
        "Modern software systems increasingly shape how people interpret information and make choices. This reflection explores how data infrastructure influences judgment and strategy.",
    },
    {
      title: "Engineering vs Problem Solving",
      category: "Systems Thinking",
      readTime: "3 min read",
      description:
        "Technology choices matter less than problem clarity. Understanding constraints and objectives often determines success long before implementation.",
    },
    {
      title: "Technology, Finance, and Strategic Thinking",
      category: "Technology & Business",
      readTime: "5 min read",
      description:
        "As systems shape financial models and organizational strategy, engineers benefit from understanding the broader business context behind the systems they build.",
    },
  ];

  return (
    <div className="space-y-20">

      <div className="space-y-6 max-w-4xl">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#3d4977] dark:text-blue-400">
          Writing & Thinking
        </span>

        <h2 className="text-4xl md:text-5xl font-extrabold">
          Ideas & Insights
        </h2>

        <p className="text-lg text-slate-500 dark:text-slate-400">
          Reflections on technology, systems thinking, and decision-making beyond code.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:-translate-y-2 hover:shadow-xl transition-all"
          >
            <div className="text-xs font-semibold text-[#3d4977] dark:text-blue-400 mb-3">
              {item.category} • {item.readTime}
            </div>

            <h3 className="text-xl font-bold mb-4">
              {item.title}
            </h3>

            <p className="text-slate-500 dark:text-slate-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <p className="italic text-center text-slate-400 dark:text-slate-500 max-w-2xl mx-auto">
        Currently exploring how AI adoption and human decision systems evolve together.
      </p>
    </div>
  );
};

export default Insights;
