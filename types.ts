
// Import React to ensure React namespace is available for ReactNode types
import React from 'react';

export interface Project {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  icon: React.ReactNode;
  githubUrl?: string;
  liveUrl?: string;
  quickView?: boolean;
}

export interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
}

export interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  location: string;
  coursework: string[];
}