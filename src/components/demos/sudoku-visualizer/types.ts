export type Board = number[][];

export type AlgorithmType = 'dfs' | 'bfs' | 'greedy' | 'mrv';

/** What a solver reports to the visualiser, one visible move at a time. */
export type SolverEvent =
  | { kind: 'focus'; r: number; c: number; options: number[] }
  | { kind: 'place'; r: number; c: number; n: number }
  | { kind: 'remove'; r: number; c: number }
  | { kind: 'state'; board: Board; queue: number }
  | { kind: 'end'; solved: boolean; reason: 'solved' | 'unsolvable' | 'stuck' | 'cap' };

export interface Counters {
  /** Candidate digits tried (BFS: partial boards expanded). */
  steps: number;
  /** Placements that had to be undone. */
  backtracks: number;
  /** BFS only: boards waiting in the queue right now / at the peak. */
  queue: number;
  peakQueue: number;
}

export interface SimStats {
  steps: number;
  backtracks: number;
  peakQueue: number;
  solved: boolean;
  capped: boolean;
  stuck: boolean;
  ms: number;
}
