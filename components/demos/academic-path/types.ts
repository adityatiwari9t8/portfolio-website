export interface RoadmapModule {
  phase: string;
  subject: string;
  effort: string;
  color: string;
  desc: string;
  details: {
    objectives: string[];
    topics: string[];
    resources: string[];
  };
}

export interface SubjectModel {
  name: string;
  level: 'bridge' | 'core' | 'advanced';
  requires: string[];
  triggers: string[];
  color: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}