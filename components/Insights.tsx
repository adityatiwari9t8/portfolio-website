import React from "react";

const Insights: React.FC = () => {
  const insights = [
    {
      title: "Why Data Systems Are Really Decision Systems",
      category: "Technology & Strategy",
      readTime: "4 min read",
      description:
        "Modern software systems increasingly shape how people interpret information and make choices. This reflection explores how data infrastructure influences judgment, strategy, and organizational outcomes.",
    },
    {
      title: "Engineering vs Problem Solving",
      category: "Systems Thinking",
      readTime: "3 min read",
      description:
        "Technology choices matter less than problem clarity. Understanding constraints, users, and objectives often determines success long before implementation begins.",
    },
    {
      title: "Technology, Finance, and Strategic Thinking",
      category: "Technology & Business",
      readTime: "5 min read",
      description:
        "As technical systems increasingly shape financial models and organizational strategy, engineers benefit from understanding the broader business context behind the systems they build.",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="flex items-center space-x-4">
        <div className="w-1.5 h-12 bg-gradient-to-b from-[#3d4977] to-blue-500 rounded-full" />
        <h2 className="text-4xl font-extrabold text-[#1e293b] dark:text-white">
          Ideas & Insights
        </h2>
      </div>

      {/* Section Intro */}
      <p className="text-xl text-slate-500 dark:text-slate-400 max-w-4xl leading-relaxed font-light">
        I write about technology, systems thinking, and how software shapes the
        way people learn, decide, and organize work. These reflections capture my
        curiosity beyond implementation — exploring the broader implications of
        engineering in real-world contexts.
      </p>

      {/* Insights Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
          >
            {/* Meta Info */}
            <div className="text-sm text-blue-500 font-medium mb-2">
              {item.category} • {item.readTime}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-[#1e293b] dark:text-white mb-3">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Closing Thought */}
      <div className="pt-6 text-center">
        <p className="italic text-slate-400 dark:text-slate-500 max-w-2xl mx-auto">
          Currently exploring how AI adoption, data systems, and human decision
          processes evolve together as technology becomes more deeply embedded in
          organizations.
        </p>
      </div>
    </div>
  );
};

export default Insights;
