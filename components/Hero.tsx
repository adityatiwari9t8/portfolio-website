import React from 'react';
import { FileText } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#1e293b] dark:text-white leading-tight mb-2">
            Aditya Tiwari
          </h1>
        </div>
        
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          I'm a software engineer specialized in distributed systems and artificial intelligence. 
          Want to know how I may help your project?
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <a 
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-[#1e293b] dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-bold shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-1"
          >
            <FileText className="w-5 h-5" />
            <span>View Resume</span>
          </a>
        </div>
      </div>

      <div className="flex-1 w-full max-w-md md:max-w-none flex justify-center md:justify-end">
        <div className="relative group">
          {/* Background Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#3d4977] to-slate-200 dark:to-slate-800 rounded-3xl blur-2xl opacity-20 transition duration-1000 group-hover:opacity-40" />
          
          {/* Image Container */}
          <div className="relative w-full aspect-square md:w-[450px] bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden border-8 border-white dark:border-slate-800 flex items-center justify-center">
            <img 
              src="/img.png" 
              alt="Aditya Tiwari" 
              // Added 'object-top' here to fix the positioning
              className="w-full h-full object-cover object-top"
              style={{ transform: 'scale(1.1)' }} 
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Hero;