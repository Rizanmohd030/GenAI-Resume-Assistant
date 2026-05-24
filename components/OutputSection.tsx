import React from 'react';
import CopyButton from './CopyButton';

interface OutputSectionProps {
  title: string;
  questions?: string | string[];
  answers?: string | string[];
  content?: string | string[];
  onGenerateMore?: () => void;
  loadingMore?: boolean;
}

const buttonClasses =
  'bg-sky-500/80 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-sky-600/80 transition-colors duration-300';

const normalizeInput = (input?: string | string[]) => {
  if (!input) return '';
  return Array.isArray(input)
    ? input.map((x) => `* ${x}`).join('\n')
    : input;
};

const parseBulletList = (text: string) => {
  return text
    .split('\n')
    .filter((line) => line.trim().startsWith('* '))
    .map((line) => line.replace(/^\*\s*/, '').trim());
};

const cleanQA = (text: string, type: 'q' | 'a') => {
  const regex = type === 'q'
    ? /^[qQ][:.]?\s*/
    : /^[aA][:.]?\s*/;

  return text.replace(regex, '').trim();
};

const CardWrapper: React.FC<{
  title: string;
  copyText: string;
  children: React.ReactNode;
}> = ({ title, copyText, children }) => (
  <div className="glass-card border border-white/20 bg-white/10 backdrop-blur-lg backdrop-saturate-150 rounded-2xl shadow-xl p-6 relative h-full transition duration-300">
    <div className="absolute top-4 right-4">
      <CopyButton
        textToCopy={copyText}
        buttonClass={buttonClasses}
      />
    </div>

    <h3 className="text-xl font-semibold text-sky-400 mb-4">
      {title}
    </h3>

    {children}
  </div>
);

const OutputSection: React.FC<OutputSectionProps> = ({
  title,
  questions,
  answers,
  content,
  onGenerateMore,
  loadingMore,
}) => {
  const questionStr = normalizeInput(questions);
  const answerStr = normalizeInput(answers);
  const contentStr = normalizeInput(content);

  // -------------------------
  // Q&A SECTION
  // -------------------------
  if (questionStr && answerStr) {
    const questionList = parseBulletList(questionStr).map((q) =>
      cleanQA(q, 'q')
    );

    const answerList = parseBulletList(answerStr).map((a) =>
      cleanQA(a, 'a')
    );

    return (
      <CardWrapper
        title={title}
        copyText={`${questionStr}\n${answerStr}`}
      >
        <div className="text-slate-200 text-sm">
          {questionList.map((question, idx) => (
            <div key={idx} className="mb-5">
              <div className="font-semibold text-sky-300">
                Q{idx + 1}. {question}
              </div>

              <div className="ml-5 mt-1 text-slate-300">
                A{idx + 1}. {answerList[idx] || 'No answer generated'}
              </div>
            </div>
          ))}
        </div>

        {onGenerateMore && (
          <button
            onClick={onGenerateMore}
            disabled={loadingMore}
            className={`${buttonClasses} mt-6 disabled:opacity-50`}
          >
            {loadingMore ? 'Generating...' : 'Generate More'}
          </button>
        )}
      </CardWrapper>
    );
  }

  // -------------------------
  // CONTENT SECTION
  // -------------------------
  if (contentStr) {
    const lines = contentStr.split('\n');

    return (
      <CardWrapper
        title={title}
        copyText={contentStr}
      >
        <div className="text-slate-200 text-sm prose prose-invert prose-sm max-w-none">
          <ul className="space-y-2">
            {lines.map((line, index) => {
              const trimmed = line.trim();

              if (!trimmed) return null;

              if (trimmed.startsWith('* ')) {
                return (
                  <li key={index} className="ml-5 list-disc">
                    {trimmed.substring(2)}
                  </li>
                );
              }

              return (
                <p key={index} className="mb-4">
                  {trimmed}
                </p>
              );
            })}
          </ul>
        </div>
      </CardWrapper>
    );
  }

  return null;
};

export default OutputSection;