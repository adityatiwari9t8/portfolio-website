/**
 * Single place for the personal details used across the site.
 * Change a value here and it updates everywhere.
 */
export const SITE = {
  name: 'Aditya Tiwari',
  firstName: 'Aditya',
  // Where the "Get in touch" form sends mail (opens the visitor's email app).
  email: 'adityatiwari.connect@gmail.com',
  status: 'Open to SWE internships · Class of 2029',
  resume: '/resume.pdf',
  socials: {
    github: 'https://github.com/adityatiwari9t8',
    linkedin: 'https://www.linkedin.com/in/adityatiwari9t8',
    instagram: 'https://www.instagram.com/adityatiwari_98',
    // Not linked anywhere yet. To show it again, add it to ELSEWHERE in Footer.tsx, the resume and "sameAs" in index.html.
    leetcode: 'https://leetcode.com/Aditya_Tiwari_98/'
  }
} as const;

/** Page sections in reading order. A recruiter's priorities first: work, how it's built, experience. */
export const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'building', label: 'Building' },
  { id: 'story', label: 'About' },
  { id: 'background', label: 'Experience' }
] as const;
