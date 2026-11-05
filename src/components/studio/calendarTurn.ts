// Only the sheet in flight needs a flexible surface. Each band shows its slice
// of the printed face; the opposite side is plain paper.
const BAND_COUNT = 12;
const radians = Math.PI / 180;

export function createCalendarLeaf(layer: HTMLDivElement, face: HTMLElement, height: number) {
  const bandHeight = height / BAND_COUNT;
  const bands: HTMLDivElement[] = [];
  const fragment = document.createDocumentFragment();
  layer.style.setProperty('--leaf-height', `${height}px`);

  for (let index = 0; index < BAND_COUNT; index++) {
    const band = document.createElement('div');
    band.className = 'calendar-band';
    band.style.height = `${bandHeight + 0.45}px`;
    const front = document.createElement('div');
    front.className = 'calendar-band-front';
    const print = face.cloneNode(true) as HTMLElement;
    print.style.top = `${-index * bandHeight}px`;
    front.append(print);
    const back = document.createElement('div');
    back.className = 'calendar-band-back';
    band.append(front, back);
    bands.push(band);
    fragment.append(band);
  }
  layer.replaceChildren(fragment);

  return function turnLeaf(turn: number, rearDepth: number) {
    let y = 0;
    let z = 0;
    const angle = 2 * Math.PI * turn;
    const bindingRadius = 7;
    const overhead = Math.min(height * .22, 88);
    const aroundRing = -bindingRadius * (1 - Math.cos(angle));
    // The free edge leads the turn. Above the rings the paper bows away
    // from the viewer, then straightens as it hangs down the back.
    const projectY = (position: number) => position >= 0 ? position : overhead * Math.expm1(position / overhead);
    for (const [index, band] of bands.entries()) {
      const along = (index + .5) / BAND_COUNT;
      const pitch = angle + 55 * radians * Math.sin(Math.PI * turn) * (along - .35);
      const nextY = y + bandHeight * Math.cos(pitch);
      const nextZ = z + bandHeight * Math.sin(pitch);
      const dy = projectY(nextY) - projectY(y);
      const dz = nextZ - z;
      band.style.transform = `translate3d(0,${projectY(y) + aroundRing - 5 * rearDepth * turn}px,${z - 22 * rearDepth * turn}px) rotateX(${Math.atan2(dz, dy)}rad) scaleY(${Math.hypot(dy, dz) / bandHeight})`;
      band.style.setProperty('--fold-shadow', String(.08 + .16 * Math.abs(Math.sin(pitch))));
      y = nextY;
      z = nextZ;
    }
  };
}
