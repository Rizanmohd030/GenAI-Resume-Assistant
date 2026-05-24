import React from 'react';

const blueprintGroups = [
  {
    title: 'Suggested Folder Structure',
    body: `src/
  components/
  sections/
  hooks/
  services/
  utils/
  store/
api/
db/
  schemas/
  migrations/`,
  },
  {
    title: 'Frontend Component Architecture',
    body:
      'App shell, sidebar nav, prompt command center, tabbed section cards, interview simulator, DSA tracker, editable career assets, toast layer, and reusable card primitives.',
  },
  {
    title: 'Backend API Structure',
    body:
      'POST /api/generate for full generation, optional focus mode for interview/dsa/career regeneration, persistence endpoints for bookmarks and solved state, auth middleware, validation, and rate limiting.',
  },
  {
    title: 'Database Schema Suggestions',
    body:
      'Users, sessions, generation_history, saved_problems, bookmarks, practice_runs, resume_versions, and analytics events. PostgreSQL fits relational analytics well; MongoDB works if iteration speed matters more.',
  },
  {
    title: 'JSON Response Format',
    body:
      'Top-level interview, dsa, and careerPrep objects with normalized arrays for questions, recommendations, ATS keywords, resume bullets, and project suggestions.',
  },
  {
    title: 'Gemini Prompt Strategy',
    body:
      'Use a strict schema prompt, focus-specific regeneration prompts, validation on the server, and post-processing to normalize enum values and fallback defaults.',
  },
  {
    title: 'Reusable UI Components',
    body:
      'Sidebar item, section shell, pill filter, difficulty badge, copy button, editable card, stat tile, skeleton card, toast, timer chip, and progress meter.',
  },
  {
    title: 'Feature Implementation Plan',
    body:
      'Phase 1: generation flow and dashboard. Phase 2: persistence, solved/bookmark sync, PDF export, auth. Phase 3: analytics, subscriptions, collaboration, and admin observability.',
  },
  {
    title: 'Scalable Architecture Suggestions',
    body:
      'Split prompt orchestration, persistence, and analytics services. Add queue-backed long jobs, caching for repeated generations, and background vector indexing for future personalized coaching.',
  },
  {
    title: 'Production Best Practices',
    body:
      'Schema validation, prompt versioning, rate limits, audit logging, feature flags, secure secret handling, observability, retry-safe APIs, and robust fallback content.',
  },
];

const ArchitectureSection: React.FC = () => (
  <section className="rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Platform Blueprint</p>
        <h2 className="mt-2 font-serif text-3xl text-slate-900">Production-ready SaaS architecture</h2>
      </div>
      <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
        Included to match your requested delivery outputs
      </div>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {blueprintGroups.map((group) => (
        <article key={group.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-4">
          <h3 className="text-lg font-medium text-slate-900">{group.title}</h3>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{group.body}</p>
        </article>
      ))}
    </div>
  </section>
);

export default ArchitectureSection;
