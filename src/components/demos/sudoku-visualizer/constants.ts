import { AlgorithmType } from './types';

export const PRESETS = {
  easy: [
    [0, 0, 0, 2, 6, 0, 7, 0, 1], [6, 8, 0, 0, 7, 0, 0, 9, 0], [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0], [0, 0, 4, 6, 0, 2, 9, 0, 0], [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4], [0, 4, 0, 0, 5, 0, 0, 3, 6], [7, 0, 3, 0, 1, 8, 0, 0, 0]
  ],
  medium: [
    [0, 2, 0, 6, 0, 8, 0, 0, 0], [5, 8, 0, 0, 0, 9, 7, 0, 0], [0, 0, 0, 0, 4, 0, 0, 0, 0],
    [3, 7, 0, 0, 0, 0, 5, 0, 0], [6, 0, 0, 0, 0, 0, 0, 0, 4], [0, 0, 8, 0, 0, 0, 0, 1, 3],
    [0, 0, 0, 0, 2, 0, 0, 0, 0], [0, 0, 9, 8, 0, 0, 0, 3, 6], [0, 0, 0, 3, 0, 6, 0, 9, 0]
  ],
  hard: [
    [0, 0, 0, 6, 0, 0, 4, 0, 0], [7, 0, 0, 0, 0, 3, 6, 0, 0], [0, 0, 0, 0, 9, 1, 0, 8, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 5, 0, 1, 8, 0, 0, 0, 3], [0, 0, 0, 3, 0, 6, 0, 4, 5],
    [0, 4, 0, 2, 0, 0, 0, 6, 0], [9, 0, 3, 0, 0, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0, 1, 0, 0]
  ]
};

export type Difficulty = keyof typeof PRESETS;

/** Breadth-first search is stopped after this many expanded boards. */
export const MAX_BFS_STEPS = 3000;
/** Safety cap for the comparison run so an awkward board cannot freeze the page. */
export const MAX_SIM_STEPS = 1_500_000;

export const ALGORITHMS: { id: AlgorithmType; name: string; blurb: string }[] = [
  { id: 'dfs', name: 'DFS', blurb: 'Fills the first empty cell with a valid digit, and undoes the move when it gets stuck.' },
  { id: 'mrv', name: 'MRV', blurb: 'Backtracking like DFS, but always continues with the empty cell that has the fewest valid digits.' },
  { id: 'greedy', name: 'Greedy', blurb: 'Takes the first valid digit in the most constrained cell and never undoes it, so it can dead-end.' },
  { id: 'bfs', name: 'BFS', blurb: `Expands every partial board layer by layer. This demo stops it after ${MAX_BFS_STEPS.toLocaleString()} boards.` }
];

export const ALGO_LABEL: Record<AlgorithmType, string> = {
  dfs: 'DFS',
  mrv: 'MRV',
  greedy: 'Greedy',
  bfs: 'BFS'
};
