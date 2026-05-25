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
  <section
    id="career"
    className="rounded-[1.5rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,252,247,0.84)] p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-[10px] sm:p-5 md:rounded-[2rem] md:p-6"
  >
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[#7a756b]">Section 3</p>
        <h2 className="mt-2 font-serif text-[1.9rem] text-[#1f2933] sm:text-3xl">Career Prep</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#625e57] sm:leading-7">
          Build your role-fit application package with resume highlights, ATS keywords, LinkedIn summary, and clearer
          project positioning.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="min-h-[2.75rem] rounded-full border border-[rgba(41,63,96,0.12)] bg-[rgba(240,236,229,0.92)] px-4 py-2 text-sm text-[#2d4463] transition hover:bg-[rgba(234,230,223,0.98)] disabled:opacity-60"
        >
          {isRegenerating ? 'Regenerating...' : 'Regenerate Career Prep'}
        </button>
        <button
          onClick={onDownloadPdf}
          className="min-h-[2.75rem] rounded-full border border-[rgba(41,63,96,0.12)] bg-[#243b5a] px-4 py-2 text-sm font-medium text-[#f8f5ee] shadow-[0_10px_30px_rgba(36,59,90,0.2)] transition hover:bg-[#1f3551]"
        >
          Download as PDF
        </button>
      </div>
    </div>

    <div className="mt-6 grid gap-4 xl:grid-cols-2">
      <article className="rounded-[1.25rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(250,246,240,0.88)] p-4 sm:p-5 md:rounded-[1.5rem]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg text-[#1f2933] sm:text-xl">Resume Highlights</h3>
          <CopyButton
            textToCopy={data.resumeHighlights.join('\n')}
            buttonClass="rounded-full border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.75)] px-3 py-2 text-xs text-[#5c584f] transition hover:bg-[rgba(250,247,241,1)]"
          />
        </div>
        <textarea
          className="mt-4 min-h-52 w-full rounded-[1.1rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,252,247,0.86)] p-4 text-sm leading-6 text-[#4d5763] outline-none transition duration-300 focus:border-[#2c4467] focus:shadow-[0_0_0_5px_rgba(44,68,103,0.08)] sm:min-h-60 sm:rounded-[1.4rem] sm:leading-7"
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

      <article className="rounded-[1.25rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(250,246,240,0.88)] p-4 sm:p-5 md:rounded-[1.5rem]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg text-[#1f2933] sm:text-xl">ATS Keywords</h3>
          <CopyButton
            textToCopy={data.atsKeywords.join(', ')}
            buttonClass="rounded-full border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.75)] px-3 py-2 text-xs text-[#5c584f] transition hover:bg-[rgba(250,247,241,1)]"
          />
        </div>
        <textarea
          className="mt-4 min-h-52 w-full rounded-[1.1rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,252,247,0.86)] p-4 text-sm leading-6 text-[#4d5763] outline-none transition duration-300 focus:border-[#2c4467] focus:shadow-[0_0_0_5px_rgba(44,68,103,0.08)] sm:min-h-60 sm:rounded-[1.4rem] sm:leading-7"
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

      <article className="rounded-[1.25rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(250,246,240,0.88)] p-4 sm:p-5 md:rounded-[1.5rem]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg text-[#1f2933] sm:text-xl">Skills Summary</h3>
          <CopyButton
            textToCopy={data.skillsSummary}
            buttonClass="rounded-full border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.75)] px-3 py-2 text-xs text-[#5c584f] transition hover:bg-[rgba(250,247,241,1)]"
          />
        </div>
        <textarea
          className="mt-4 min-h-52 w-full rounded-[1.1rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,252,247,0.86)] p-4 text-sm leading-6 text-[#4d5763] outline-none transition duration-300 focus:border-[#2c4467] focus:shadow-[0_0_0_5px_rgba(44,68,103,0.08)] sm:min-h-60 sm:rounded-[1.4rem] sm:leading-7"
          value={data.skillsSummary}
          onChange={(event) => onFieldChange('skillsSummary', event.target.value)}
        />
      </article>

      <article className="rounded-[1.25rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(250,246,240,0.88)] p-4 sm:p-5 md:rounded-[1.5rem]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg text-[#1f2933] sm:text-xl">LinkedIn Summary</h3>
          <CopyButton
            textToCopy={data.linkedInSummary}
            buttonClass="rounded-full border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.75)] px-3 py-2 text-xs text-[#5c584f] transition hover:bg-[rgba(250,247,241,1)]"
          />
        </div>
        <textarea
          className="mt-4 min-h-52 w-full rounded-[1.1rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,252,247,0.86)] p-4 text-sm leading-6 text-[#4d5763] outline-none transition duration-300 focus:border-[#2c4467] focus:shadow-[0_0_0_5px_rgba(44,68,103,0.08)] sm:min-h-60 sm:rounded-[1.4rem] sm:leading-7"
          value={data.linkedInSummary}
          onChange={(event) => onFieldChange('linkedInSummary', event.target.value)}
        />
      </article>

      <article className="rounded-[1.25rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(250,246,240,0.88)] p-4 sm:p-5 md:rounded-[1.5rem] xl:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg text-[#1f2933] sm:text-xl">Cover Letter Draft</h3>
          <CopyButton
            textToCopy={data.coverLetter}
            buttonClass="rounded-full border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.75)] px-3 py-2 text-xs text-[#5c584f] transition hover:bg-[rgba(250,247,241,1)]"
          />
        </div>
        <textarea
          className="mt-4 min-h-64 w-full rounded-[1.1rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,252,247,0.86)] p-4 text-sm leading-6 text-[#4d5763] outline-none transition duration-300 focus:border-[#2c4467] focus:shadow-[0_0_0_5px_rgba(44,68,103,0.08)] sm:min-h-72 sm:rounded-[1.4rem] sm:leading-7"
          value={data.coverLetter}
          onChange={(event) => onFieldChange('coverLetter', event.target.value)}
        />
      </article>

      <article className="rounded-[1.25rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(250,246,240,0.88)] p-4 sm:p-5 md:rounded-[1.5rem] xl:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg text-[#1f2933] sm:text-xl">Project Improvement Suggestions</h3>
          <CopyButton
            textToCopy={data.projectImprovementSuggestions.join('\n')}
            buttonClass="rounded-full border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.75)] px-3 py-2 text-xs text-[#5c584f] transition hover:bg-[rgba(250,247,241,1)]"
          />
        </div>
        <textarea
          className="mt-4 min-h-48 w-full rounded-[1.1rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,252,247,0.86)] p-4 text-sm leading-6 text-[#4d5763] outline-none transition duration-300 focus:border-[#2c4467] focus:shadow-[0_0_0_5px_rgba(44,68,103,0.08)] sm:min-h-56 sm:rounded-[1.4rem] sm:leading-7"
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
