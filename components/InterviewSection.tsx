import React, { useMemo } from 'react';
import CopyButton from './CopyButton';
import type { InterviewSectionData } from '../types';

interface InterviewSectionProps {
  data: InterviewSectionData;
  onGenerateMore: () => void;
  isGeneratingMore: boolean;
}

const InterviewSection: React.FC<InterviewSectionProps> = ({
  data,
  onGenerateMore,
  isGeneratingMore,
}) => {
  const questions = useMemo(() => data.questions, [data.questions]);

  return (
    <section
      id="interview"
      className="rounded-[1.5rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,252,247,0.84)] p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-[10px] sm:p-5 md:rounded-[2rem] md:p-6"
    >
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[#7a756b]">
          Section 1
        </p>

        <h2 className="mt-2 font-serif text-[1.9rem] text-[#1f2933] sm:text-3xl">
          Interview Q&amp;A
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#625e57] sm:leading-7">
          Practice HR, technical, behavioral, and role-specific interview
          questions with structured answers and realistic preparation flow.
        </p>
      </div>

      {/* Questions */}
      <div className="mt-6 space-y-4">
        {questions.map((question, index) => {
          return (
            <article
              key={question.id}
              className="rounded-[1.5rem] border border-[rgba(96,90,81,0.10)] bg-[rgba(250,246,240,0.92)] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Content */}
                <div className="flex min-w-0 flex-1 gap-4">
                  {/* Number */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(41,63,96,0.08)] text-sm font-semibold text-[#2d4463]">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-[rgba(96,90,81,0.08)] bg-white/70 px-3 py-1 text-[11px] text-[#58544b]">
                        {question.category}
                      </span>

                      <span className="rounded-full border border-[rgba(41,63,96,0.08)] bg-[rgba(229,236,246,0.7)] px-3 py-1 text-[11px] text-[#2d4463]">
                        {question.difficulty}
                      </span>
                    </div>

                    {/* Question */}
                    <h3 className="mt-3 text-base font-semibold leading-7 text-[#1f2833] sm:text-lg">
                      {question.question}
                    </h3>

                    {/* Answer */}
                    <p className="mt-4 text-sm leading-7 text-[#625e57]">
                      {question.answer}
                    </p>
                  </div>
                </div>

                {/* Copy Button */}
                <CopyButton
                  textToCopy={`Q: ${question.question}\nA: ${question.answer}`}
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
              : 'Generate More Questions'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default InterviewSection;