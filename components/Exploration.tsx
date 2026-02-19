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
        I’m currently exploring how software systems influence real-world
        decisions — from learning platforms and financial tools to organizational
        workflows. My curiosity focuses on understanding how technical design,
        data, and human behavior interact as systems scale.
      </p>

      <ul className="space-y-3 text-slate-500 dark:text-slate-400 text-lg">
        <li>• Decision-making systems built on data and analytics</li>
        <li>• Product and system design for scalable organizations</li>
        <li>• Technology’s role in financial and operational strategy</li>
        <li>• The intersection of engineering, product thinking, and leadership</li>
      </ul>
    </div>
  );
};

export default Exploration;
