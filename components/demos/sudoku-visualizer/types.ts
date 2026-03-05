export type AlgorithmType = 'dfs' | 'bfs' | 'greedy' | 'mrv';

export interface SimStats {
  steps: number;
  backtracks: number; 
  solved: boolean;
}