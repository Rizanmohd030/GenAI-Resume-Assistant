import React, { useMemo, useState } from 'react';
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
  const [questionIndex, setQuestionIndex] = useState(0);

  const filteredQuestions = useMemo(() => {
    return activeDifficulty === 'All'
      ? data.questions
      : data.questions.filter((question) => question.difficulty === activeDifficulty);
  }, [activeDifficulty, data.questions]);

  const mockQuestion = filteredQuestions[questionIndex] || filteredQuestions[0];

  return (
    <section
      id="interview"
      className="rounded-[2rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,252,247,0.84)] p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-[10px]"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#7a756b]">Section 1</p>
          <h2 className="mt-2 font-serif text-3xl text-[#1f2933]">Interview Q&amp;A</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#625e57]">
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
                  ? 'bg-[#243b5a] text-[#f8f5ee] shadow-[0_8px_24px_rgba(36,59,90,0.14)]'
                  : 'border border-[rgba(96,90,81,0.12)] bg-[rgba(252,248,242,0.78)] text-[#5c584f] hover:bg-[rgba(247,242,235,0.96)]'
              }`}
            >
              {filter}
            </button>
          ))}
          <button
            onClick={onGenerateMore}
            disabled={isGeneratingMore}
            className="rounded-full border border-[rgba(41,63,96,0.12)] bg-[rgba(240,236,229,0.92)] px-4 py-2 text-sm text-[#2d4463] transition hover:bg-[rgba(234,230,223,0.98)] disabled:opacity-60"
          >
            {isGeneratingMore ? 'Generating...' : 'Generate More Questions'}
          </button>
        </div>
        </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {filteredQuestions.map((question) => {
            return (
              <article
                key={question.id}
                className="rounded-[1.5rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(250,246,240,0.88)] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.03)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-[rgba(96,90,81,0.1)] bg-[rgba(255,255,255,0.7)] px-3 py-1 text-xs text-[#58544b]">
                        {question.category}
                      </span>
                      <span className="rounded-full border border-[rgba(41,63,96,0.08)] bg-[rgba(229,236,246,0.7)] px-3 py-1 text-xs text-[#2d4463]">
                        {question.difficulty}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-[#1f2833]">{question.question}</h3>
                  </div>
                  <CopyButton
                    textToCopy={`Q: ${question.question}\nA: ${question.answer}`}
                    buttonClass="rounded-full border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.75)] px-3 py-2 text-xs text-[#5c584f] transition hover:bg-[rgba(250,247,241,1)]"
                  />
                </div>
                <p className="mt-4 text-sm leading-7 text-[#625e57]">{question.answer}</p>
              </article>
            );
          })}
        </div>

        <div className="space-y-4">
          <article className="rounded-[1.5rem] border border-[rgba(41,63,96,0.12)] bg-[linear-gradient(180deg,rgba(46,68,98,0.96),rgba(35,54,79,0.94))] p-5 shadow-[0_12px_36px_rgba(36,59,90,0.14)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#d6deea]">Featured Prompt</p>
                <h3 className="mt-2 text-xl text-white">Question and answer, side by side</h3>
              </div>
              <span className="rounded-full bg-[rgba(255,250,244,0.92)] px-4 py-2 text-sm font-medium text-[#243b5a]">
                {filteredQuestions.length} ready
              </span>
            </div>

            <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-[rgba(255,251,246,0.08)] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#d7dfeb]">Question</p>
              <p className="mt-3 text-base font-medium leading-7 text-white">
                {mockQuestion?.question || 'Generate questions to begin.'}
              </p>
              <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[#d7dfeb]">Answer</p>
              <p className="mt-3 text-sm leading-7 text-[#d7dfeb]">
                {mockQuestion?.answer || 'The suggested answer will appear here once questions are generated.'}
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setQuestionIndex((current) => (current + 1) % Math.max(filteredQuestions.length, 1))}
                  className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-white"
                >
                  Next Question
                </button>
              </div>
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(250,246,240,0.88)] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7a756b]">Practice Tips</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#625e57]">
              {data.mockInterviewTips.map((tip) => (
                <li key={tip} className="rounded-2xl border border-[rgba(96,90,81,0.1)] bg-[rgba(255,255,255,0.7)] px-4 py-3">
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
