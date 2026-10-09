import { NAV } from '../data/site';
import { PROJECTS } from '../data/projects';

/**
 * The page sections shown in navigation, in order. "Work" appears once there is at least one
 * project; until then "Building" stands in for it. Contact is always last.
 */
export const SECTIONS: { id: string; label: string }[] = [
  ...NAV.filter((n) => (n.id === 'work' ? PROJECTS.length > 0 : n.id === 'building' ? PROJECTS.length === 0 : true)),
  { id: 'contact', label: 'Contact' }
];

/** "01", "02", ... for a section id, so the nav and the section headings always agree. */
export const sectionNumber = (id: string) => {
  const i = SECTIONS.findIndex((s) => s.id === id);
  return i < 0 ? '' : String(i + 1).padStart(2, '0');
};
