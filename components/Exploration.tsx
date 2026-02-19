import React from "react";

const Exploration: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <div className="w-1.5 h-12 bg-gradient-to-b from-[#3d4977] to-blue-500 rounded-full" />
        <h2 className="text-4xl font-extrabold text-[#1e293b] dark:text-white">
          What I'm Exploring
        </h2>
      </div>

      <p className="text-xl text-slate-500 dark:text-slate-400 max-w-4xl leading-relaxed font-light">
        My current interests lie at the intersection of technology, data, and
        organizational decision-making. I am particularly curious about how
        technical systems scale inside companies and influence strategy.
      </p>

      <ul className="space-y-3 text-slate-500 dark:text-slate-400 text-lg">
        <li>• Technology and financial decision systems</li>
        <li>• Data-driven strategy and analytics</li>
        <li>• Scalable system design in real organizations</li>
        <li>• Leadership in technology-driven companies</li>
      </ul>
    </div>
  );
};

export default Exploration;
