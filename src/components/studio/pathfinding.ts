export const columns = 11;
export const rows = 7;

export type Algorithm = 'astar' | 'bfs';
export type Board = { start: number; finish: number; walls: ReadonlySet<number> };
type Search = { visited: number[]; path: number[] };

export const exampleBoard: Board = {
  start: 3 * columns + 1,
  finish: 3 * columns + 9,
  walls: new Set([7, 15, 18, 26, 37, 48, 51, 59, 62, 73]),
};

export function findRoute({ start, finish, walls }: Board, algorithm: Algorithm): Search {
  const frontier = [start];
  const previous = new Map<number, number>();
  const distances = new Map([[start, 0]]);
  const visited: number[] = [];

  const estimate = (cell: number) =>
    Math.abs(cell % columns - finish % columns) +
    Math.abs(Math.floor(cell / columns) - Math.floor(finish / columns));

  while (frontier.length) {
    // For this grid, a linear scan keeps A* simple. BFS reads the same queue in arrival order.
    let next = 0;
    if (algorithm === 'astar') {
      for (let i = 1; i < frontier.length; i++) {
        const candidate = frontier[i];
        const best = frontier[next];
        const candidateEstimate = estimate(candidate);
        const bestEstimate = estimate(best);
        const difference = distances.get(candidate)! + candidateEstimate - distances.get(best)! - bestEstimate;
        if (difference < 0 || (difference === 0 && candidateEstimate < bestEstimate)) next = i;
      }
    }

    const [cell] = frontier.splice(next, 1);
    visited.push(cell);
    if (cell === finish) {
      const path = [finish];
      for (let step = finish; step !== start;) {
        step = previous.get(step)!;
        path.push(step);
      }
      return { visited, path: path.reverse() };
    }

    const column = cell % columns;
    const neighbors = [
      column > 0 ? cell - 1 : -1,
      column < columns - 1 ? cell + 1 : -1,
      cell - columns,
      cell + columns,
    ];
    const distance = distances.get(cell)! + 1;
    for (const neighbor of neighbors) {
      if (neighbor < 0 || neighbor >= columns * rows || walls.has(neighbor)) continue;
      if (distance >= (distances.get(neighbor) ?? Infinity)) continue;
      distances.set(neighbor, distance);
      previous.set(neighbor, cell);
      if (!frontier.includes(neighbor)) frontier.push(neighbor);
    }
  }

  return { visited, path: [] };
}
