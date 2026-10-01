import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, BarChart3, Eraser, Grid3X3, Pause, Play, RotateCcw, Shuffle, SkipForward, Trash2
} from 'lucide-react';

import { AlgorithmType, Board, Counters, SimStats, SolverEvent } from './types';
import { ALGORITHMS, ALGO_LABEL, Difficulty, MAX_BFS_STEPS, MAX_SIM_STEPS, PRESETS } from './constants';
import {
  cloneBoard, countGivens, createSolver, emptyBoard, findConflicts, newCounters, runSimulations, shuffleBoard
} from './solver';

type Status = 'idle' | 'running' | 'paused' | 'done';
type Cell = [number, number] | null;

const MAX_EVENTS_PER_FRAME = 600;
/** Slider 1-100 -> visible moves per second (about 1 at the left, 15,000 at the right). */
const movesPerSecond = (s: number) => Math.max(1, Math.round(2 ** (s / 7.2)));

const END_MESSAGE: Record<string, string> = {
  solved: 'Solved. Every row, column and box is complete.',
  unsolvable: 'No solution exists for this board.',
  stuck: 'Greedy hit a dead end: a cell with no valid digit, and it never undoes a move.',
  cap: ''
};

const SudokuVisualizerDemo: React.FC = () => {
  const [puzzle, setPuzzle] = useState<Board>(() => cloneBoard(PRESETS.easy));
  const [grid, setGrid] = useState<Board>(() => cloneBoard(PRESETS.easy));
  const [difficulty, setDifficulty] = useState<Difficulty | 'custom'>('easy');
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('mrv');
  const [status, setStatus] = useState<Status>('idle');
  const [speed, setSpeed] = useState(45);
  const [stats, setStats] = useState({ steps: 0, backtracks: 0, queue: 0, ms: 0 });
  const [active, setActive] = useState<Cell>(null);
  const [placed, setPlaced] = useState<Cell>(null);
  const [removed, setRemoved] = useState<Cell>(null);
  const [selected, setSelected] = useState<Cell>(null);
  const [message, setMessage] = useState('Pick a strategy and press Solve, or step through one move at a time.');
  const [solved, setSolved] = useState(false);
  const [comparison, setComparison] = useState<Record<AlgorithmType, SimStats> | null>(null);
  const [comparing, setComparing] = useState(false);

  const genRef = useRef<Generator<SolverEvent, void, undefined> | null>(null);
  const workRef = useRef<Board>(grid);
  const kRef = useRef<Counters>(newCounters());
  const elapsedRef = useRef(0);
  const speedRef = useRef(speed);
  const statusRef = useRef<Status>('idle');
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  speedRef.current = speed;
  statusRef.current = status;

  const conflicts = useMemo(() => findConflicts(grid), [grid]);
  const givens = useMemo(() => countGivens(puzzle), [puzzle]);
  const editable = status === 'idle';

  const setRunStatus = (s: Status) => {
    statusRef.current = s;
    setStatus(s);
  };

  const clearRun = useCallback(() => {
    genRef.current = null;
    kRef.current = newCounters();
    elapsedRef.current = 0;
    setStats({ steps: 0, backtracks: 0, queue: 0, ms: 0 });
    setActive(null);
    setPlaced(null);
    setRemoved(null);
    setSolved(false);
    statusRef.current = 'idle';
    setStatus('idle');
  }, []);

  const loadBoard = useCallback(
    (board: Board, level: Difficulty | 'custom', msg: string) => {
      clearRun();
      setPuzzle(cloneBoard(board));
      setGrid(cloneBoard(board));
      workRef.current = cloneBoard(board);
      setDifficulty(level);
      setComparison(null);
      setSelected(null);
      setMessage(msg);
    },
    [clearRun]
  );

  const resetRun = () => {
    clearRun();
    setGrid(cloneBoard(puzzle));
    workRef.current = cloneBoard(puzzle);
    setMessage('Back to the starting board.');
  };

  const flush = () => {
    const k = kRef.current;
    setGrid(cloneBoard(workRef.current));
    setStats({ steps: k.steps, backtracks: k.backtracks, queue: k.queue, ms: elapsedRef.current });
  };

  const runComparison = useCallback((board: Board) => {
    setComparing(true);
    window.setTimeout(() => {
      setComparison(runSimulations(board));
      setComparing(false);
    }, 30);
  }, []);

  const applyEvent = (ev: SolverEvent): boolean => {
    const work = workRef.current;
    switch (ev.kind) {
      case 'focus':
        setActive([ev.r, ev.c]);
        setMessage(
          `Row ${ev.r + 1}, column ${ev.c + 1}: ${ev.options.length ? `can take ${ev.options.join(', ')}` : 'no valid digit left'}`
        );
        return true;
      case 'place':
        work[ev.r][ev.c] = ev.n;
        setPlaced([ev.r, ev.c]);
        setRemoved(null);
        setMessage(`Placed ${ev.n} at row ${ev.r + 1}, column ${ev.c + 1}`);
        return true;
      case 'remove':
        work[ev.r][ev.c] = 0;
        setRemoved([ev.r, ev.c]);
        setPlaced(null);
        setMessage(`Dead end. Undoing row ${ev.r + 1}, column ${ev.c + 1}`);
        return true;
      case 'state':
        workRef.current = ev.board;
        setMessage(`Expanding board ${kRef.current.steps.toLocaleString()} · ${ev.queue.toLocaleString()} waiting in the queue`);
        return true;
      case 'end': {
        genRef.current = null;
        setActive(null);
        setPlaced(null);
        setSolved(ev.solved);
        setRunStatus('done');
        setMessage(
          ev.reason === 'cap'
            ? `${algorithm === 'bfs' ? 'BFS' : ALGO_LABEL[algorithm]} stopped at the ${MAX_BFS_STEPS.toLocaleString()}-board limit this demo sets, without a solution.`
            : END_MESSAGE[ev.reason]
        );
        runComparison(puzzle);
        return false;
      }
    }
  };

  const advance = (): boolean => {
    const it = genRef.current;
    if (!it) return false;
    const r = it.next();
    if (r.done) return false;
    return applyEvent(r.value);
  };

  const begin = (): boolean => {
    if (conflicts.size > 0) {
      setMessage('Fix the highlighted conflicts before solving.');
      return false;
    }
    kRef.current = newCounters();
    elapsedRef.current = 0;
    workRef.current = cloneBoard(grid);
    genRef.current = createSolver(algorithm, grid, kRef.current);
    setSelected(null);
    setSolved(false);
    return true;
  };

  const onMain = () => {
    if (status === 'running') {
      setRunStatus('paused');
      setMessage('Paused. Resume, or step one move at a time.');
      return;
    }
    if (status === 'paused') {
      setRunStatus('running');
      return;
    }
    if (status === 'done') {
      setGrid(cloneBoard(puzzle));
      workRef.current = cloneBoard(puzzle);
      clearRun();
      genRef.current = createSolver(algorithm, puzzle, kRef.current);
      setRunStatus('running');
      return;
    }
    if (begin()) setRunStatus('running');
  };

  const onStep = () => {
    if (status === 'idle') {
      if (!begin()) return;
      setRunStatus('paused');
    }
    advance();
    flush();
  };

  // Animation loop: spend a per-frame budget of solver moves, then draw once.
  useEffect(() => {
    if (status !== 'running') return;
    let raf = 0;
    let last = performance.now();
    let budget = 0;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      elapsedRef.current += dt;
      budget += (movesPerSecond(speedRef.current) * dt) / 1000;
      let n = Math.min(Math.floor(budget), MAX_EVENTS_PER_FRAME);
      budget -= Math.floor(budget);
      let go = true;
      while (n-- > 0 && go) go = advance();
      flush();
      if (go && statusRef.current === 'running') raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const setCell = (r: number, c: number, n: number) => {
    if (!editable) return;
    const next = cloneBoard(puzzle);
    next[r][c] = n;
    setPuzzle(next);
    setGrid(cloneBoard(next));
    workRef.current = cloneBoard(next);
    setComparison(null);
    setDifficulty('custom');
    setMessage(n ? `Set row ${r + 1}, column ${c + 1} to ${n}.` : `Cleared row ${r + 1}, column ${c + 1}.`);
  };

  const focusCell = (r: number, c: number) => {
    setSelected([r, c]);
    cellRefs.current[r * 9 + c]?.focus();
  };

  const onCellKey = (e: React.KeyboardEvent, r: number, c: number) => {
    if (e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      setCell(r, c, Number(e.key));
    } else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      setCell(r, c, 0);
    } else if (e.key === 'ArrowUp') { e.preventDefault(); focusCell(Math.max(0, r - 1), c); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); focusCell(Math.min(8, r + 1), c); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); focusCell(r, Math.max(0, c - 1)); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); focusCell(r, Math.min(8, c + 1)); }
  };

  const selectAlgorithm = (a: AlgorithmType) => {
    if (status === 'running') return;
    if (status !== 'idle') {
      clearRun();
      setGrid(cloneBoard(puzzle));
      workRef.current = cloneBoard(puzzle);
    }
    setAlgorithm(a);
    setMessage(`${ALGO_LABEL[a]} selected.`);
  };

  const cellState = (r: number, c: number) => {
    const key = `${r}-${c}`;
    const v = grid[r][c];
    const given = puzzle[r][c] !== 0;
    const isActive = active?.[0] === r && active?.[1] === c;
    const isSel = selected?.[0] === r && selected?.[1] === c;
    const related =
      !!selected &&
      !isSel &&
      (selected[0] === r || selected[1] === c ||
        (Math.floor(selected[0] / 3) === Math.floor(r / 3) && Math.floor(selected[1] / 3) === Math.floor(c / 3)));
    const sameDigit = !!selected && v !== 0 && v === grid[selected[0]][selected[1]] && !isSel;
    return {
      v, given, isActive, isSel, related, sameDigit,
      conflict: conflicts.has(key),
      justPlaced: placed?.[0] === r && placed?.[1] === c,
      justRemoved: removed?.[0] === r && removed?.[1] === c
    };
  };

  const stat = (label: string, value: string) => (
    <div className="rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-white sm:text-3xl">{value}</p>
    </div>
  );

  const algoInfo = ALGORITHMS.find((a) => a.id === algorithm)!;
  const mainLabel =
    status === 'running' ? 'Pause' : status === 'paused' ? 'Resume' : status === 'done' ? 'Run again' : `Solve with ${ALGO_LABEL[algorithm]}`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:space-y-8 md:px-8 md:py-10">
      <header className="space-y-3 text-center">
        <h1 className="flex items-center justify-center gap-3 text-3xl font-medium tracking-[-0.03em] text-neutral-900 dark:text-white md:text-5xl">
          <span className="rounded-xl bg-indigo-100 p-2 dark:bg-indigo-500/15">
            <Grid3X3 className="h-6 w-6 text-indigo-700 dark:text-indigo-400 md:h-8 md:w-8" />
          </span>
          <span>
            Sudoku <span className="accent text-[1.1em]">Visualizer</span>
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-sm text-neutral-500 dark:text-neutral-400 md:text-base">
          Watch four search strategies work through the same board, one move at a time. You can also type in your own puzzle.
        </p>
        <div
          aria-live="polite"
          className="mx-auto flex max-w-full items-start gap-2 rounded-2xl border border-black/5 bg-white px-4 py-2 text-left text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 sm:text-sm md:w-fit"
        >
          <Activity className={`mt-0.5 h-4 w-4 shrink-0 ${status === 'running' ? 'animate-pulse text-indigo-500' : 'text-neutral-400'}`} />
          <span>{message}</span>
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,34rem)_1fr] lg:gap-10">
        {/* Board */}
        <div className="mx-auto w-full max-w-[34rem] space-y-4">
          <div
            role="grid"
            aria-label="Sudoku board"
            className="grid aspect-square w-full grid-cols-9 grid-rows-9 overflow-hidden rounded-xl border-2 border-neutral-900 bg-white dark:border-neutral-300 dark:bg-neutral-900"
          >
            {grid.map((row, r) =>
              row.map((_, c) => {
                const s = cellState(r, c);
                const bottom = r === 8 ? '' : r % 3 === 2 ? 'border-b-2 border-b-neutral-900 dark:border-b-neutral-300' : 'border-b border-b-neutral-200 dark:border-b-white/10';
                const right = c === 8 ? '' : c % 3 === 2 ? 'border-r-2 border-r-neutral-900 dark:border-r-neutral-300' : 'border-r border-r-neutral-200 dark:border-r-white/10';
                let bg = '';
                if (s.isActive) bg = 'bg-indigo-500 text-white';
                else if (s.conflict) bg = 'bg-rose-100 dark:bg-rose-500/20';
                else if (s.justRemoved) bg = 'bg-rose-100 dark:bg-rose-500/20';
                else if (s.justPlaced) bg = 'bg-indigo-100 dark:bg-indigo-500/25';
                else if (s.sameDigit) bg = 'bg-indigo-50 dark:bg-indigo-400/15';
                else if (s.related) bg = 'bg-neutral-100 dark:bg-white/5';
                let text = 'text-indigo-600 dark:text-indigo-300';
                if (s.isActive) text = 'text-white';
                else if (s.conflict) text = 'text-rose-600 dark:text-rose-300';
                else if (s.given) text = 'text-neutral-900 dark:text-white';
                else if (solved) text = 'text-emerald-600 dark:text-emerald-400';
                return (
                  <button
                    key={`${r}-${c}`}
                    ref={(el) => { cellRefs.current[r * 9 + c] = el; }}
                    role="gridcell"
                    aria-label={`Row ${r + 1}, column ${c + 1}, ${s.v || 'empty'}${s.given ? ', given' : ''}${s.conflict ? ', conflict' : ''}`}
                    onClick={() => setSelected([r, c])}
                    onFocus={() => setSelected([r, c])}
                    onKeyDown={(e) => onCellKey(e, r, c)}
                    className={`flex items-center justify-center text-[clamp(1rem,4.8vw,1.7rem)] outline-none transition-colors ${bottom} ${right} ${bg} ${text} ${s.given ? 'font-semibold' : 'font-medium'} ${s.isSel ? 'relative z-10 ring-2 ring-inset ring-indigo-500' : ''} focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500`}
                  >
                    {s.v !== 0 ? s.v : ''}
                  </button>
                );
              })
            )}
          </div>

          {editable && selected && (
            <div className="grid grid-cols-10 gap-1.5" aria-label="Number pad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => setCell(selected[0], selected[1], n)}
                  className="rounded-lg border border-black/5 bg-white py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:border-indigo-400 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setCell(selected[0], selected[1], 0)}
                aria-label="Erase digit"
                className="flex items-center justify-center rounded-lg border border-black/5 bg-white py-2.5 text-neutral-600 transition-colors hover:border-rose-400 hover:text-rose-500 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300"
              >
                <Eraser className="h-4 w-4" />
              </button>
            </div>
          )}

          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            <li className="flex items-center gap-1.5"><b className="font-semibold text-neutral-900 dark:text-white">5</b> given</li>
            <li className="flex items-center gap-1.5"><b className="font-medium text-indigo-600 dark:text-indigo-300">5</b> placed by solver</li>
            <li className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-indigo-500" /> cell being examined</li>
            <li className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-rose-300 dark:bg-rose-500/60" /> undone or conflicting</li>
          </ul>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {stat('Steps', stats.steps.toLocaleString())}
            {stat(algorithm === 'bfs' ? 'Queue' : 'Backtracks', (algorithm === 'bfs' ? stats.queue : stats.backtracks).toLocaleString())}
            {stat('Time', `${(stats.ms / 1000).toFixed(1)}s`)}
          </div>

          <section className="space-y-5 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Board</h3>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {givens} givens · {81 - givens} empty
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <button
                    key={level}
                    disabled={status === 'running'}
                    onClick={() => loadBoard(shuffleBoard(PRESETS[level]), level, `Loaded a fresh ${level} board.`)}
                    className={`rounded-lg border py-2 text-xs font-semibold capitalize transition-colors disabled:opacity-50 ${
                      difficulty === level
                        ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                        : 'border-black/5 bg-neutral-50 text-neutral-600 hover:border-indigo-400 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={status === 'running'}
                  onClick={() => loadBoard(shuffleBoard(puzzle), difficulty, 'Same puzzle, relabelled and rearranged.')}
                  className="flex items-center justify-center gap-2 rounded-lg border border-black/5 bg-neutral-50 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:border-indigo-400 disabled:opacity-50 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300"
                >
                  <Shuffle className="h-3.5 w-3.5" /> Shuffle
                </button>
                <button
                  disabled={status === 'running'}
                  onClick={() => loadBoard(emptyBoard(), 'custom', 'Empty board. Select a cell and type digits 1-9 to build a puzzle.')}
                  className="flex items-center justify-center gap-2 rounded-lg border border-black/5 bg-neutral-50 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:border-rose-400 hover:text-rose-500 disabled:opacity-50 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Strategy</h3>
              <div className="grid grid-cols-4 gap-2">
                {ALGORITHMS.map((a) => (
                  <button
                    key={a.id}
                    aria-pressed={algorithm === a.id}
                    disabled={status === 'running'}
                    onClick={() => selectAlgorithm(a.id)}
                    className={`rounded-lg border py-2 text-xs font-semibold transition-colors disabled:opacity-50 ${
                      algorithm === a.id
                        ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                        : 'border-black/5 bg-neutral-50 text-neutral-600 hover:border-indigo-400 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300'
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
              <p className="min-h-[2.5rem] text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{algoInfo.blurb}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="sudoku-speed" className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  Speed
                </label>
                <span className="text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400">
                  {movesPerSecond(speed).toLocaleString()} moves/s
                </span>
              </div>
              <input
                id="sudoku-speed"
                type="range"
                min={1}
                max={100}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-indigo-600 dark:bg-neutral-800"
              />
            </div>

            <div className="grid grid-cols-[1fr_auto_auto] gap-2 border-t border-black/5 pt-4 dark:border-white/10">
              <button
                onClick={onMain}
                className="flex items-center justify-center gap-2 rounded-xl bg-neutral-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                {status === 'running' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                {mainLabel}
              </button>
              <button
                onClick={onStep}
                disabled={status === 'running' || status === 'done'}
                aria-label="Step one move"
                title="Step one move"
                className="flex items-center justify-center rounded-xl border border-black/5 bg-neutral-50 px-4 text-neutral-700 transition-colors hover:border-indigo-400 disabled:opacity-40 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200"
              >
                <SkipForward className="h-4 w-4" />
              </button>
              <button
                onClick={resetRun}
                disabled={status === 'idle'}
                aria-label="Reset to the starting board"
                title="Reset to the starting board"
                className="flex items-center justify-center rounded-xl border border-black/5 bg-neutral-50 px-4 text-neutral-700 transition-colors hover:border-rose-400 hover:text-rose-500 disabled:opacity-40 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      </div>

      <Comparison
        results={comparison}
        comparing={comparing}
        current={algorithm}
        busy={status === 'running'}
        onRun={() => runComparison(puzzle)}
        disabled={conflicts.size > 0}
      />
    </div>
  );
};

