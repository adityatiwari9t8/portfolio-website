import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { Flag, MapPin, Play, RotateCcw, Square } from 'lucide-react';
import { columns, exampleBoard, findRoute, rows, type Algorithm } from './pathfinding';
import './pathfinding.css';

const tools = [
  { id: 'wall', label: 'Walls', Icon: Square },
  { id: 'start', label: 'Start', Icon: MapPin },
  { id: 'finish', label: 'Finish', Icon: Flag },
] as const;
type Tool = typeof tools[number]['id'];

const keyDirections = new Map<string, [number, number]>([
  ['ArrowUp', [-1, 0]],
  ['ArrowDown', [1, 0]],
  ['ArrowLeft', [0, -1]],
  ['ArrowRight', [0, 1]],
]);

export default function PathfindingSection() {
  const [board, setBoard] = useState(exampleBoard);
  const [tool, setTool] = useState<Tool>('wall');
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar');
  const [focusCell, setFocusCell] = useState(exampleBoard.start);
  const [search, setSearch] = useState<ReturnType<typeof findRoute> | null>(null);
  const [visible, setVisible] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const stroke = useRef<{ id: number; start: number; wall: boolean; dragged: boolean } | null>(null);

  const visitedCount = Math.min(visible, search?.visited.length ?? 0);
  const pathCount = visible - visitedCount;
  const visited = new Set(search?.visited.slice(0, visitedCount));
  const path = new Set(search?.path.slice(0, pathCount));
  const running = !!search && visible < search.visited.length + search.path.length;
  const finished = !!search && !running;

  useEffect(() => {
    if (!search) return;
    const { visited, path } = search;
    const visitedInterval = 20;
    const routeInterval = 38;
    let startTime: number | undefined;
    let frame = 0;
    const reveal = (now: number) => {
      startTime ??= now;
      const elapsed = now - startTime;
      const visitedSteps = Math.min(visited.length, 1 + Math.floor(elapsed / visitedInterval));
      const pathSteps = Math.min(path.length, Math.max(0, Math.floor((elapsed - visited.length * visitedInterval) / routeInterval)));
      setVisible(visitedSteps + pathSteps);
      if (visitedSteps + pathSteps < visited.length + path.length) frame = requestAnimationFrame(reveal);
    };
    frame = requestAnimationFrame(reveal);
    return () => cancelAnimationFrame(frame);
  }, [search]);

  function clearResult() {
    setSearch(null);
    setVisible(0);
  }

  function paintWall(cell: number, wall: boolean) {
    if (cell === board.start || cell === board.finish) return;
    setBoard(current => {
      if (current.walls.has(cell) === wall) return current;
      const walls = new Set(current.walls);
      if (wall) walls.add(cell);
      else walls.delete(cell);
      return { ...current, walls };
    });
    clearResult();
  }

  function selectCell(event: MouseEvent<HTMLButtonElement>, cell: number) {
    const dragged = stroke.current?.dragged;
    stroke.current = null;
    if (dragged && event.detail !== 0) return;
    if (tool === 'wall') {
      paintWall(cell, !board.walls.has(cell));
      return;
    }
    if (cell === board.start || cell === board.finish) return;
    setBoard(current => {
      const walls = new Set(current.walls);
      walls.delete(cell);
      return { ...current, [tool]: cell, walls };
    });
    clearResult();
  }

  function beginStroke(event: PointerEvent<HTMLButtonElement>, cell: number) {
    stroke.current = null;
    if (tool !== 'wall' || event.pointerType !== 'mouse' || event.button !== 0 ||
        cell === board.start || cell === board.finish) return;
    stroke.current = { id: event.pointerId, start: cell, wall: !board.walls.has(cell), dragged: false };
  }

  function continueStroke(event: PointerEvent<HTMLButtonElement>, cell: number) {
    const brush = stroke.current;
    if (!brush || event.pointerId !== brush.id || event.buttons !== 1) return;
    if (!brush.dragged) {
      if (cell === brush.start) return;
      brush.dragged = true;
      paintWall(brush.start, brush.wall);
    }
    paintWall(cell, brush.wall);
  }

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, row: number, column: number) {
    const direction = keyDirections.get(event.key);
    if (!direction) return;
    event.preventDefault();
    const [dy, dx] = direction;
    const nextRow = row + dy;
    const nextColumn = column + dx;
    if (nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns) return;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-cell="${nextRow * columns + nextColumn}"]`)?.focus();
  }

  function runSearch() {
    setVisible(0);
    setSearch(findRoute(board, algorithm));
  }

  return (
    <section id="playground" className="content-width pathfinding-section" aria-labelledby="pathfinding-heading">
      <header className="profile-section-heading pathfinding-heading" data-scroll-reveal>
        <div>
          <h2 id="pathfinding-heading">Pathfinding playground</h2>
          <p id="pathfinding-help">Draw walls, move the endpoints, and see how the search finds a route.</p>
        </div>
      </header>
      <div className="pathfinding-workbench">
        <fieldset className="route-options pathfinding-tools" data-scroll-reveal>
          <legend>Edit grid</legend>
          <div className="route-choices">
            {tools.map(({ id, label, Icon }) => (
              <label key={id} className="route-choice">
                <input className="sr-only" type="radio" name="route-tool" checked={tool === id} onChange={() => setTool(id)} />
                <Icon aria-hidden="true" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="pathfinding-board">
          <p className="sr-only" id="route-grid-help">Use arrow keys to move between cells. Press Enter or Space to use the selected editing tool.</p>
          <div className="route-grid" role="grid" aria-label="Route grid" aria-describedby="pathfinding-help route-grid-help"
            style={{ '--route-columns': columns } as CSSProperties} data-scroll-reveal="depth" ref={gridRef}>
            {Array.from({ length: rows }, (_, row) => (
              <div role="row" className="route-row" key={row}>
                {Array.from({ length: columns }, (_, column) => {
                  const cell = row * columns + column;
                  const state = cell === board.start ? 'start' : cell === board.finish ? 'finish' :
                    board.walls.has(cell) ? 'wall' : path.has(cell) ? 'route' : visited.has(cell) ? 'visited' : 'empty';
                  const Icon = state === 'start' ? MapPin : state === 'finish' ? Flag : null;
                  return (
                    <div role="gridcell" key={column}>
                      <button type="button" data-cell={cell} data-state={state} className="route-cell"
                        aria-label={`Row ${row + 1}, column ${column + 1}, ${state}`} tabIndex={focusCell === cell ? 0 : -1}
                        onFocus={() => setFocusCell(cell)} onKeyDown={event => moveFocus(event, row, column)}
                        onPointerDown={event => beginStroke(event, cell)} onPointerEnter={event => continueStroke(event, cell)}
                        onClick={event => selectCell(event, cell)}>
                        {Icon && <Icon aria-hidden="true" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <ul className="route-legend" aria-label="Grid colors" role="list" data-scroll-reveal>
            <li><span data-state="wall" aria-hidden="true" /> Wall</li>
            <li><span data-state="visited" aria-hidden="true" /> Explored</li>
            <li><span data-state="route" aria-hidden="true" /> Route</li>
          </ul>
        </div>
        <div className="pathfinding-controls" data-scroll-reveal>
          <fieldset className="route-options">
            <legend>Search algorithm</legend>
            <div className="route-choices">
              <label className="route-choice">
                <input className="sr-only" type="radio" name="route-algorithm" checked={algorithm === 'astar'} onChange={() => { setAlgorithm('astar'); clearResult(); }} />
                A*
              </label>
              <label className="route-choice">
                <input className="sr-only" type="radio" name="route-algorithm" checked={algorithm === 'bfs'} onChange={() => { setAlgorithm('bfs'); clearResult(); }} />
                Breadth-first
              </label>
            </div>
          </fieldset>
          <p className="route-description">
            {algorithm === 'astar' ? 'A* estimates the distance to the finish to decide what to explore next.'
              : 'Breadth-first search checks cells in layers outward from the start.'}
          </p>
          <button type="button" className="studio-button primary route-run" onClick={runSearch} disabled={running}>
            <Play aria-hidden="true" /> {running ? 'Searching…' : 'Find route'}
          </button>
          <div className="route-actions">
            <button type="button" onClick={() => { setBoard(current => ({ ...current, walls: new Set() })); clearResult(); }} disabled={!board.walls.size}>
              Clear walls
            </button>
            <button type="button" onClick={() => { setBoard(exampleBoard); clearResult(); }}>
              <RotateCcw aria-hidden="true" /> Reset grid
            </button>
          </div>
          <dl className="route-stats">
            <div><dt>Cells explored</dt><dd>{search ? visitedCount : '–'}</dd></div>
            <div><dt>Route length</dt><dd>{finished && search.path.length ? `${search.path.length - 1} steps` : '–'}</dd></div>
          </dl>
          <p className="route-status" role="status">
            {finished && (search.path.length ? `Route found in ${search.path.length - 1} steps.` : 'No route found. Move an endpoint or remove a wall.')}
          </p>
        </div>
      </div>
    </section>
  );
}
