import { useCallback, useEffect, useState } from 'react';

/**
 * Tiny hash router for case-study pages: #/work/<project-id>.
 * No router library needed, links are shareable, and the browser Back button closes the page.
 */
const parse = (): string | null => {
  const m = /^#\/work\/([\w-]+)$/.exec(window.location.hash);
  return m ? m[1] : null;
};

export function useStudyRoute() {
  const [id, setId] = useState<string | null>(parse);

  useEffect(() => {
    const onChange = () => setId(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const close = useCallback(() => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setId(null);
  }, []);

  return { id, close };
}

export const studyHref = (id: string) => `#/work/${id}`;
