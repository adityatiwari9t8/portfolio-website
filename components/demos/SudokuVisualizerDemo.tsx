
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, RotateCcw, Zap, Grid3X3, Trash2, Shuffle, 
  Square, MousePointer2, Keyboard, Info, Timer, 
  Activity, AlertCircle, CheckCircle
} from 'lucide-react';

const PRESETS = {
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

/**
 * Shuffles a Sudoku board while maintaining its validity.
 * It swaps rows within bands, columns within stacks, and permutes digits.
 */
const shuffleBoard = (board: number[][]): number[][] => {
  let newBoard = board.map(row => [...row]);

  // 1. Shuffle Digits (1-9)
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  const mapping: { [key: number]: number } = { 0: 0 };
  for (let i = 0; i < 9; i++) mapping[i + 1] = nums[i];
  
  newBoard = newBoard.map(row => row.map(val => mapping[val]));

  // 2. Shuffle Rows within each 3-row band
  for (let band = 0; band < 3; band++) {
    const rows = [0, 1, 2].sort(() => Math.random() - 0.5);
    const bandBase = band * 3;
    const tempRows = rows.map(r => [...newBoard[bandBase + r]]);
    for (let i = 0; i < 3; i++) {
      newBoard[bandBase + i] = tempRows[i];
    }
  }

  // 3. Shuffle Columns within each 3-column stack
  for (let stack = 0; stack < 3; stack++) {
    const cols = [0, 1, 2].sort(() => Math.random() - 0.5);
    const stackBase = stack * 3;
    for (let r = 0; r < 9; r++) {
      const tempRowVals = cols.map(c => newBoard[r][stackBase + c]);
      for (let i = 0; i < 3; i++) {
        newBoard[r][stackBase + i] = tempRowVals[i];
      }
    }
  }

  return newBoard;
};

const SudokuVisualizerDemo: React.FC = () => {
  const [startingGrid, setStartingGrid] = useState<number[][]>(PRESETS.easy.map(row => [...row]));
  const [grid, setGrid] = useState<number[][]>(PRESETS.easy.map(row => [...row]));
  const [isSolving, setIsSolving] = useState(false);
  const [speed, setSpeed] = useState(85);
  const [solved, setSolved] = useState(false);
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [stats, setStats] = useState({ steps: 0, backtracks: 0, time: 0 });
  const [statusMsg, setStatusMsg] = useState('Select a cell to begin or press Solve.');
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [currentDifficulty, setCurrentDifficulty] = useState<keyof typeof PRESETS>('easy');
  
  const terminateRef = useRef(false);
  const speedRef = useRef(speed);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Helper to check if a position is in the same row, col, or 3x3 box
  const isRelated = useCallback((r: number, c: number, sr: number, sc: number) => {
    if (r === sr || c === sc) return true;
    const boxR = Math.floor(r / 3);
    const boxC = Math.floor(c / 3);
    const sBoxR = Math.floor(sr / 3);
    const sBoxC = Math.floor(sc / 3);
    return boxR === sBoxR && boxC === sBoxC;
  }, []);

  const findConflicts = useCallback((board: number[][]) => {
    const newConflicts = new Set<string>();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = board[r][c];
        if (val === 0) continue;
        
        // Row/Col check
        for (let i = 0; i < 9; i++) {
          if (i !== c && board[r][i] === val) newConflicts.add(`${r}-${c}`);
          if (i !== r && board[i][c] === val) newConflicts.add(`${r}-${c}`);
        }
        
        // Box check
        const startR = r - r % 3, startC = c - c % 3;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const currR = startR + i;
            const currC = startC + j;
            if ((currR !== r || currC !== c) && board[currR][currC] === val) {
              newConflicts.add(`${r}-${c}`);
            }
          }
        }
      }
    }
    return newConflicts;
  }, []);

  const isValid = (board: number[][], row: number, col: number, num: number) => {
    for (let x = 0; x < 9; x++) if (board[row][x] === num) return false;
    for (let x = 0; x < 9; x++) if (board[x][col] === num) return false;
    let startRow = row - row % 3, startCol = col - col % 3;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (board[i + startRow][j + startCol] === num) return false;
    return true;
  };

  const solve = async () => {
    if (isSolving) return;
    
    // Check initial validity
    const initialConflicts = findConflicts(grid);
    if (initialConflicts.size > 0) {
      setStatusMsg("Fix conflicts before solving!");
      setConflicts(initialConflicts);
      return;
    }

    setIsSolving(true);
    setSolved(false);
    setSelectedCell(null);
    setConflicts(new Set());
    setStats({ steps: 0, backtracks: 0, time: 0 });
    terminateRef.current = false;
    
    const startTime = Date.now();
    timerRef.current = window.setInterval(() => {
      setStats(prev => ({ ...prev, time: (Date.now() - startTime) / 1000 }));
    }, 100);

    const board = grid.map(row => [...row]);

    const findEmpty = (b: number[][]) => {
      for (let r = 0; r < 9; r++)
        for (let c = 0; c < 9; c++)
          if (b[r][c] === 0) return [r, c];
      return null;
    };

    const backtrack = async (): Promise<boolean> => {
      if (terminateRef.current) return false;

      const empty = findEmpty(board);
      if (!empty) return true;
      const [r, c] = empty;
      setActiveCell([r, c]);
      setStatusMsg(`Checking cell [${r}, ${c}]...`);

      for (let num = 1; num <= 9; num++) {
        if (terminateRef.current) return false;

        setStats(prev => ({ ...prev, steps: prev.steps + 1 }));
        if (isValid(board, r, c, num)) {
          board[r][c] = num;
          setGrid(board.map(row => [...row]));
          
          const delay = Math.max(1, 100 - speedRef.current);
          await new Promise(res => setTimeout(res, delay));
          
          if (await backtrack()) return true;
          
          if (!terminateRef.current) {
            setStats(prev => ({ ...prev, backtracks: prev.backtracks + 1 }));
            board[r][c] = 0;
            setGrid(board.map(row => [...row]));
          }
        }
      }
      return false;
    };

    const result = await backtrack();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSolving(false);
    if (result && !terminateRef.current) {
      setSolved(true);
      setStatusMsg("Success! Puzzle solved.");
    } else {
      setStatusMsg(terminateRef.current ? "Solver terminated." : "No solution exists for this configuration.");
    }
    setActiveCell(null);
  };

  const handleTerminate = () => {
    terminateRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const loadPreset = (level: keyof typeof PRESETS) => {
    if (isSolving) return;
    const baseBoard = PRESETS[level].map(row => [...row]);
    const shuffledBoard = shuffleBoard(baseBoard);
    
    setStartingGrid(shuffledBoard);
    setGrid(shuffledBoard.map(row => [...row]));
    setCurrentDifficulty(level);
    setSolved(false);
    setConflicts(new Set());
    setStats({ steps: 0, backtracks: 0, time: 0 });
    setStatusMsg(`Loaded a fresh ${level} difficulty puzzle.`);
    setSelectedCell(null);
  };

  const reset = () => {
    if (isSolving) return;
    // Generate a fresh shuffle from the original base preset of current difficulty
    const baseBoard = PRESETS[currentDifficulty].map(row => [...row]);
    const shuffledBoard = shuffleBoard(baseBoard);
    
    setStartingGrid(shuffledBoard);
    setGrid(shuffledBoard.map(row => [...row]));
    setSolved(false);
    setConflicts(new Set());
    setStats({ steps: 0, backtracks: 0, time: 0 });
    setStatusMsg("Shuffled! New numbers at new places.");
    setSelectedCell(null);
  };

  const clear = () => {
    if (isSolving) return;
    const emptyGrid = Array(9).fill(0).map(() => Array(9).fill(0));
    setStartingGrid(emptyGrid);
    setGrid(emptyGrid);
    setSolved(false);
    setConflicts(new Set());
    setStats({ steps: 0, backtracks: 0, time: 0 });
    setStatusMsg("Grid cleared.");
    setSelectedCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
    if (isSolving || solved) return;

    let newVal = -1;
    if (e.key >= '1' && e.key <= '9') newVal = parseInt(e.key);
    else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') newVal = 0;

    if (newVal !== -1) {
      const newGrid = grid.map(row => [...row]);
      newGrid[r][c] = newVal;
      const newStarting = startingGrid.map(row => [...row]);
      newStarting[r][c] = newVal;
      setGrid(newGrid);
      setStartingGrid(newStarting);
      setConflicts(findConflicts(newGrid));
    } 
    else if (e.key === 'ArrowUp') setSelectedCell([Math.max(0, r - 1), c]);
    else if (e.key === 'ArrowDown') setSelectedCell([Math.min(8, r + 1), c]);
    else if (e.key === 'ArrowLeft') setSelectedCell([r, Math.max(0, c - 1)]);
    else if (e.key === 'ArrowRight') setSelectedCell([r, Math.min(8, c + 1)]);
    else if (e.key === 'Escape') setSelectedCell(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-16 px-4 md:px-6 space-y-8 md:space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white flex items-center justify-center space-x-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
            <Grid3X3 className="w-8 h-8 md:w-10 md:h-10 text-[#3d4977] dark:text-blue-400" />
          </div>
          <span>Sudoku Visualizer</span>
        </h1>
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-6 py-3 rounded-2xl inline-flex items-center space-x-3 shadow-sm">
          <Activity className={`w-4 h-4 ${isSolving ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} />
          <p className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300">
            {statusMsg}
          </p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Steps Taken', val: stats.steps, icon: <MousePointer2 className="w-4 h-4 text-blue-500" /> },
          { label: 'Backtracks', val: stats.backtracks, icon: <RotateCcw className="w-4 h-4 text-rose-500" /> },
          { label: 'Time Elapsed', val: `${stats.time.toFixed(1)}s`, icon: <Timer className="w-4 h-4 text-emerald-500" /> }
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">{s.icon}</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</span>
            </div>
            <span className="text-xl font-black text-slate-800 dark:text-white">{s.val}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
        {/* Sudoku Grid */}
        <div className="bg-slate-900 p-2 md:p-6 rounded-3xl shadow-2xl border-4 border-slate-800 w-full lg:w-auto overflow-hidden">
          <div className="grid grid-cols-9 gap-1 mx-auto">
            {grid.map((row, r) => (
              row.map((val, c) => {
                const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                const isActive = activeCell?.[0] === r && activeCell?.[1] === c;
                const isInitial = startingGrid[r][c] !== 0;
                const isConflict = conflicts.has(`${r}-${c}`);
                const isRelatedToSelection = selectedCell && isRelated(r, c, selectedCell[0], selectedCell[1]);
                
                return (
                  <button 
                    id={`cell-${r}-${c}`}
                    key={`${r}-${c}`}
                    onClick={() => !isSolving && setSelectedCell([r, c])}
                    onKeyDown={(e) => handleKeyDown(e, r, c)}
                    disabled={isSolving}
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-xs sm:text-base md:text-xl font-black rounded transition-all duration-200 outline-none
                      ${(r % 3 === 0 && r !== 0) ? 'mt-1' : ''}
                      ${(c % 3 === 0 && c !== 0) ? 'ml-1' : ''}
                      ${isActive ? 'bg-blue-500 text-white scale-110 z-30 shadow-lg' : 'bg-slate-800 text-slate-300'}
                      ${isRelatedToSelection && !isActive && !isSelected ? 'bg-slate-700/50' : ''}
                      ${isSelected ? 'ring-4 ring-blue-500 ring-inset bg-slate-700 text-white z-20' : ''}
                      ${isConflict ? 'bg-rose-900/40 text-rose-400 border border-rose-500/50' : ''}
                      ${isInitial ? 'text-blue-400' : ''}
                      ${solved && !isInitial ? 'text-emerald-400 bg-emerald-950/20' : ''}
                      ${!isSolving && !solved ? 'hover:bg-slate-700' : 'cursor-default'}
                    `}
                  >
                    {val !== 0 ? val : ''}
                  </button>
                );
              })
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6 w-full max-w-sm">
          {/* Difficulty Presets */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <Shuffle className="w-3 h-3" />
              <span>Difficulty Presets</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => loadPreset(level)}
                  disabled={isSolving}
                  className={`py-2.5 px-2 rounded-xl font-bold text-[10px] uppercase border transition-all disabled:opacity-50
                    ${currentDifficulty === level ? 'bg-[#3d4977] text-white border-[#3d4977]' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-blue-400'}
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest text-[10px]">Backtracking Speed</h3>
                <span className="text-[10px] font-black text-blue-500">{speed}%</span>
              </div>
              <input 
                type="range" min="1" max="99" value={speed} 
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#3d4977]"
              />
            </div>

            <div className="space-y-3">
              {isSolving ? (
                <button onClick={handleTerminate} className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-500/20">
                  <Square className="w-5 h-5" />
                  <span>Terminate Process</span>
                </button>
              ) : (
                <button onClick={solve} disabled={solved} className="w-full bg-[#3d4977] text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50 hover:bg-[#2d365a] transition-all hover:shadow-xl active:scale-95">
                  <Play className="w-5 h-5 fill-current" />
                  <span>{solved ? 'Solved' : 'Solve with AI'}</span>
                </button>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <button onClick={reset} disabled={isSolving} title="Shuffle current difficulty" className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-200 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 border border-slate-100 dark:border-slate-700 text-xs hover:bg-slate-100 transition-all group">
                  <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Shuffle</span>
                </button>
                <button onClick={clear} disabled={isSolving} className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-200 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 border border-slate-100 dark:border-slate-700 text-xs hover:text-rose-500">
                  <Trash2 className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] md:text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Expert Mode Guide</p>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Highlights show conflicts and peer cells. The AI uses <strong>Depth First Search</strong> with <strong>Constraint Propagation</strong> to find solutions.
              </p>
            </div>
          </div>

          <div className="p-5 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start space-x-3">
            <Keyboard className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] md:text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Interactive Input</p>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Click any cell to focus it. Use your <strong>Keyboard (1-9)</strong> to enter numbers directly, <strong>Arrows</strong> to navigate, or <strong>Backspace</strong> to clear values.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SudokuVisualizerDemo;
