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
          Computer Science undergraduate exploring the intersection of{" "}
          <span className="text-slate-700 dark:text-slate-300">
            technology, data, and leadership
          </span>.
        </h1>

        {/* Paragraphs - Left Aligned */}
        <div className="space-y-6 text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed text-justify md:text-left">
            <p>
            I am a Computer Science undergraduate with a strong interest in how
            technology and data drive better decision-making within organizations.
            My academic and project work focuses on building data-driven systems,
            particularly in contexts related to finance, analytics, and strategic
            problem-solving.
            </p>
            
            <p>
            Beyond technical execution, I’m deeply interested in understanding why
            systems are built, who they create value for, and how they scale inside
            real organizations. I enjoy approaching problems end-to-end — from
            framing the decision to designing and implementing the solution.
            </p>

            <p>
            My long-term goal is to grow into leadership roles within
            technology-driven companies, combining strong technical foundations
            with business and strategic insight. This portfolio represents my
            journey as a builder today and a future leader in the making.
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