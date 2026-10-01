import React, { useEffect, useState } from 'react';

/** Types and erases a list of phrases. Shows the first phrase, still, when reduced motion is requested. */
const Typed: React.FC<{ words: readonly string[]; className?: string }> = ({ words, className = 'text-neutral-950 dark:text-white' }) => {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [i, setI] = useState(0);
  const [n, setN] = useState(reduce ? words[0].length : 0);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const word = words[i];
    let t: number;
    if (!erasing && n < word.length) t = window.setTimeout(() => setN(n + 1), 70);
    else if (!erasing) t = window.setTimeout(() => setErasing(true), 1600);
    else if (n > 0) t = window.setTimeout(() => setN(n - 1), 35);
    else {
      setErasing(false);
      setI((i + 1) % words.length);
      return;
    }
    return () => window.clearTimeout(t);
  }, [i, n, erasing, reduce, words]);

  return (
    <>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden className={className}>
        {words[i].slice(0, n)}
        <span className="caret" />
      </span>
    </>
  );
};

export default Typed;
