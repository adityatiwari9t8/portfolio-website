import React from "react";

const Insights: React.FC = () => {
  const insights = [
    {
      title: "Why Data Systems Are Really Decision Systems",
      description:
        "Exploring how most software systems ultimately exist to support better human decisions, not just automate tasks.",
    },
    {
      title: "Engineering vs Problem Solving",
      description:
        "Reflections on why understanding the problem matters more than choosing the perfect technology stack.",
    },
    {
      title: "Technology, Finance, and Strategic Thinking",
      description:
        "How technical systems increasingly shape financial and organizational strategy.",
    },
  ];

  return (
    <div className="space-y-12">
      <div className="flex items-center space-x-4">
        <div className="w-1.5 h-12 bg-gradient-to-b from-[#3d4977] to-blue-500 rounded-full" />
        <h2 className="text-4xl font-extrabold text-[#1e293b] dark:text-white">
          Insights & Thinking
        </h2>
      </div>

      <p className="text-xl text-slate-500 dark:text-slate-400 max-w-4xl leading-relaxed font-light">
        Short reflections on technology, decision-making, and leadership — ideas
        I’m currently exploring as I grow as both an engineer and a thinker.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
          >
            <h3 className="text-xl font-bold text-[#1e293b] dark:text-white mb-3">
              {item.title}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;
