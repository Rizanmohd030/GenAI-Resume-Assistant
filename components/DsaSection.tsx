import React, { useMemo, useState } from 'react';
import CopyButton from './CopyButton';
import type { DsaSectionData, DsaTopic } from '../types';

interface DsaSectionProps {
  data: DsaSectionData;
  onToggleSolved: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onGenerateMore: () => void;
  isGeneratingMore: boolean;
}

const topics: Array<DsaTopic | 'All'> = [
  'All',
  'Arrays',
  'Strings',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Sliding Window',
  'Recursion',
  'Greedy',
];

const DsaSection: React.FC<DsaSectionProps> = ({
  data,
  onGenerateMore,
  isGeneratingMore,
}) => {
  const [activeTopic, setActiveTopic] = useState<DsaTopic | 'All'>('All');

  const filteredProblems = useMemo(() => {
    return activeTopic === 'All'
      ? data.recommendations
      : data.recommendations.filter(
          (problem) => problem.topic === activeTopic
        );
  }, [activeTopic, data.recommendations]);

  return (
    <section
      id="dsa"
      className="rounded-[1.5rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,252,247,0.84)] p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-[10px] sm:p-5 md:rounded-[2rem] md:p-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#7a756b]">
            Section 2
          </p>

          <h2 className="mt-2 font-serif text-[1.9rem] text-[#1f2933] sm:text-3xl">
            DSA Preparation
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#625e57] sm:leading-7">
            Practice the DSA problems most relevant to the role, company
            expectations, and interview difficulty.
          </p>
        </div>

        {/* Topic Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className={`min-h-[2.75rem] rounded-full px-3 py-2 text-sm transition sm:px-4 ${
                activeTopic === topic
                  ? 'bg-[#243b5a] text-[#f8f5ee] shadow-[0_8px_24px_rgba(36,59,90,0.14)]'
                  : 'border border-[rgba(96,90,81,0.12)] bg-[rgba(252,248,242,0.78)] text-[#5c584f] hover:bg-[rgba(247,242,235,0.96)]'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Problems */}
      <div className="mt-6 space-y-4">
        {filteredProblems.map((problem, index) => {
          return (
            <article
              key={problem.id}
              className="rounded-[1.5rem] border border-[rgba(96,90,81,0.10)] bg-[rgba(250,246,240,0.92)] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start justify-between gap-4">
                
                {/* Left Side */}
                <div className="flex min-w-0 flex-1 gap-4">
                  
                  {/* Number */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(41,63,96,0.08)] text-sm font-semibold text-[#2d4463]">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-[rgba(96,90,81,0.08)] bg-white/70 px-3 py-1 text-[11px] text-[#58544b]">
                        {problem.topic}
                      </span>

                      <span className="rounded-full border border-[rgba(41,63,96,0.08)] bg-[rgba(229,236,246,0.7)] px-3 py-1 text-[11px] text-[#2d4463]">
                        {problem.difficulty}
                      </span>

                      <span className="rounded-full border border-[rgba(96,90,81,0.08)] bg-white/70 px-3 py-1 text-[11px] text-[#58544b]">
                        {problem.platform}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 text-base font-semibold leading-7 text-[#1f2833] sm:text-lg">
                      {problem.title}
                    </h3>

                    {/* Explanation */}
                    <p className="mt-4 text-sm leading-7 text-[#625e57]">
                      {problem.explanation}
                    </p>

                    {/* Importance */}
                    <p className="mt-3 text-sm leading-7 text-[#767067]">
                      {problem.importance}
                    </p>

                    {/* Pseudocode */}
                    <div className="mt-5 rounded-[1rem] border border-[rgba(41,63,96,0.08)] bg-[rgba(244,248,252,0.72)] p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-[#607086]">
                        Pseudocode Hint
                      </p>

                      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#44515f]">
                        {problem.pseudocodeSteps.map((step, stepIndex) => (
                          <li key={`${problem.id}-step-${stepIndex}`}>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Link */}
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex min-h-[2.75rem] items-center rounded-full border border-[rgba(96,90,81,0.10)] bg-white/80 px-4 py-2 text-sm text-[#4d5763] transition hover:bg-white"
                    >
                      Open Problem
                    </a>
                  </div>
                </div>

                {/* Copy Button */}
                <CopyButton
                  textToCopy={`${problem.title}

${problem.link}

${problem.explanation}

${problem.importance}

Pseudocode:
${problem.pseudocodeSteps
  .map((step, idx) => `${idx + 1}. ${step}`)
  .join('\n')}`}
                  buttonClass="rounded-full border border-[rgba(96,90,81,0.10)] bg-white/80 px-3 py-2 text-xs text-[#5c584f] transition hover:bg-white"
                />
              </div>
            </article>
          );
        })}

        {/* Generate More Button */}
        <div className="flex justify-center pt-3">
          <button
            onClick={onGenerateMore}
            disabled={isGeneratingMore}
            className="rounded-full border border-[rgba(41,63,96,0.12)] bg-[rgba(240,236,229,0.92)] px-5 py-3 text-sm font-medium text-[#2d4463] transition hover:bg-[rgba(234,230,223,0.98)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGeneratingMore
              ? 'Generating...'
              : 'Generate More Problems'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default DsaSection;