import React from 'react';
import { FileText } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-12 mb-16 lg:mb-24 px-4 sm:px-6">
      
      {/* 1. TEXT SECTION 
          - Changed to Left Alignment (text-left) for better readability.
          - max-w-5xl: Fills space nicely but prevents lines from being unreadably long.
      */}
      <div className="w-full max-w-5xl mx-auto space-y-8">
        
        {/* Headline - Left Aligned for strong visual anchor */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight text-center md:text-left">
          Computer Science undergraduate designing data-driven systems
          at the intersection of{" "}
          <span className="text-slate-700 dark:text-slate-300">
          technology, analytics, and business leadership.
          </span>.
        </h1>

        {/* Paragraphs - Left Aligned */}
        <div className="space-y-6 text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed text-justify md:text-left">
          <p>
          I design interactive and data-driven systems — from curriculum intelligence tools to financial analytics platforms — that help users and organizations make clearer decisions through structured data and thoughtful engineering.
          </p>

          <p>
          I am deeply interested in how technology scales within organizations and influences strategy, operations, and long-term growth. My goal is to develop into a technology and product leader who bridges technical execution with business decision-making.

          </p>
          <p className="italic text-slate-500 dark:text-slate-400">
          Long-term, I aim to build technology-driven solutions that create meaningful economic and organizational impact.

          </p>

        </div>
      </div>

      {/* 2. IMAGE SECTION 
          - Centered below the text
      */}
      <div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px] aspect-square mx-auto">
         {/* Glow Effect */}
         <div className="absolute -inset-4 bg-gradient-to-tr from-[#3d4977] to-slate-200 dark:to-slate-800 rounded-3xl blur-2xl opacity-20" />
         
         {/* Image Frame */}
         <div className="relative w-full h-full bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden border-4 sm:border-8 border-white dark:border-slate-800 flex items-center justify-center">
            <img
              src="/img.png"
              alt="Aditya Tiwari"
              className="w-full h-full object-cover dark:brightness-90 dark:opacity-90"
              style={{ objectPosition: 'center top' }}
            />
         </div>
      </div>

      {/* 3. BUTTON SECTION 
          - Centered at bottom
      */}
      <div className="flex justify-center">
         <a 
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-20 flex items-center space-x-2 bg-[#1e293b] dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-bold shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-1 text-sm sm:text-base"
          >
            <FileText className="w-5 h-5" />
            <span>View Resume</span>
          </a>
      </div>

    </div>
  );
};

export default Hero;