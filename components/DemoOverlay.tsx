import React, { Suspense, lazy } from 'react';
import { X, ArrowLeft, Loader2 } from 'lucide-react';

// 👇 UPDATED IMPORTS: Pointing to the new folder structures
const AcademicPathDemo = lazy(() => import('./demos/academic-path/AcademicPathDemo'));
const ExpenseProDemo = lazy(() => import('./demos/expense-pro/ExpenseProDemo'));
const SudokuVisualizerDemo = lazy(() => import('./demos/sudoku-visualizer/SudokuVisualizerDemo'));

interface DemoOverlayProps {
  activeDemoId: string | null;
  onClose: () => void;
}

const DemoOverlay: React.FC<DemoOverlayProps> = ({ activeDemoId, onClose }) => {
  if (!activeDemoId) return null;

  const renderDemo = () => {
    return (
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-full space-y-4 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#3d4977] dark:text-blue-400" />
          <p className="text-sm font-semibold tracking-widest uppercase">Initializing System...</p>
        </div>
      }>
        {activeDemoId === '1' && <AcademicPathDemo />}
        {activeDemoId === '2' && <ExpenseProDemo />}
        {activeDemoId === '3' && <SudokuVisualizerDemo />}
      </Suspense>
    );
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex flex-col overflow-hidden
        bg-white
        dark:bg-gradient-to-b
        dark:from-slate-950
        dark:via-slate-950
        dark:to-black
        animate-in fade-in slide-in-from-bottom-6
        duration-500
      "
    >
      <div className="flex-none h-16 md:h-20 px-4 md:px-12 flex items-center justify-between border-b border-slate-200 dark:border-white/10 backdrop-blur-sm">
        <button onClick={onClose} className="flex items-center space-x-2 text-slate-500 hover:text-[#3d4977] dark:text-slate-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold hidden sm:inline">Back to Portfolio</span>
          <span className="font-semibold sm:hidden text-xs">Back</span>
        </button>

        <div className="flex items-center space-x-4 md:space-x-8">
          <div className="hidden lg:block text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              Live Production Demo
            </span>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors text-slate-600 dark:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950">
        {renderDemo()}
      </div>
    </div>
  );
};

export default DemoOverlay;