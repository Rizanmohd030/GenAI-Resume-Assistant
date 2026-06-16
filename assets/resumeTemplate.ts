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
    fullName: 'MOHAMMED RAHIS',
    email: 'raeesm216@gmail.com',
    phone: '+91 9019135364',
    location: 'Karnataka, India',
    linkedin: 'Mohammed Rahis',
    github: 'mohammedraees07',
    portfolio: 'raees04.me',
    summary:
      'Full Stack Developer with experience building and deploying web applications using React, Node.js, and PostgreSQL. Built and deployed applications featuring authentication, API integrations, database-driven workflows, and cloud deployment. Strong foundation in Java, DSA, OOP, and software engineering fundamentals.',
  },
  education: [
    {
      id: 'edu-1',
      institution: 'P.A. College of Engineering',
      location: 'Mangaluru',
      degree: 'Bachelor of Engineering',
      field: 'Computer Science & Engineering',
      startDate: '2022',
      endDate: '2026',
      gpa: '8.38 / 10',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Varishtha Infotech Services Pvt. Ltd.',
      role: 'RPA Intern',
      startDate: 'Dec 2025',
      endDate: 'May 2026',
      bullets: [
        'Developed automation workflows using UiPath.',
        'Processed structured CSV and Excel data.',
        'Implemented validation and exception handling mechanisms.',
      ],
    },
    {
      id: 'exp-2',
      company: 'GD EduTech',
      role: 'Software Developer Intern',
      startDate: 'Jul 2025',
      endDate: 'Sep 2025',
      bullets: [
        'Developed an AI-powered digital marketing web platform enabling content generation, SEO keyword analysis, and campaign automation.',
        'Integrated REST APIs for frontend-backend communication.',
        'Built and deployed a personal portfolio website.',
        'Collaborated on feature implementation and testing.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'CodeNexus - Peer-to-Peer Learning Platform',
      technologies: 'React, Node.js, PostgreSQL, Supabase, Resend',
      bullets: [
        'Built a full-stack peer-learning platform currently used by 200+ students to improve DSA consistency and technical engagement.',
        'Integrated LeetCode GraphQL APIs to verify challenge completion through custom business logic based on recent submissions and challenge timelines.',
        'Implemented RBAC, XP-based gamification, leaderboards, interview experience sharing, and curated resource-sharing features.',
        'Designed relational database structures using PostgreSQL for users, challenges, rankings, heatmaps, and activity tracking.',
        'Implemented institution-only authentication by validating college email domains during registration.',
        'Deployed and maintained the application using modern cloud infrastructure.',
      ],
    },
    {
      id: 'proj-2',
      name: 'Minara – Masjid Management & Community Platform',
      technologies: 'React Native, Firebase, TypeScript',
      bullets: [
        'Contributed to a production application deployed on Google Play Store and Apple App Store.',
        'Integrated Google Vision API and Firebase Cloud Functions for OCR-based payment verification workflows.',
        'Implemented validation logic for transaction amount and UPI mismatch detection.',
        'Developed responsive Admin and Super Admin dashboards that dynamically display and manage data generated by the mobile application.',
      ],
    },
    {
      id: 'proj-3',
      name: 'Delearner – AI Code Review Platform',
      technologies: 'React, Gemini API',
      bullets: [
        'Built an AI-assisted code review platform capable of analyzing code quality and optimization opportunities.',
        'Implemented automated test-case generation and DSA solution validation.',
        'Added complexity analysis and execution profiling visualizations.',
        'Built an API rotation system that automatically switches between AI providers when usage limits are reached.',
      ],
    },
    {
      id: 'proj-4',
      name: 'Automated Payroll System',
      technologies: 'UiPath, Excel Automation',
      bullets: [
        'Automated employee salary calculation by extracting attendance (check-in/out) from CSV files.',
        'Fetched basic salary + allowances and computed daily pay based on working hours.',
        'Generated a consolidated monthly salary sheet using Excel Process Scope for reliability.',
        'Reduced manual processing and eliminated calculation errors.',
      ],
    },
  ],
  achievements: [
    'Co-Founder – CodeNexus: led a collaborative tech learning initiative and mentored peers in problem-solving, projects, and technologies.',
    'WebLead - EmbedClub: Contributed to refactoring the EmbedClub website, improving maintainability and user experience.',
    'Achievements: Solved 250+ coding problems across TUF, LeetCode, and GeeksforGeeks. Winner – KAUSHAAL \'25 Project Presentation.',
  ],
  skills: [
    { id: 'sk-1', category: 'Programming Languages', items: 'Java, JavaScript, C#' },
    { id: 'sk-2', category: 'Frontend', items: 'React, HTML, CSS, Tailwind CSS' },
    { id: 'sk-3', category: 'Backend', items: 'Node.js, Express.js' },
    { id: 'sk-4', category: 'Databases', items: 'PostgreSQL, MySQL, MongoDB' },
    { id: 'sk-5', category: 'Cloud & Tools', items: 'Supabase, Firebase, Vercel, Render, Git, GitHub, Postman, Docker (Basics), UiPath' },
    { id: 'sk-6', category: 'Certifications', items: 'UiPath Academy – Automation Developer Professional Training, CSS50x – Harvard University, GFG -160 Days of Code' },
    { id: 'sk-7', category: 'Languages', items: 'English (Fluent), Hindi (Fluent), Kannada (Fluent), Malayalam (Native)' },
  ],
};
