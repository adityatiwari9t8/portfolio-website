import { SimStats } from './types';

export const shuffleBoard = (board: number[][]): number[][] => {
  let newBoard = board.map(row => [...row]);

  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  const mapping: { [key: number]: number } = { 0: 0 };
  for (let i = 0; i < 9; i++) mapping[i + 1] = nums[i];
  newBoard = newBoard.map(row => row.map(val => mapping[val]));

  for (let band = 0; band < 3; band++) {
    const rows = [0, 1, 2].sort(() => Math.random() - 0.5);
    const bandBase = band * 3;
    const tempRows = rows.map(r => [...newBoard[bandBase + r]]);
    for (let i = 0; i < 3; i++) newBoard[bandBase + i] = tempRows[i];
  }
  for (let stack = 0; stack < 3; stack++) {
    const cols = [0, 1, 2].sort(() => Math.random() - 0.5);
    const stackBase = stack * 3;
    for (let r = 0; r < 9; r++) {
      const tempRowVals = cols.map(c => newBoard[r][stackBase + c]);
      for (let i = 0; i < 3; i++) newBoard[r][stackBase + i] = tempRowVals[i];
    }
  }

  return newBoard;
};

export const isValid = (board: number[][], row: number, col: number, num: number) => {
  for (let x = 0; x < 9; x++) if (board[row][x] === num) return false;
  for (let x = 0; x < 9; x++) if (board[x][col] === num) return false;
  let startRow = row - row % 3, startCol = col - col % 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[i + startRow][j + startCol] === num) return false;
  return true;
};

export const getValidOptionsCount = (board: number[][], row: number, col: number) => {
  let count = 0;
  for (let num = 1; num <= 9; num++) if (isValid(board, row, col, num)) count++;
  return count;
};

export const findEmptyCell = (b: number[][], type: 'standard' | 'mrv') => {
  if (type === 'standard') {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (b[r][c] === 0) return [r, c];
    return null;
  } else {
    let minOptions = 10;
    let bestCell = null;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] === 0) {
          const options = getValidOptionsCount(b, r, c);
          if (options < minOptions) {
            minOptions = options;
            bestCell = [r, c];
            if (options <= 1) return bestCell;
          }
        }
      }
    }
    return bestCell;
  }
};

export const runSimulations = (initialBoard: number[][]) => {
  const simulateDFS = (board: number[][], isMRV: boolean): SimStats => {
    let b = board.map(row => [...row]);
    let steps = 0, backtracks = 0;
    const bt = (): boolean => {
      const empty = findEmptyCell(b, isMRV ? 'mrv' : 'standard');
      if (!empty) return true;
      const [r, c] = empty;
      for (let num = 1; num <= 9; num++) {
        steps++;
        if (isValid(b, r, c, num)) {
          b[r][c] = num;
          if (bt()) return true;
          backtracks++;
          b[r][c] = 0;
        }
      }
      return false;
    };
    const solved = bt();
    return { steps, backtracks, solved };
  };

  const simulateGreedy = (board: number[][]): SimStats => {
    let b = board.map(row => [...row]);
    let steps = 0;
    while (true) {
      const empty = findEmptyCell(b, 'mrv');
      if (!empty) return { steps, backtracks: 0, solved: true };
      const [r, c] = empty;
      let placed = false;
      for (let num = 1; num <= 9; num++) {
        steps++;
        if (isValid(b, r, c, num)) {
          b[r][c] = num;
          placed = true;
          break; 
        }
      }
      if (!placed) return { steps, backtracks: 0, solved: false };
    }
  };

  const simulateBFS = (board: number[][]): SimStats => {
    let queue = [board.map(row => [...row])];
    let steps = 0, maxQueue = 0;
    const MAX_BFS_STEPS = 3000; 
    while (queue.length > 0) {
      if (steps > MAX_BFS_STEPS) return { steps, backtracks: maxQueue, solved: false };
      let current = queue.shift()!;
      steps++;
      const empty = findEmptyCell(current, 'standard');
      if (!empty) return { steps, backtracks: maxQueue, solved: true };
      const [r, c] = empty;
      for (let num = 1; num <= 9; num++) {
        if (isValid(current, r, c, num)) {
          let next = current.map(row => [...row]);
          next[r][c] = num;
          queue.push(next);
        }
      }
      if (queue.length > maxQueue) maxQueue = queue.length;
    }
    return { steps, backtracks: maxQueue, solved: false };
  };

  return {
    dfs: simulateDFS(initialBoard, false),
    mrv: simulateDFS(initialBoard, true),
    greedy: simulateGreedy(initialBoard),
    bfs: simulateBFS(initialBoard)
  };
};