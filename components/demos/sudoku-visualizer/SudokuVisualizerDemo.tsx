import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, RotateCcw, Zap, Grid3X3, Trash2, Shuffle, 
  Square, MousePointer2, Timer, Activity, BrainCircuit, 
  Trophy, X, BarChart2, GitBranch, Layers, AlertTriangle
} from 'lucide-react';

import { AlgorithmType, SimStats } from './types';
import { PRESETS } from './constants';
import { shuffleBoard, runSimulations, findEmptyCell, isValid } from './solver';

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
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('dfs');

  const [showModal, setShowModal] = useState(false);
  const [comparisonStats, setComparisonStats] = useState<{
    dfs: SimStats; bfs: SimStats; greedy: SimStats; mrv: SimStats; usedAlgorithm: AlgorithmType;
  } | null>(null);

  const terminateRef = useRef(false);
  const speedRef = useRef(speed);
  const timerRef = useRef<number | null>(null);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  const isEditable = (r: number, c: number) => startingGrid[r][c] === 0;

  const handleNumberPadInput = (num: number) => {
    if (!selectedCell || !isEditable(selectedCell[0], selectedCell[1])) return;
    const [r, c] = selectedCell;
    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      newGrid[r][c] = num;
      return newGrid;
    });
    setConflicts(findConflicts(grid));
  };

  const handleNumberPadClear = () => {
    if (!selectedCell || !isEditable(selectedCell[0], selectedCell[1])) return;
    const [r, c] = selectedCell;
    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      newGrid[r][c] = 0;
      return newGrid;
    });
    setConflicts(findConflicts(grid));
  };

  const isRelated = useCallback((r: number, c: number, sr: number, sc: number) => {
    if (r === sr || c === sc) return true;
    return Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3);
  }, []);

  const findConflicts = useCallback((board: number[][]) => {
    const newConflicts = new Set<string>();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = board[r][c];
        if (val === 0) continue;
        for (let i = 0; i < 9; i++) {
          if (i !== c && board[r][i] === val) newConflicts.add(`${r}-${c}`);
          if (i !== r && board[i][c] === val) newConflicts.add(`${r}-${c}`);
        }
        const startR = r - r % 3, startC = c - c % 3;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const currR = startR + i, currC = startC + j;
            if ((currR !== r || currC !== c) && board[currR][currC] === val) {
              newConflicts.add(`${r}-${c}`);
            }
          }
        }
      }
    }
    return newConflicts;
  }, []);

  const solve = async () => {
    if (isSolving) return;
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
    setShowModal(false);
    terminateRef.current = false;
    
    const activeAlgorithm = algorithm;
    const initialSolveGrid = grid.map(row => [...row]); 
    let currentSteps = 0, currentBacktracks = 0;
    
    const startTime = Date.now();
    timerRef.current = window.setInterval(() => {
      setStats(prev => ({ ...prev, time: (Date.now() - startTime) / 1000 }));
    }, 100);

    let finalSolved = false;
    const board = grid.map(row => [...row]);
    const delayAction = async () => {
      const d = Math.max(1, 100 - speedRef.current);
      await new Promise(res => setTimeout(res, d));
    };

    try {
      if (activeAlgorithm === 'dfs' || activeAlgorithm === 'mrv') {
        const bt = async (): Promise<boolean> => {
          if (terminateRef.current) return false;
          const empty = findEmptyCell(board, activeAlgorithm === 'mrv' ? 'mrv' : 'standard');
          if (!empty) return true;
          const [r, c] = empty;
          setActiveCell([r, c]);
          setStatusMsg(`Testing constraints at [${r}, ${c}]...`);

          for (let num = 1; num <= 9; num++) {
            if (terminateRef.current) return false;
            currentSteps++;
            setStats(prev => ({ ...prev, steps: currentSteps }));
            
            if (isValid(board, r, c, num)) {
              board[r][c] = num;
              setGrid(board.map(row => [...row]));
              await delayAction();
              
              if (await bt()) return true;
              
              if (!terminateRef.current) {
                currentBacktracks++;
                setStats(prev => ({ ...prev, backtracks: currentBacktracks }));
                board[r][c] = 0;
                setGrid(board.map(row => [...row]));
              }
            }
          }
          return false;
        };
        finalSolved = await bt();
      } 
      
      else if (activeAlgorithm === 'greedy') {
        let current = grid.map(row => [...row]);
        while (!terminateRef.current) {
          const empty = findEmptyCell(current, 'mrv');
          if (!empty) { finalSolved = true; break; }
          const [r, c] = empty;
          setActiveCell([r, c]);
          
          let placed = false;
          for (let num = 1; num <= 9; num++) {
            currentSteps++;
            setStats({ steps: currentSteps, backtracks: 0, time: 0 });
            if (isValid(current, r, c, num)) {
              current[r][c] = num;
              setGrid([...current]);
              placed = true;
              setStatusMsg(`Greedy pick ${num} at [${r}, ${c}]`);
              break; 
            }
          }
          await delayAction();
          if (!placed) {
            setStatusMsg("Greedy hit a dead end! Needs backtracking.");
            break;
          }
        }
      } 
      
      else if (activeAlgorithm === 'bfs') {
        let queue = [grid.map(row => [...row])];
        let maxQ = 1;
        while (queue.length > 0 && !terminateRef.current) {
          let current = queue.shift()!;
          currentSteps++;
          if (queue.length > maxQ) maxQ = queue.length;
          setStats(prev => ({ ...prev, steps: currentSteps, backtracks: queue.length })); 
          setGrid(current);
          
          const empty = findEmptyCell(current, 'standard');
          if (!empty) { finalSolved = true; break; }
          const [r, c] = empty;
          setActiveCell([r, c]);
          setStatusMsg(`BFS exploring... Queue size: ${queue.length}`);

          for (let num = 1; num <= 9; num++) {
            if (isValid(current, r, c, num)) {
              let next = current.map(row => [...row]);
              next[r][c] = num;
              queue.push(next);
            }
          }

          if (currentSteps > 3000) {
            setStatusMsg("BFS memory limit capped (3000+ states). Too slow!");
            break;
          }
          await delayAction();
        }
      }

    } catch (err) {
      console.error(err);
    }

    if (timerRef.current) clearInterval(timerRef.current);
    setIsSolving(false);
    setActiveCell(null);

    if (terminateRef.current) {
      setStatusMsg("Solver terminated.");
    } else if (finalSolved) {
      setSolved(true);
      setStatusMsg("Success! Puzzle solved.");
      const simResults = runSimulations(initialSolveGrid);
      setComparisonStats({ ...simResults, usedAlgorithm: activeAlgorithm });
      setTimeout(() => setShowModal(true), 500);
    } else {
      if (activeAlgorithm !== 'greedy' && activeAlgorithm !== 'bfs') {
        setStatusMsg("No solution exists for this configuration.");
      }
    }
  };

  const handleTerminate = () => {
    terminateRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const loadPreset = (level: keyof typeof PRESETS) => {
    if (isSolving) return;
    const shuffledBoard = shuffleBoard(PRESETS[level]);
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
    const shuffledBoard = shuffleBoard(PRESETS[currentDifficulty]);
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
    <div className="max-w-7xl mx-auto py-4 md:py-8 lg:py-10 px-3 sm:px-6 lg:px-8 space-y-5 lg:space-y-6 relative">
      
      {/* Header */}
      <div className="text-center space-y-3 lg:space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black text-slate-900 dark:text-white flex items-center justify-center space-x-2 sm:space-x-3">
          <div className="p-2 lg:p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl sm:rounded-2xl">
            <Grid3X3 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-[#3d4977] dark:text-blue-400" />
          </div>
          <span>Sudoku Visualizer</span>
        </h1>
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 sm:px-6 py-2 rounded-full sm:rounded-2xl inline-flex items-center space-x-2 sm:space-x-3 shadow-sm max-w-full overflow-hidden">
          <Activity className={`w-4 h-4 shrink-0 ${isSolving ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} />
          <p className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 truncate">
            {statusMsg}
          </p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        {[
          { label: 'Steps Taken', val: stats.steps.toLocaleString(), icon: <MousePointer2 className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" /> },
          { label: algorithm === 'bfs' ? 'Queue Size' : 'Backtracks', val: stats.backtracks.toLocaleString(), icon: <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5 text-rose-500" /> },
          { label: 'Time Elapsed', val: `${stats.time.toFixed(1)}s`, icon: <Timer className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-500" />, colSpan: "col-span-2 lg:col-span-1" }
        ].map((s, i) => (
          <div key={i} className={`bg-white dark:bg-slate-800 p-4 lg:p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col space-y-2 lg:space-y-3 overflow-hidden ${s.colSpan || ''}`}>
            <div className="flex items-center space-x-3 w-full">
              <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg shrink-0">
                {s.icon}
              </div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 truncate">
                {s.label}
              </span>
            </div>
            <div className="pt-1">
              <span className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter truncate block">
                {s.val}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-16 items-center lg:items-start justify-center">
        
        {/* Left Column: Sudoku Grid + Number Pad */}
        <div className="flex flex-col items-center shrink-0 w-full lg:w-auto">
          {/* Sudoku Grid Wrapper */}
          <div className="bg-slate-900 p-2 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border-4 border-slate-800">
            <div className="grid grid-cols-9 gap-[2px] sm:gap-1 md:gap-1.5 mx-auto">
              {grid.map((row, r) => (
                row.map((val, c) => {
                  const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                  const isActive = activeCell?.[0] === r && activeCell?.[1] === c;
                  const isInitial = startingGrid[r][c] !== 0;
                  const isConflict = conflicts.has(`${r}-${c}`);
                  const isRelatedToSelection = selectedCell && isRelated(r, c, selectedCell[0], selectedCell[1]);
                  
                  return (
                    <button 
                      id={`cell-${r}-${c}`} key={`${r}-${c}`}
                      onClick={() => !isSolving && setSelectedCell([r, c])}
                      onKeyDown={(e) => handleKeyDown(e, r, c)}
                      disabled={isSolving}
                      className={`
                        w-[9vw] h-[9vw] max-w-[2.5rem] max-h-[2.5rem] 
                        sm:max-w-none sm:max-h-none sm:w-10 sm:h-10 
                        md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14
                        flex items-center justify-center font-black rounded sm:rounded-md transition-all duration-200 outline-none
                        text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl
                        ${(r % 3 === 0 && r !== 0) ? 'mt-[2px] sm:mt-1.5 md:mt-2' : ''} 
                        ${(c % 3 === 0 && c !== 0) ? 'ml-[2px] sm:ml-1.5 md:ml-2' : ''}
                        ${isActive ? 'bg-blue-500 text-white scale-110 z-30 shadow-lg' : 'bg-slate-800 text-slate-300'}
                        ${isRelatedToSelection && !isActive && !isSelected ? 'bg-slate-700/50' : ''}
                        ${isSelected ? 'ring-2 sm:ring-4 ring-blue-500 ring-inset bg-slate-700 text-white z-20' : ''}
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

          {/* Responsive Number Pad */}
          {selectedCell && !isSolving && (
            <div className="mt-4 lg:mt-5 flex flex-col items-center animate-in fade-in zoom-in duration-200 w-full max-w-xs sm:max-w-sm">
              <div className="grid grid-cols-5 gap-2 w-full">
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <button key={n} onClick={() => handleNumberPadInput(n)} className="w-full aspect-square bg-slate-700 text-white font-bold rounded-lg sm:rounded-xl shadow hover:bg-blue-500 active:scale-95 transition-all text-sm sm:text-base lg:text-lg">
                    {n}
                  </button>
                ))}
                <button onClick={handleNumberPadClear} className="col-span-2 w-full h-full bg-rose-600 text-white font-bold rounded-lg sm:rounded-xl shadow hover:bg-rose-700 active:scale-95 transition-all text-sm sm:text-base lg:text-lg">
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Controls */}
        <div className="space-y-4 lg:space-y-5 w-full max-w-md lg:w-72 xl:w-80 shrink-0">
          
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 lg:p-5 xl:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl space-y-4">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <Shuffle className="w-3 h-3" /><span>Difficulty Presets</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map(level => (
                <button
                  key={level} onClick={() => loadPreset(level)} disabled={isSolving}
                  className={`py-2 px-1 sm:px-2 rounded-lg font-bold text-[10px] uppercase border transition-all disabled:opacity-50
                    ${currentDifficulty === level ? 'bg-[#3d4977] text-white border-[#3d4977]' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-blue-400'}
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 lg:p-5 xl:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl space-y-4 lg:space-y-5">
            <div className="space-y-3 lg:space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest text-[10px] sm:text-xs flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-[#3d4977] dark:text-blue-400" />
                <span>Solver Algorithm</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'dfs', name: 'DFS', icon: <GitBranch className="w-3 h-3"/> },
                  { id: 'bfs', name: 'BFS', icon: <Layers className="w-3 h-3"/> },
                  { id: 'greedy', name: 'Greedy', icon: <Zap className="w-3 h-3"/> },
                  { id: 'mrv', name: 'MRV', icon: <BrainCircuit className="w-3 h-3"/> }
                ].map(algo => (
                  <button
                    key={algo.id}
                    onClick={() => setAlgorithm(algo.id as AlgorithmType)}
                    disabled={isSolving}
                    className={`flex items-center justify-center space-x-1 lg:space-x-2 py-2.5 px-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all disabled:opacity-50 border 
                      ${algorithm === algo.id 
                        ? 'bg-[#3d4977] text-white border-[#3d4977] shadow-md' 
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
                  >
                    {algo.icon}
                    <span>{algo.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest text-[10px] sm:text-xs">Simulation Speed</h3>
                <span className="text-[10px] sm:text-xs font-black text-blue-500">{speed}%</span>
              </div>
              <input 
                type="range" min="1" max="99" value={speed} 
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 sm:h-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#3d4977]"
              />
            </div>

            <div className="space-y-3 pt-3 lg:pt-4 border-t border-slate-100 dark:border-slate-700">
              {isSolving ? (
                <button onClick={handleTerminate} className="w-full bg-rose-500 text-white py-3 sm:py-4 lg:py-3.5 xl:py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-500/20 text-sm">
                  <Square className="w-4 h-4" />
                  <span>Terminate Process</span>
                </button>
              ) : (
                <button onClick={solve} disabled={solved} className={`w-full text-white py-3 sm:py-4 lg:py-3.5 xl:py-4 rounded-xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50 transition-all hover:shadow-xl active:scale-95 bg-[#3d4977] hover:bg-[#2d365a] text-sm`}>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{solved ? 'Solved' : `Solve with ${algorithm.toUpperCase()}`}</span>
                </button>
              )}
              
              <div className="grid grid-cols-2 gap-2">
                <button onClick={reset} disabled={isSolving} className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-200 py-2.5 lg:py-3 rounded-lg font-bold flex items-center justify-center space-x-2 border border-slate-100 dark:border-slate-700 text-[10px] sm:text-xs hover:bg-slate-100 transition-all group">
                  <RotateCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Shuffle</span>
                </button>
                <button onClick={clear} disabled={isSolving} className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-200 py-2.5 lg:py-3 rounded-lg font-bold flex items-center justify-center space-x-2 border border-slate-100 dark:border-slate-700 text-[10px] sm:text-xs hover:text-rose-500">
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && comparisonStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl xl:max-w-5xl max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-[#3d4977] to-blue-600 p-4 sm:p-5 lg:p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2 sm:space-x-3 text-white">
                <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-base sm:text-xl lg:text-2xl font-black tracking-tight">Performance Comparison</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white transition-colors p-1">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-5 lg:p-6 space-y-4 lg:space-y-6 overflow-y-auto">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center">
                Detailed metrics on how each algorithm handled this specific board configuration:
              </p>

              <div className="w-full overflow-x-auto pb-2">
                <div className="min-w-[600px] bg-slate-50 dark:bg-slate-950 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <div className="grid grid-cols-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-slate-500">Metric</div>
                    <div className="p-3 sm:p-4 text-center border-l border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">DFS</div>
                    <div className="p-3 sm:p-4 text-center border-l border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-bold text-amber-600">BFS (Queue)</div>
                    <div className="p-3 sm:p-4 text-center border-l border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-bold text-purple-600">Greedy</div>
                    <div className="p-3 sm:p-4 text-center border-l border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-bold text-emerald-600">MRV Heuristic</div>
                  </div>
                  
                  <div className="grid grid-cols-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="p-3 sm:p-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase flex items-center">Status</div>
                    <div className={`p-3 sm:p-4 text-center text-xs sm:text-sm font-bold border-l border-slate-100 dark:border-slate-800 ${comparisonStats.dfs.solved ? 'text-emerald-500' : 'text-rose-500'}`}>{comparisonStats.dfs.solved ? 'Solved' : 'Failed'}</div>
                    <div className={`p-3 sm:p-4 text-center text-xs sm:text-sm font-bold border-l border-slate-100 dark:border-slate-800 ${comparisonStats.bfs.solved ? 'text-emerald-500' : 'text-rose-500'}`}>{comparisonStats.bfs.solved ? 'Solved' : 'OOM'}</div>
                    <div className={`p-3 sm:p-4 text-center text-xs sm:text-sm font-bold border-l border-slate-100 dark:border-slate-800 ${comparisonStats.greedy.solved ? 'text-emerald-500' : 'text-rose-500'}`}>{comparisonStats.greedy.solved ? 'Solved' : 'Stuck'}</div>
                    <div className={`p-3 sm:p-4 text-center text-xs sm:text-sm font-bold border-l border-slate-100 dark:border-slate-800 ${comparisonStats.mrv.solved ? 'text-emerald-500' : 'text-rose-500'}`}>{comparisonStats.mrv.solved ? 'Solved' : 'Failed'}</div>
                  </div>

                  <div className="grid grid-cols-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="p-3 sm:p-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase flex items-center">Steps Taken</div>
                    <div className="p-3 sm:p-4 text-center text-xs sm:text-sm font-medium border-l border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">{comparisonStats.dfs.steps.toLocaleString()}</div>
                    <div className="p-3 sm:p-4 text-center text-xs sm:text-sm font-medium border-l border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">{comparisonStats.bfs.steps.toLocaleString()}{!comparisonStats.bfs.solved && '+'}</div>
                    <div className="p-3 sm:p-4 text-center text-xs sm:text-sm font-medium border-l border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">{comparisonStats.greedy.steps.toLocaleString()}</div>
                    <div className={`p-3 sm:p-4 text-center text-xs sm:text-sm font-black border-l border-slate-100 dark:border-slate-800 ${comparisonStats.mrv.steps <= comparisonStats.dfs.steps ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>{comparisonStats.mrv.steps.toLocaleString()}</div>
                  </div>

                  <div className="grid grid-cols-5">
                    <div className="p-3 sm:p-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase flex flex-col justify-center">Backtracks <span className="text-[8px] sm:text-[9px] font-normal normal-case opacity-70">(Max Q for BFS)</span></div>
                    <div className="p-3 sm:p-4 text-center text-xs sm:text-sm font-medium border-l border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">{comparisonStats.dfs.backtracks.toLocaleString()}</div>
                    <div className="p-3 sm:p-4 text-center text-xs sm:text-sm font-medium border-l border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">{comparisonStats.bfs.backtracks.toLocaleString()}</div>
                    <div className="p-3 sm:p-4 text-center text-xs sm:text-sm font-medium border-l border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">0</div>
                    <div className={`p-3 sm:p-4 text-center text-xs sm:text-sm font-black border-l border-slate-100 dark:border-slate-800 ${comparisonStats.mrv.backtracks <= comparisonStats.dfs.backtracks ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>{comparisonStats.mrv.backtracks.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {!comparisonStats.bfs.solved && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-3 sm:p-4 rounded-xl flex items-start space-x-3 border border-amber-100 dark:border-amber-800/30">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm leading-relaxed"><strong>Why BFS failed:</strong> Sudoku has a massive branching factor. Breadth-First Search tries to explore every single valid path layer by layer. For standard Sudokus, this consumes gigabytes of memory almost instantly.</p>
                  </div>
                )}
                
                {!comparisonStats.greedy.solved && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 p-3 sm:p-4 rounded-xl flex items-start space-x-3 border border-purple-100 dark:border-purple-800/30">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm leading-relaxed"><strong>Why Greedy got stuck:</strong> A pure Greedy algorithm takes the best available choice at the moment but <em>refuses to backtrack</em>. If it makes a mistake early on, it inevitably hits a dead end.</p>
                  </div>
                )}

                {comparisonStats.dfs.steps > comparisonStats.mrv.steps && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-3 sm:p-4 rounded-xl flex items-start space-x-3 border border-emerald-100 dark:border-emerald-800/30">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-sm block">MRV is the clear winner!</span>
                      <span className="text-xs sm:text-sm opacity-90 block mt-1 leading-relaxed">
                        By prioritizing the most constrained cells first, MRV required incredibly fewer steps to find the solution compared to naive DFS.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
              <button onClick={() => setShowModal(false)} className="px-5 sm:px-6 py-2 sm:py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudokuVisualizerDemo;