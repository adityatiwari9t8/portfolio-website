
import React from 'react';
import { X, ArrowLeft, Moon, Sun } from 'lucide-react';
import AcademicPathDemo from './demos/AcademicPathDemo';
import ExpenseProDemo from './demos/ExpenseProDemo';
import SudokuVisualizerDemo from './demos/SudokuVisualizerDemo';

interface DemoOverlayProps {
  activeDemoId: string | null;
  onClose: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const DemoOverlay: React.FC<DemoOverlayProps> = ({ activeDemoId, onClose, darkMode, onToggleDarkMode }) => {
  if (!activeDemoId) return null;

  const renderDemo = () => {
    switch (activeDemoId) {
      case '1': return <AcademicPathDemo />;
      case '2': return <ExpenseProDemo />;
      case '3': return <SudokuVisualizerDemo />;
      default: return <div className="p-20 text-center">Demo not found.</div>;
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-white dark:bg-slate-900 transition-all duration-500 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8`}>
      {/* Mini Nav Bar */}
      <div className="flex-none h-16 md:h-20 border-b border-slate-100 dark:border-slate-800 px-4 md:px-12 flex items-center justify-between">
        <button 
          onClick={onClose}
          className="flex items-center space-x-2 text-slate-500 hover:text-[#3d4977] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold hidden sm:inline">Back to Portfolio</span>
          <span className="font-bold sm:hidden text-xs">Back</span>
        </button>
        
        <div className="flex items-center space-x-4 md:space-x-8">
          <div className="hidden lg:block text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Live Production Demo</span>
          </div>

          <button 
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#3d4977] dark:hover:text-white transition-all border border-slate-100 dark:border-slate-700"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
          </button>

          <button 
            onClick={onClose}
            className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Demo Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {renderDemo()}
      </div>
    </div>
  );
};

export default DemoOverlay;
