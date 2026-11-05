import React, { Suspense, lazy, useRef } from 'react';
import { X, ArrowLeft, Loader2 } from 'lucide-react';
import { Project } from '../data/projects';
import DemoBoundary from './DemoBoundary';
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
  useDialog(!!demoId && !!DEMOS[demoId], onClose, root);
  if (!project || !demoId || !DEMOS[demoId]) return null;
  const Demo = DEMOS[demoId];

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} live demo`}
      tabIndex={-1}
      className="demo-shell fixed inset-0 z-[100] flex flex-col overflow-hidden outline-none"
    >
      <div className="demo-toolbar">
        <button data-autofocus onClick={onClose} aria-label="Back to portfolio">
          <ArrowLeft aria-hidden="true" /><span>Back</span>
        </button>
        <span>{project.title}</span>
        <button onClick={onClose} aria-label="Close demo" className="icon-button">
          <X aria-hidden="true" />
        </button>
      </div>
      <div className="demo-content custom-scrollbar flex-1 overflow-y-auto overscroll-contain">
        <DemoBoundary key={project.id} repo={project.repo} onClose={onClose}>
        <Suspense
          fallback={
            <div role="status" className="flex min-h-[60svh] flex-col items-center justify-center gap-4 text-neutral-600 dark:text-neutral-400">
              <Loader2 aria-hidden className="h-8 w-8 animate-spin" />
              <p className="text-sm font-normal">Loading demo</p>
            </div>
          }
        >
          <Demo />
        </Suspense>
        </DemoBoundary>
      </div>
    </div>
  );
};

export default DemoOverlay;
