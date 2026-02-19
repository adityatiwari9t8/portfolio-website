import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-16 mb-24 lg:mb-32 px-4 sm:px-6">

      {/* TEXT */}
      <div className="w-full max-w-4xl mx-auto space-y-10">

        {/* Badge */}
        <div className="flex justify-center md:justify-start">
          <span className="px-4 py-1.5 text-xs font-semibold tracking-[0.25em] uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
            Computer Science Undergraduate • Systems & Strategy
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.12] tracking-tight text-center md:text-left text-slate-900 dark:text-white">
          Designing data-driven systems at the intersection of{" "}
          <span className="text-[#3d4977] dark:text-blue-400">
            technology, analytics, and business leadership
          </span>.
        </h1>

        {/* Description */}
        <div className="space-y-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed text-center md:text-left">
          <p>
            I build interactive systems — from curriculum intelligence engines
            to financial analytics platforms — that help people make clearer
            decisions through structured data and thoughtful engineering.
          </p>

          <p>
            My interests focus on how technology scales within organizations and
            shapes strategy, operations, and long-term growth.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-[#1e293b] hover:bg-black text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg transition-all hover:-translate-y-1"
          >
            <FileText className="w-5 h-5" />
            <span>View Resume</span>
          </a>

          <a
            href="#portfolio"
            className="flex items-center space-x-2 px-7 py-3.5 rounded-xl font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <span>View Projects</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* IMAGE */}
      <div className="relative w-full max-w-[420px] aspect-square">
        <div className="absolute -inset-6 bg-gradient-to-tr from-[#3d4977] to-blue-400/30 blur-3xl opacity-20 rounded-3xl" />

        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl">
          <img
            src="/img.png"
            alt="Aditya Tiwari"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center top' }}
          />
        </div>
      </div>

    </div>
  );
};

export default Hero;
