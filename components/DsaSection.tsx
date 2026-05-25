import React, { useMemo, useState } from 'react';
import CopyButton from './CopyButton';
import type { DsaSectionData, DsaTopic } from '../types';

interface DsaSectionProps {
  data: DsaSectionData;
  solvedProblemIds: string[];
  bookmarkedProblemIds: string[];
  onToggleSolved: (id: string) => void;
  onToggleBookmark: (id: string) => void;
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
  solvedProblemIds,
  bookmarkedProblemIds,
  onToggleSolved,
  onToggleBookmark,
}) => {
  const [activeTopic, setActiveTopic] = useState<DsaTopic | 'All'>('All');

  const filteredProblems = useMemo(() => {
    return activeTopic === 'All'
      ? data.recommendations
      : data.recommendations.filter((problem) => problem.topic === activeTopic);
  }, [activeTopic, data.recommendations]);

  return (
    <section
      id="dsa"
      className="rounded-[2rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,252,247,0.84)] p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-[10px]"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#7a756b]">Section 2</p>
          <h2 className="mt-2 font-serif text-3xl text-[#1f2933]">DSA Preparation</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#625e57]">
            Practice the DSA problems most likely to matter for this role, this company context, and the skills
            emphasized in the job description.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className={`rounded-full px-4 py-2 text-sm transition ${
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

      <div className="mt-6 grid gap-4">
        {filteredProblems.map((problem) => {
          const isSolved = solvedProblemIds.includes(problem.id);
          const isBookmarked = bookmarkedProblemIds.includes(problem.id);

          return (
            <article
              key={problem.id}
              className="rounded-[1.5rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(250,246,240,0.88)] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.03)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.72)] px-3 py-1 text-xs text-[#58544b]">{problem.topic}</span>
                    <span className="rounded-full border border-[rgba(41,63,96,0.08)] bg-[rgba(229,236,246,0.7)] px-3 py-1 text-xs text-[#2d4463]">{problem.difficulty}</span>
                    <span className="rounded-full border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.72)] px-3 py-1 text-xs text-[#58544b]">{problem.platform}</span>
                  </div>
                  <h3 className="mt-3 text-xl text-[#1f2933]">{problem.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#625e57]">{problem.explanation}</p>
                  <p className="mt-3 text-sm leading-7 text-[#767067]">{problem.importance}</p>
                  <div className="mt-4 rounded-[1.2rem] border border-[rgba(41,63,96,0.1)] bg-[rgba(244,248,252,0.72)] p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-[#607086]">Pseudocode Hint</p>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#44515f]">
                      {problem.pseudocodeSteps.map((step, index) => (
                        <li key={`${problem.id}-step-${index}`}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <CopyButton
                    textToCopy={`${problem.title}\n${problem.link}\n${problem.explanation}\n${problem.importance}\n\nPseudocode:\n${problem.pseudocodeSteps
                      .map((step, index) => `${index + 1}. ${step}`)
                      .join('\n')}`}
                    buttonClass="rounded-full border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.75)] px-3 py-2 text-xs text-[#5c584f] transition hover:bg-[rgba(250,247,241,1)]"
                  />
                  <button
                    onClick={() => onToggleBookmark(problem.id)}
                    className={`rounded-full px-3 py-2 text-xs transition ${
                      isBookmarked
                        ? 'border border-[rgba(184,134,11,0.18)] bg-[rgba(247,233,193,0.7)] text-[#8a6315]'
                        : 'border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.75)] text-[#5c584f]'
                    }`}
                  >
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                  <button
                    onClick={() => onToggleSolved(problem.id)}
                    className={`rounded-full px-3 py-2 text-xs transition ${
                      isSolved
                        ? 'border border-[rgba(41,63,96,0.14)] bg-[rgba(229,236,246,0.7)] text-[#2d4463]'
                        : 'border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.75)] text-[#5c584f]'
                    }`}
                  >
                    {isSolved ? 'Solved' : 'Mark Solved'}
                  </button>
                </div>
              </div>
              <a
                href={problem.link}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.75)] px-4 py-2 text-sm text-[#4d5763] transition hover:bg-[rgba(248,244,238,0.98)]"
              >
                Open problem link
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default DsaSection;
