import React from 'react';
import Tilt from './Tilt';

interface HeadlineProps {
  as?: 'h1' | 'h2' | 'p';
  before: string;
  accent: string;
  after?: string;
  className?: string;
  /** Maximum tilt in degrees while the pointer is over the heading. */
  max?: number;
  /** Scales how far apart the words sit in depth. Use less on small headings or ones inside a tilting card. */
  depth?: number;
  /** How far (px) the heading rises toward you on hover. */
  lift?: number;
}

/** Depth (px) of each word; the italic accent word floats furthest forward. */
const DEPTHS = [10, 18, 14];
const ACCENT_DEPTH = 34;

/**
 * Display heading with 3D behaviour: the words flip up into place when it scrolls into view
 * (inside a Reveal), then the whole line tilts with the mouse and its words sit at different
 * depths, so they slide against each other. Headings only; body copy stays flat for reading.
 */
const Headline: React.FC<HeadlineProps> = ({ as: Tag = 'h2', before, accent, after, className = '', max = 6, depth = 1, lift = 34 }) => {
  let i = 0;
  const words = (text: string, cls = '', z?: number) =>
    text
      .split(' ')
      .filter(Boolean)
      .map((w) => {
        const n = i++;
        return (
          <React.Fragment key={`${w}-${n}`}>
            <span
              className={`w3d flip-word ${cls}`}
              style={{ '--i': n, '--z': (z ?? DEPTHS[n % DEPTHS.length]) * depth } as React.CSSProperties}
            >
              {w}
            </span>{' '}
          </React.Fragment>
        );
      });

  return (
    <Tilt shadow={false} hint={false} max={max} scale={1.02} lift={lift}>
      <Tag className={`preserve-3d ${className}`}>
        {words(before)}
        {words(accent, 'accent text-[1.1em]', ACCENT_DEPTH)}
        {after ? words(after) : null}
      </Tag>
    </Tilt>
  );
};

export default Headline;
