import React from 'react';

/* ================= PROJECT ================= */
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;

  // images for light & dark mode
  imageLight: string;
  imageDark: string;
}

/* ================= SKILLS ================= */
export interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
}

/* ================= SERVICES ================= */
export interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
}

/* ================= EDUCATION ================= */
export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  location: string;
  coursework: string[];
}