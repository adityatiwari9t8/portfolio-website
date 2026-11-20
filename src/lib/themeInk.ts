import inkFieldUrl from './theme-ink.webp';

const COLUMNS = 10;
const ROWS = 6;
const FRAME_COUNT = COLUMNS * ROWS;
let inkFieldReady = false;
let inkFieldLoading = false;

// Decode the raster mask ahead of time so the transition can start on the first click.
export function preloadThemeInk() {
  if (inkFieldReady || inkFieldLoading || !CSS.supports('mask-image', 'url("mask.webp")')) return;
  inkFieldLoading = true;
  const image = new Image();
  image.src = inkFieldUrl;
  void image.decode().then(() => { inkFieldReady = true; }, () => undefined)
    .finally(() => { inkFieldLoading = false; });
}

export function createThemeInk(origin?: { x: number; y: number }) {
  if (!inkFieldReady) {
    preloadThemeInk();
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const toggle = origin ? null : document.querySelector('.theme-toggle')?.getBoundingClientRect();
  const x = origin?.x ?? (toggle ? toggle.left + toggle.width / 2 : width / 2);
  const y = origin?.y ?? (toggle ? toggle.top + toggle.height / 2 : height / 2);
  const radius = Math.ceil(Math.hypot(Math.max(x, width - x), Math.max(y, height - y))) + 2;
  const diameter = radius * 2;
  const style = document.createElement('style');

  // Bitmap frames let WebKit animate a CSS mask without repainting an inline SVG filter.
  const frames = Array.from({ length: FRAME_COUNT }, (_, index) => {
    const left = x - radius - (index % COLUMNS) * diameter;
    const top = y - radius - Math.floor(index / COLUMNS) * diameter;
    return `${(100 * index / (FRAME_COUNT - 1)).toFixed(4)}% { mask-position: ${left}px ${top}px; }`;
  });
  style.textContent = `
    .vt-theme-ink::view-transition-old(root) {
      mask-image: url("${inkFieldUrl}");
      mask-size: ${diameter * COLUMNS}px ${diameter * ROWS}px;
    }
    @keyframes theme-ink-frames { ${frames.join('\n')} }
  `;
  document.head.append(style);

  return () => style.remove();
}
