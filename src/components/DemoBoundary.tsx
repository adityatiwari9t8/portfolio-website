import React from 'react';
import { ArrowUpRight, RefreshCw } from 'lucide-react';

interface Props { children: React.ReactNode; repo?: string; onClose: () => void; }

/** A failed chunk or demo render must not take the portfolio down with it. */
export default class DemoBoundary extends React.Component<Props, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <div role="alert" className="mx-auto flex min-h-[60svh] max-w-lg flex-col items-start justify-center px-6 py-12">
      <p className="eyebrow">Demo unavailable</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">This demo couldn’t load.</h2>
      <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">Please reload the page to try again. You can also return to the portfolio or explore the source code.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="button-primary" onClick={() => window.location.reload()}>Reload page <RefreshCw size={16} aria-hidden /></button>
        <button className="button-secondary" onClick={this.props.onClose}>Back to portfolio</button>
      </div>
      {this.props.repo && <a href={this.props.repo} target="_blank" rel="noopener noreferrer" className="text-link mt-4">Explore the source <ArrowUpRight size={16} aria-hidden /></a>}
    </div>;
  }
}
