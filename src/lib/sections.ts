import { NAV } from '../data/site';
import { CERTIFICATIONS } from '../data/content';
import { PROJECTS } from '../data/projects';

/**
 * The page sections shown in navigation, in order. "Work" appears once there is at least one
 * project; until then "Building" stands in for it. Contact is always last.
 */
export const SECTIONS: { id: string; label: string }[] = [
  ...NAV.filter((n) => (n.id === 'work' ? PROJECTS.length > 0 : n.id === 'building' ? PROJECTS.length === 0 : true)),
  ...(CERTIFICATIONS.length ? [{ id: 'certifications', label: 'Certifications' }] : []),
  { id: 'contact', label: 'Contact' }
];
