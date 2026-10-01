/**
 * Single place for the personal details used across the site.
 * Change a value here and it updates everywhere.
 */
export const SITE = {
  name: 'Aditya Tiwari',
  firstName: 'Aditya',
  // Where the "Get in touch" form sends mail (opens the visitor's email app).
  email: 'adityatiwari.connect@gmail.com',
  status: 'Open to internships & opportunities',
  resume: '/resume.pdf',
  socials: {
    github: 'https://github.com/adityatiwari9t8',
    linkedin: 'https://www.linkedin.com/in/adityatiwari9t8',
    instagram: 'https://www.instagram.com/adityatiwari_98',
    leetcode: 'https://leetcode.com/Aditya_Tiwari_98/'
  }
} as const;

export const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'building', label: 'Building' },
  { id: 'story', label: 'Story' },
  { id: 'background', label: 'Background' }
] as const;
