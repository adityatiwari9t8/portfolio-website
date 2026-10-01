export type Level = 'bridge' | 'core' | 'advanced';

export interface Resource {
  title: string;
  url: string;
  kind: string;
}

export interface SubjectModel {
  name: string;
  level: Level;
  /** Skills or other subject names that should come first. */
  requires: string[];
  /** Skills that put this subject on your path. */
  triggers: string[];
  color: string;
  summary: string;
  objectives: string[];
  topics: string[];
  resources: Resource[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface PathModule {
  subject: SubjectModel;
  /** "focus": your picks point at it. "prerequisite": pulled in because something on your path needs it. */
  role: 'focus' | 'prerequisite';
  /** Picked skills that triggered it, or the subjects that need it. */
  because: string[];
  /** Required skills that have no subject of their own, to review first. */
  gaps: string[];
  /** Subjects that list this one as a prerequisite. */
  unlocks: string[];
}

export interface Roadmap {
  modules: PathModule[];
  /** Picked skills that neither trigger a subject nor satisfy a prerequisite. */
  unmapped: string[];
}
