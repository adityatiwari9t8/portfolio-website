import { Board, Counters, SimStats, SolverEvent, AlgorithmType } from './types';
import { MAX_BFS_STEPS, MAX_SIM_STEPS } from './constants';

export const cloneBoard = (b: Board): Board => b.map((row) => [...row]);

export const emptyBoard = (): Board => Array.from({ length: 9 }, () => Array(9).fill(0));

export const newCounters = (): Counters => ({ steps: 0, backtracks: 0, queue: 0, peakQueue: 0 });

/** Same puzzle, new look: relabel digits, then shuffle rows inside bands and columns inside stacks. */
export const shuffleBoard = (board: Board): Board => {
  let out = cloneBoard(board);

  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  out = out.map((row) => row.map((v) => (v === 0 ? 0 : nums[v - 1])));

  const perm = () => {
    const p = [0, 1, 2];
    for (let i = p.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    return p;
  };

  for (let band = 0; band < 3; band++) {
    const p = perm();
    const rows = p.map((r) => [...out[band * 3 + r]]);
    for (let i = 0; i < 3; i++) out[band * 3 + i] = rows[i];
  }
  for (let stack = 0; stack < 3; stack++) {
    const p = perm();
    for (let r = 0; r < 9; r++) {
      const vals = p.map((c) => out[r][stack * 3 + c]);
      for (let i = 0; i < 3; i++) out[r][stack * 3 + i] = vals[i];
    }
  }
  return out;
};

export const isValid = (board: Board, row: number, col: number, num: number) => {
  for (let x = 0; x < 9; x++) if (board[row][x] === num) return false;
  for (let x = 0; x < 9; x++) if (board[x][col] === num) return false;
  const sr = row - (row % 3);
  const sc = col - (col % 3);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (board[sr + i][sc + j] === num) return false;
  return true;
};

export const validOptions = (board: Board, row: number, col: number) => {
  const out: number[] = [];
  for (let n = 1; n <= 9; n++) if (isValid(board, row, col, n)) out.push(n);
  return out;
};

/** Cells that break a Sudoku rule, as "r-c" keys. */
export const findConflicts = (board: Board): Set<string> => {
  const bad = new Set<string>();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (!v) continue;
      for (let i = 0; i < 9; i++) {
        if (i !== c && board[r][i] === v) bad.add(`${r}-${c}`);
        if (i !== r && board[i][c] === v) bad.add(`${r}-${c}`);
      }
      const sr = r - (r % 3);
      const sc = c - (c % 3);
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++) {
          const rr = sr + i;
          const cc = sc + j;
          if ((rr !== r || cc !== c) && board[rr][cc] === v) bad.add(`${r}-${c}`);
        }
    }
  }
  return bad;
};

export const countGivens = (b: Board) => b.reduce((n, row) => n + row.filter(Boolean).length, 0);

/** First empty cell in reading order, or the empty cell with the fewest valid digits. */
export const findEmptyCell = (b: Board, mode: 'standard' | 'mrv'): [number, number] | null => {
  if (mode === 'standard') {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (b[r][c] === 0) return [r, c];
    return null;
  }
  let best: [number, number] | null = null;
  let min = 10;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (b[r][c] !== 0) continue;
      const n = validOptions(b, r, c).length;
      if (n < min) {
        min = n;
        best = [r, c];
        if (n <= 1) return best;
      }
    }
  }
  return best;
};

type Solver = Generator<SolverEvent, void, undefined>;

