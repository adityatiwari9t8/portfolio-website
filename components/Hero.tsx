import React from 'react';
import { FileText } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#1e293b] leading-tight mb-2">
            Aditya Tiwari
          </h1>
        </div>
        
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
          I'm a software engineer specialized in distributed systems and artificial intelligence. 
          Want to know how I may help your project?
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <button className="flex items-center space-x-2 bg-[#1e293b] hover:bg-black text-white px-8 py-4 rounded-lg font-bold shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-1">
            <FileText className="w-5 h-5" />
            <span>View Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;