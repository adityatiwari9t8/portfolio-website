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
