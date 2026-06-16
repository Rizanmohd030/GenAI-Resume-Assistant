/**
 * ─────────────────────────────────────────────────────────────────
 *  RESUME TEMPLATE  ·  assets/resumeTemplate.ts
 * ─────────────────────────────────────────────────────────────────
 *
 *  Paste YOUR resume content into this file.
 *  The Resume Builder will:
 *    1. Use these sections (in this order) as the form steps
 *    2. Pre-populate the preview with exact spacing, layout, fonts
 *    3. Generate PDFs that match this structure pixel-for-pixel
 *
 *  HOW TO USE:
 *    • Replace the sample data below with your own resume content
 *    • Add / remove sections as needed
 *    • The `sectionOrder` array controls which sections appear and in what order
 *    • Run `npm run dev` — the builder will auto-reflect your changes
 *
 * ─────────────────────────────────────────────────────────────────
 */

import type { ResumeData } from '../components/ResumeBuilder';

// ── SECTION ORDER ────────────────────────────────────────────────
// Controls which sections are shown and in what order.
// Valid values: 'summary' | 'education' | 'experience' | 'projects' | 'achievements' | 'skills'
export const sectionOrder: string[] = [
  'summary',
  'education',
  'experience',
  'projects',
  'achievements',
  'skills',
];

// ── SECTION LABELS ───────────────────────────────────────────────
// The exact heading text that appears on the resume (uppercase)
export const sectionLabels: Record<string, string> = {
  summary: 'PROFESSIONAL SUMMARY',
  education: 'EDUCATION',
  experience: 'INTERNSHIP EXPERIENCE',
  projects: 'PROJECTS',
  achievements: 'LEADERSHIP AND ACHIEVEMENTS',
  skills: 'SKILLS, CERTIFICATIONS AND LANGUAGES',
};

// ── SAMPLE / DEFAULT DATA ────────────────────────────────────────
// Replace this with YOUR resume content.
// This is what shows up when the user hits "Preview" without filling anything.
export const sampleResumeData: ResumeData = {
  personal: {
    fullName: 'JANE DOE',
    email: 'jane.doe@example.com',
    phone: '+1 555-0123',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/janedoe',
    github: 'github.com/janedoe',
    portfolio: 'janedoe.dev',
    summary:
      'Results-driven Software Engineer with 4+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud infrastructure. Adept at collaborating with cross-functional teams to deliver high-quality software solutions that drive business growth.',
  },
  education: [
    {
      id: 'edu-1',
      institution: 'University of Technology',
      location: 'San Francisco, CA',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2018',
      endDate: '2022',
      gpa: '3.9 / 4.0',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Tech Solutions Inc.',
      role: 'Software Engineer',
      startDate: 'Jun 2022',
      endDate: 'Present',
      bullets: [
        'Spearheaded the development of a microservices architecture using Node.js and Docker, improving system scalability by 40%.',
        'Implemented robust CI/CD pipelines using GitHub Actions, reducing deployment time from hours to minutes.',
        'Mentored junior developers and conducted code reviews to ensure adherence to best practices.',
      ],
    },
    {
      id: 'exp-2',
      company: 'InnovateX',
      role: 'Frontend Developer Intern',
      startDate: 'May 2021',
      endDate: 'Aug 2021',
      bullets: [
        'Developed interactive UI components using React and Redux, enhancing user engagement by 25%.',
        'Optimized web application performance, achieving a 95+ score on Google Lighthouse.',
        'Collaborated closely with UX designers to translate wireframes into pixel-perfect interfaces.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'E-Commerce Platform Redesign',
      technologies: 'Next.js, Tailwind CSS, Stripe API',
      bullets: [
        'Architected a modern e-commerce storefront supporting over 10,000 active products.',
        'Integrated Stripe for secure payment processing, achieving a 99.9% successful transaction rate.',
        'Implemented advanced search and filtering capabilities using Elasticsearch.',
      ],
    },
    {
      id: 'proj-2',
      name: 'Real-time Chat Application',
      technologies: 'React, Socket.io, Express',
      bullets: [
        'Built a scalable real-time chat application handling 500+ concurrent connections seamlessly.',
        'Implemented end-to-end encryption for private messaging.',
        'Designed a responsive interface that functions flawlessly across desktop and mobile devices.',
      ],
    },
  ],
  achievements: [
    'First Place Winner at the Global Tech Hackathon 2022 out of 50+ competing teams.',
    'Awarded "Employee of the Month" twice in 2023 for outstanding contributions to project delivery.',
  ],
  skills: [
    { id: 'sk-1', category: 'Programming Languages', items: 'JavaScript, TypeScript, Python' },
    { id: 'sk-2', category: 'Frontend', items: 'React, Next.js, HTML5, CSS3, Tailwind' },
    { id: 'sk-3', category: 'Backend', items: 'Node.js, Express, Django' },
    { id: 'sk-4', category: 'Databases', items: 'PostgreSQL, MongoDB, Redis' },
    { id: 'sk-5', category: 'Cloud & DevOps', items: 'AWS, Docker, CI/CD, Git' },
  ],
};
