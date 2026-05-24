import React, { useEffect, useMemo, useState } from 'react';
import CopyButton from './CopyButton';
import type { DifficultyLevel, InterviewSectionData } from '../types';

interface InterviewSectionProps {
  data: InterviewSectionData;
  onGenerateMore: () => void;
  isGeneratingMore: boolean;
}

const filters: Array<DifficultyLevel | 'All'> = ['All', 'Easy', 'Medium', 'Hard'];

const InterviewSection: React.FC<InterviewSectionProps> = ({ data, onGenerateMore, isGeneratingMore }) => {
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel | 'All'>('All');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [mockMode, setMockMode] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(data.timerSuggestionSeconds);

  useEffect(() => {
    setTimeLeft(data.timerSuggestionSeconds);
  }, [data.timerSuggestionSeconds]);

  useEffect(() => {
    if (!mockMode) return;
    if (timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mockMode, timeLeft]);

  const filteredQuestions = useMemo(() => {
    return activeDifficulty === 'All'
      ? data.questions
      : data.questions.filter((question) => question.difficulty === activeDifficulty);
  }, [activeDifficulty, data.questions]);

  const mockQuestion = filteredQuestions[questionIndex] || filteredQuestions[0];

  return (
    <section id="interview" className="rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Section 1</p>
          <h2 className="mt-2 font-serif text-3xl text-slate-900">Interview Q&amp;A</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Practice HR, technical, behavioral, and role-specific questions with guided answers, difficulty filters,
            mock interview mode, and a timed practice flow.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveDifficulty(filter)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeDifficulty === filter
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-sky-50'
              }`}
            >
              {filter}
            </button>
          ))}
          <button
            onClick={onGenerateMore}
            disabled={isGeneratingMore}
            className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700 transition hover:bg-sky-100 disabled:opacity-60"
          >
            {isGeneratingMore ? 'Generating...' : 'Generate More Questions'}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {filteredQuestions.map((question) => {
            const isExpanded = Boolean(expandedIds[question.id]);
            return (
              <article key={question.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 border border-slate-200">{question.category}</span>
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700 border border-sky-100">{question.difficulty}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-slate-900">{question.question}</h3>
                  </div>
                  <CopyButton
                    textToCopy={`Q: ${question.question}\nA: ${question.answer}`}
                    buttonClass="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-100"
                  />
                </div>
                <button
                  onClick={() =>
                    setExpandedIds((current) => ({
                      ...current,
                      [question.id]: !current[question.id],
                    }))
                  }
                  className="mt-4 text-sm text-sky-700"
                >
                  {isExpanded ? 'Collapse answer' : 'Expand answer'}
                </button>
                {isExpanded && <p className="mt-4 text-sm leading-6 text-slate-600">{question.answer}</p>}
              </article>
            );
          })}
        </div>

        <div className="space-y-4">
          <article className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#0f4d7f,#1f6aa1)] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-100/70">Mock Interview</p>
                <h3 className="mt-2 text-xl text-white">Practice with a timer</h3>
              </div>
              <button
                onClick={() => {
                  setMockMode((current) => !current);
                  setTimeLeft(data.timerSuggestionSeconds);
                }}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-sky-900"
              >
                {mockMode ? 'Stop Mode' : 'Start Mode'}
              </button>
            </div>

            <div className="mt-5 rounded-[1.25rem] border border-white/20 bg-white/10 p-4">
              <div className="flex items-center justify-between text-sm text-sky-100/80">
                <span>Recommended timer</span>
                <span>{timeLeft}s</span>
              </div>
              <p className="mt-4 text-base font-medium text-white">{mockQuestion?.question || 'Generate questions to begin.'}</p>
              <p className="mt-3 text-sm leading-6 text-sky-100/80">
                Answer aloud first. Reveal the expected answer only after your attempt to simulate real interview
                pressure.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setQuestionIndex((current) => (current + 1) % Math.max(filteredQuestions.length, 1))}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white"
                >
                  Next Question
                </button>
                <button
                  onClick={() => setExpandedIds((current) => ({ ...current, [mockQuestion?.id || '']: true }))}
                  className="rounded-full border border-white/20 bg-white px-4 py-2 text-sm text-sky-900"
                >
                  Reveal Answer
                </button>
              </div>
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Practice Tips</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {data.mockInterviewTips.map((tip) => (
                <li key={tip} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  {tip}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
};

export default InterviewSection;
