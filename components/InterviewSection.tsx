import React, { useMemo, useState } from 'react';
import CopyButton from './CopyButton';
import type { InterviewSectionData } from '../types';

interface InterviewSectionProps {
  data: InterviewSectionData;
  onGenerateMore: () => void;
  isGeneratingMore: boolean;
}

const InterviewSection: React.FC<InterviewSectionProps> = ({ data, onGenerateMore, isGeneratingMore }) => {
  const [questionIndex, setQuestionIndex] = useState(0);

  const questions = useMemo(() => data.questions, [data.questions]);

  const mockQuestion = questions[questionIndex] || questions[0];

  return (
    <section
      id="interview"
      className="rounded-[1.5rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,252,247,0.84)] p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-[10px] sm:p-5 md:rounded-[2rem] md:p-6"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#7a756b]">Section 1</p>
          <h2 className="mt-2 font-serif text-[1.9rem] text-[#1f2933] sm:text-3xl">Interview Q&amp;A</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#625e57] sm:leading-7">
            Practice HR, technical, behavioral, and role-specific questions with guided answers, difficulty filters,
            mock interview mode, and a timed practice flow.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={onGenerateMore}
            disabled={isGeneratingMore}
            className="min-h-[2.75rem] rounded-full border border-[rgba(41,63,96,0.12)] bg-[rgba(240,236,229,0.92)] px-4 py-2 text-sm text-[#2d4463] transition hover:bg-[rgba(234,230,223,0.98)] disabled:opacity-60"
          >
            {isGeneratingMore ? 'Generating...' : 'Generate More Questions'}
          </button>
        </div>
        </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {questions.map((question) => {
            return (
              <article
                key={question.id}
                className="rounded-[1.25rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(250,246,240,0.88)] p-4 shadow-[0_10px_30px_rgba(15,23,42,0.03)] sm:p-5 md:rounded-[1.5rem]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-[rgba(96,90,81,0.1)] bg-[rgba(255,255,255,0.7)] px-3 py-1 text-xs text-[#58544b]">
                        {question.category}
                      </span>
                      <span className="rounded-full border border-[rgba(41,63,96,0.08)] bg-[rgba(229,236,246,0.7)] px-3 py-1 text-xs text-[#2d4463]">
                        {question.difficulty}
                      </span>
                    </div>
                    <h3 className="mt-3 break-words text-base font-medium leading-7 text-[#1f2833] sm:text-lg">
                      {question.question}
                    </h3>
                  </div>
                  <CopyButton
                    textToCopy={`Q: ${question.question}\nA: ${question.answer}`}
                    buttonClass="rounded-full border border-[rgba(96,90,81,0.12)] bg-[rgba(255,255,255,0.75)] px-3 py-2 text-xs text-[#5c584f] transition hover:bg-[rgba(250,247,241,1)]"
                  />
                </div>
                <p className="mt-4 break-words text-sm leading-6 text-[#625e57] sm:leading-7">{question.answer}</p>
              </article>
            );
          })}
        </div>

        <div className="space-y-4">
          <article className="rounded-[1.25rem] border border-[rgba(41,63,96,0.12)] bg-[linear-gradient(180deg,rgba(46,68,98,0.96),rgba(35,54,79,0.94))] p-4 shadow-[0_12px_36px_rgba(36,59,90,0.14)] sm:p-5 md:rounded-[1.5rem]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.3em] text-[#d6deea]">Featured Prompt</p>
                <h3 className="mt-2 text-lg text-white sm:text-xl">Question and answer, side by side</h3>
              </div>
              <span className="w-fit rounded-full bg-[rgba(255,250,244,0.92)] px-4 py-2 text-sm font-medium text-[#243b5a]">
                {questions.length} ready
              </span>
            </div>

            <div className="mt-5 rounded-[1.1rem] border border-white/10 bg-[rgba(255,251,246,0.08)] p-4 sm:rounded-[1.25rem]">
              <p className="text-xs uppercase tracking-[0.24em] text-[#d7dfeb]">Question</p>
              <p className="mt-3 break-words text-base font-medium leading-7 text-white">
                {mockQuestion?.question || 'Generate questions to begin.'}
              </p>
              <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[#d7dfeb]">Answer</p>
              <p className="mt-3 break-words text-sm leading-6 text-[#d7dfeb] sm:leading-7">
                {mockQuestion?.answer || 'The suggested answer will appear here once questions are generated.'}
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setQuestionIndex((current) => (current + 1) % Math.max(questions.length, 1))}
                  className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-white"
                >
                  Next Question
                </button>
              </div>
            </div>
          </article>

          <article className="rounded-[1.25rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(250,246,240,0.88)] p-4 sm:p-5 md:rounded-[1.5rem]">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7a756b]">Practice Tips</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#625e57] sm:leading-7">
              {data.mockInterviewTips.map((tip) => (
                <li key={tip} className="rounded-[1rem] border border-[rgba(96,90,81,0.1)] bg-[rgba(255,255,255,0.7)] px-4 py-3 break-words sm:rounded-2xl">
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
