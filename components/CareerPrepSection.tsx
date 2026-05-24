import React from 'react';
import CopyButton from './CopyButton';
import type { CareerPrepSectionData } from '../types';

interface CareerPrepSectionProps {
  data: CareerPrepSectionData;
  onFieldChange: (field: keyof CareerPrepSectionData, value: string | string[]) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
  onDownloadPdf: () => void;
}

const CareerPrepSection: React.FC<CareerPrepSectionProps> = ({
  data,
  onFieldChange,
  onRegenerate,
  isRegenerating,
  onDownloadPdf,
}) => (
  <section id="career" className="rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Section 3</p>
        <h2 className="mt-2 font-serif text-3xl text-slate-900">Career Prep</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Build your role-fit application package with resume highlights, ATS keywords, LinkedIn summary, and clearer
          project positioning.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700 transition hover:bg-sky-100 disabled:opacity-60"
        >
          {isRegenerating ? 'Regenerating...' : 'Regenerate Career Prep'}
        </button>
        <button
          onClick={onDownloadPdf}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
        >
          Download as PDF
        </button>
      </div>
    </div>

    <div className="mt-6 grid gap-4 xl:grid-cols-2">
      <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl text-slate-900">Resume Highlights</h3>
          <CopyButton
            textToCopy={data.resumeHighlights.join('\n')}
            buttonClass="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-100"
          />
        </div>
        <textarea
          className="mt-4 min-h-60 w-full rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          value={data.resumeHighlights.join('\n')}
          onChange={(event) =>
            onFieldChange(
              'resumeHighlights',
              event.target.value
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
            )
          }
        />
      </article>

      <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl text-slate-900">ATS Keywords</h3>
          <CopyButton
            textToCopy={data.atsKeywords.join(', ')}
            buttonClass="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-100"
          />
        </div>
        <textarea
          className="mt-4 min-h-60 w-full rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          value={data.atsKeywords.join(', ')}
          onChange={(event) =>
            onFieldChange(
              'atsKeywords',
              event.target.value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
            )
          }
        />
      </article>

      <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl text-slate-900">Skills Summary</h3>
          <CopyButton
            textToCopy={data.skillsSummary}
            buttonClass="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-100"
          />
        </div>
        <textarea
          className="mt-4 min-h-60 w-full rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          value={data.skillsSummary}
          onChange={(event) => onFieldChange('skillsSummary', event.target.value)}
        />
      </article>

      <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl text-slate-900">LinkedIn Summary</h3>
          <CopyButton
            textToCopy={data.linkedInSummary}
            buttonClass="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-100"
          />
        </div>
        <textarea
          className="mt-4 min-h-60 w-full rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          value={data.linkedInSummary}
          onChange={(event) => onFieldChange('linkedInSummary', event.target.value)}
        />
      </article>

      <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5 xl:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl text-slate-900">Cover Letter Draft</h3>
          <CopyButton
            textToCopy={data.coverLetter}
            buttonClass="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-100"
          />
        </div>
        <textarea
          className="mt-4 min-h-72 w-full rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          value={data.coverLetter}
          onChange={(event) => onFieldChange('coverLetter', event.target.value)}
        />
      </article>

      <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5 xl:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl text-slate-900">Project Improvement Suggestions</h3>
          <CopyButton
            textToCopy={data.projectImprovementSuggestions.join('\n')}
            buttonClass="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-100"
          />
        </div>
        <textarea
          className="mt-4 min-h-56 w-full rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          value={data.projectImprovementSuggestions.join('\n')}
          onChange={(event) =>
            onFieldChange(
              'projectImprovementSuggestions',
              event.target.value
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
            )
          }
        />
      </article>
    </div>
  </section>
);

export default CareerPrepSection;
