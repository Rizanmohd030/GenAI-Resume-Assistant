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

  const solvedCount = data.recommendations.filter((problem) => solvedProblemIds.includes(problem.id)).length;
  const progress = data.recommendations.length ? Math.round((solvedCount / data.recommendations.length) * 100) : 0;

  return (
    <section id="dsa" className="rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Section 2</p>
          <h2 className="mt-2 font-serif text-3xl text-slate-900">DSA Preparation</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Practice DSA questions in a clean, readable structure with explanation, interview value, and direct links
            to the source platform.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeTopic === topic
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-sky-50'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <div className="space-y-4">
          <article className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#0f4d7f,#1f6aa1)] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-100/75">Daily Challenge</p>
            <h3 className="mt-3 text-xl text-white">{data.dailyChallenge.title}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">{data.dailyChallenge.topic}</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs text-sky-900">{data.dailyChallenge.difficulty}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">{data.dailyChallenge.platform}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-sky-50">{data.dailyChallenge.explanation}</p>
            <p className="mt-3 text-sm leading-6 text-sky-100/80">{data.dailyChallenge.importance}</p>
            <a
              href={data.dailyChallenge.link}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full border border-white/20 bg-white px-4 py-2 text-sm text-sky-900 transition hover:bg-sky-50"
            >
              Open problem
            </a>
          </article>

          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Progress Tracker</p>
                <h3 className="mt-2 text-xl text-slate-900">{progress}% complete</h3>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">
                {solvedCount}/{data.recommendations.length} solved
              </span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#60a5fa,#0f4d7f)]" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Blind 75 Focus</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {data.blind75Recommendations.map((item) => (
                  <li key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        <div className="grid gap-4">
          {filteredProblems.map((problem) => {
            const isSolved = solvedProblemIds.includes(problem.id);
            const isBookmarked = bookmarkedProblemIds.includes(problem.id);

            return (
              <article key={problem.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">{problem.topic}</span>
                      <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs text-sky-700">{problem.difficulty}</span>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">{problem.platform}</span>
                    </div>
                    <h3 className="mt-3 text-xl text-slate-900">{problem.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{problem.explanation}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{problem.importance}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <CopyButton
                      textToCopy={`${problem.title}\n${problem.link}\n${problem.explanation}\n${problem.importance}`}
                      buttonClass="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-100"
                    />
                    <button
                      onClick={() => onToggleBookmark(problem.id)}
                      className={`rounded-full px-3 py-2 text-xs transition ${
                        isBookmarked ? 'border border-amber-200 bg-amber-100 text-amber-700' : 'border border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                    <button
                      onClick={() => onToggleSolved(problem.id)}
                      className={`rounded-full px-3 py-2 text-xs transition ${
                        isSolved ? 'border border-sky-200 bg-sky-100 text-sky-700' : 'border border-slate-200 bg-white text-slate-600'
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
                  className="mt-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-sky-50"
                >
                  Open problem link
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DsaSection;
