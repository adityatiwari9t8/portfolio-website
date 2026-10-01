import React, { Suspense, lazy, useRef } from 'react';
import { X, ArrowLeft, Loader2 } from 'lucide-react';
import { Project } from '../data/projects';
import { useDialog } from '../lib/useDialog';

// Embedded demos are optional and lazy-loaded so they only download when opened.
// Register one as:  'my-demo': lazy(() => import('./demos/my-demo/MyDemo')),
const DEMOS: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'academic-path': lazy(() => import('./demos/academic-path/AcademicPathDemo')),
  'expense-pro': lazy(() => import('./demos/expense-pro/ExpenseProDemo')),
  'sudoku-visualizer': lazy(() => import('./demos/sudoku-visualizer/SudokuVisualizerDemo'))
};

interface DemoOverlayProps {
  project: Project | null;
  onClose: () => void;
}

const DemoOverlay: React.FC<DemoOverlayProps> = ({ project, onClose }) => {
  const root = useRef<HTMLDivElement | null>(null);
  const demoId = project?.demo;
  useDialog(!!demoId, onClose, root);
  if (!project || !demoId || !DEMOS[demoId]) return null;
  const Demo = DEMOS[demoId];

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} live demo`}
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#f4f4f2] outline-none dark:bg-[#0b0b0c]"
    >
      <div className="flex h-16 flex-none items-center justify-between border-b border-black/5 px-4 backdrop-blur-sm md:h-20 md:px-12 dark:border-white/10">
        <button
          data-autofocus
          onClick={onClose}
          className="flex items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden font-semibold sm:inline">Back</span>
          <span className="text-xs font-semibold sm:hidden">Back</span>
        </button>

        <div className="flex items-center gap-4 md:gap-8">
          <span className="hidden text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 lg:block dark:text-neutral-400">
            {project.title} &middot; live demo
          </span>
          <button
            onClick={onClose}
            aria-label="Close demo"
            className="rounded-xl border border-black/5 bg-white p-2.5 text-neutral-600 transition-colors hover:bg-neutral-200 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#f4f4f2] dark:bg-[#0b0b0c]">
        <Suspense
          fallback={
            <div className="flex h-full flex-col items-center justify-center gap-4 text-neutral-500 dark:text-neutral-400">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm font-semibold uppercase tracking-widest">Loading demo</p>
            </div>
          }
        >
          <Demo />
        </Suspense>
      </div>
    </div>
  );
};

export default DemoOverlay;