const RESULT_LABEL = (s: SimStats) => (s.solved ? 'Solved' : s.capped ? 'Hit the limit' : s.stuck ? 'Stuck' : 'No solution');

const Comparison: React.FC<{
  results: Record<AlgorithmType, SimStats> | null;
  comparing: boolean;
  current: AlgorithmType;
  busy: boolean;
  disabled: boolean;
  onRun: () => void;
}> = ({ results, comparing, current, busy, disabled, onRun }) => {
  const notes: string[] = [];
  let maxSteps = 1;
  if (results) {
    maxSteps = Math.max(...ALGORITHMS.map((a) => results[a.id].steps), 1);
    const { dfs, mrv, greedy, bfs } = results;
    if (dfs.solved && mrv.solved) {
      notes.push(
        mrv.steps < dfs.steps
          ? `MRV needed ${mrv.steps.toLocaleString()} steps against ${dfs.steps.toLocaleString()} for plain DFS on this board.`
          : `MRV did not beat plain DFS on this board: ${mrv.steps.toLocaleString()} steps against ${dfs.steps.toLocaleString()}.`
      );
    }
    if (dfs.capped) notes.push(`Plain DFS was stopped at ${MAX_SIM_STEPS.toLocaleString()} steps without finishing.`);
    if (greedy.stuck) notes.push('Greedy never undoes a move, so one early wrong choice left it with a cell that has no valid digit.');
    if (greedy.solved) notes.push('Greedy solved this board without a single backtrack: every first choice happened to be right.');
    if (bfs.capped) notes.push(`BFS reached the ${MAX_BFS_STEPS.toLocaleString()}-board limit this demo sets, so it is shown as not finished.`);
    if (!dfs.solved && !dfs.capped) notes.push('Backtracking exhausted every option: this board has no solution.');
  }

  return (
    <section className="space-y-4 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Compare all four strategies</h2>
        </div>
        <button
          onClick={onRun}
          disabled={comparing || busy || disabled}
          className="rounded-xl bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-40 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        >
          {comparing ? 'Running…' : results ? 'Run again' : 'Run comparison'}
        </button>
      </div>

      {!results ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Runs every strategy on the starting board without animation and reports what each one cost. It also runs automatically when a solve finishes.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  <th className="py-2 pr-3 font-semibold">Strategy</th>
                  <th className="py-2 pr-3 font-semibold">Result</th>
                  <th className="py-2 pr-3 font-semibold">Steps (log scale)</th>
                  <th className="py-2 pr-3 text-right font-semibold">Backtracks / peak queue</th>
                  <th className="py-2 text-right font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {ALGORITHMS.map((a) => {
                  const s = results[a.id];
                  const pct = Math.max(2, (Math.log10(s.steps + 1) / Math.log10(maxSteps + 1)) * 100);
                  return (
                    <tr key={a.id} className={`border-t border-black/5 dark:border-white/10 ${a.id === current ? 'bg-neutral-50 dark:bg-white/[0.04]' : ''}`}>
                      <td className="py-3 pr-3 font-semibold text-neutral-900 dark:text-white">{a.name}</td>
                      <td className={`py-3 pr-3 font-medium ${s.solved ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {RESULT_LABEL(s)}
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800 sm:w-40">
                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="tabular-nums text-neutral-700 dark:text-neutral-300">
                            {s.steps.toLocaleString()}
                            {s.capped ? '+' : ''}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                        {a.id === 'bfs' ? `${s.peakQueue.toLocaleString()} queued` : s.backtracks.toLocaleString()}
                      </td>
                      <td className="py-3 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                        {s.ms < 1 ? '<1' : Math.round(s.ms).toLocaleString()} ms
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {notes.length > 0 && (
            <ul className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-300">
              {notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-indigo-500" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
};

export default SudokuVisualizerDemo;