/** Depth-first backtracking. `mrv` swaps the cell order for "fewest options first". */
function* backtracking(start: Board, mrv: boolean, k: Counters, cap: number): Solver {
  const b = cloneBoard(start);
  let capped = false;

  function* go(): Generator<SolverEvent, boolean, undefined> {
    const cell = findEmptyCell(b, mrv ? 'mrv' : 'standard');
    if (!cell) return true;
    const [r, c] = cell;
    yield { kind: 'focus', r, c, options: validOptions(b, r, c) };
    for (let n = 1; n <= 9; n++) {
      if (k.steps >= cap) {
        capped = true;
        return false;
      }
      k.steps++;
      if (!isValid(b, r, c, n)) continue;
      b[r][c] = n;
      yield { kind: 'place', r, c, n };
      if (yield* go()) return true;
      if (capped) return false;
      k.backtracks++;
      b[r][c] = 0;
      yield { kind: 'remove', r, c };
    }
    return false;
  }

  const solved = yield* go();
  yield { kind: 'end', solved, reason: solved ? 'solved' : capped ? 'cap' : 'unsolvable' };
}

/** Most-constrained cell, first valid digit, never undone. */
function* greedy(start: Board, k: Counters): Solver {
  const b = cloneBoard(start);
  for (;;) {
    const cell = findEmptyCell(b, 'mrv');
    if (!cell) {
      yield { kind: 'end', solved: true, reason: 'solved' };
      return;
    }
    const [r, c] = cell;
    yield { kind: 'focus', r, c, options: validOptions(b, r, c) };
    let placed = false;
    for (let n = 1; n <= 9; n++) {
      k.steps++;
      if (isValid(b, r, c, n)) {
        b[r][c] = n;
        placed = true;
        yield { kind: 'place', r, c, n };
        break;
      }
    }
    if (!placed) {
      yield { kind: 'end', solved: false, reason: 'stuck' };
      return;
    }
  }
}

/** Breadth-first search over partial boards, filling the first empty cell each time. */
function* breadthFirst(start: Board, k: Counters): Solver {
  const queue: Board[] = [cloneBoard(start)];
  k.queue = 1;
  k.peakQueue = 1;
  while (queue.length > 0) {
    if (k.steps >= MAX_BFS_STEPS) {
      yield { kind: 'end', solved: false, reason: 'cap' };
      return;
    }
    const current = queue.shift()!;
    k.steps++;
    k.queue = queue.length;
    yield { kind: 'state', board: current, queue: queue.length };
    const cell = findEmptyCell(current, 'standard');
    if (!cell) {
      yield { kind: 'end', solved: true, reason: 'solved' };
      return;
    }
    const [r, c] = cell;
    for (let n = 1; n <= 9; n++) {
      if (isValid(current, r, c, n)) {
        const next = cloneBoard(current);
        next[r][c] = n;
        queue.push(next);
      }
    }
    k.queue = queue.length;
    if (queue.length > k.peakQueue) k.peakQueue = queue.length;
  }
  yield { kind: 'end', solved: false, reason: 'unsolvable' };
}

export const createSolver = (algo: AlgorithmType, board: Board, k: Counters, cap = Infinity): Solver => {
  if (algo === 'dfs') return backtracking(board, false, k, cap);
  if (algo === 'mrv') return backtracking(board, true, k, cap);
  if (algo === 'greedy') return greedy(board, k);
  return breadthFirst(board, k);
};

/** Runs one strategy to the end without drawing anything, and reports what it cost. */
export const simulate = (algo: AlgorithmType, board: Board, cap = MAX_SIM_STEPS): SimStats => {
  const k = newCounters();
  const t0 = performance.now();
  let solved = false;
  let reason: 'solved' | 'unsolvable' | 'stuck' | 'cap' = 'unsolvable';
  for (const ev of createSolver(algo, board, k, cap)) {
    if (ev.kind === 'end') {
      solved = ev.solved;
      reason = ev.reason;
    }
  }
  return {
    steps: k.steps,
    backtracks: k.backtracks,
    peakQueue: k.peakQueue,
    solved,
    capped: reason === 'cap',
    stuck: reason === 'stuck',
    ms: performance.now() - t0
  };
};

export const runSimulations = (board: Board): Record<AlgorithmType, SimStats> => ({
  dfs: simulate('dfs', board),
  mrv: simulate('mrv', board),
  greedy: simulate('greedy', board),
  bfs: simulate('bfs', board)
});
