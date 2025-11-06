import React from 'react';
import CopyButton from './CopyButton';

interface OutputSectionProps {
  title: string;
  questions?: string;
  answers?: string;
  content?: string;
  onGenerateMore?: () => void;
  loadingMore?: boolean;
}

const buttonClasses =
  'bg-sky-500/80 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-sky-600/80 transition-colors duration-300';

const OutputSection: React.FC<OutputSectionProps> = ({
  title,
  questions,
  answers,
  content,
  onGenerateMore,
  loadingMore,
}) => {
  // Q&A Section
  if (questions && answers) {
    // Defensive: ensure string input
    if (Array.isArray(questions)) questions = questions.map(x => `* ${x}`).join('\n');
    if (Array.isArray(answers)) answers = answers.map(x => `* ${x}`).join('\n');

    const questionList = questions
      .split('\n')
      .filter(line => line.trim().startsWith('* '))
      .map(line => line.substring(2));
    const answerList = answers
      .split('\n')
      .filter(line => line.trim().startsWith('* '))
      .map(line => line.substring(2));

    return (
      <div className="glass-card border border-white/20 bg-white/10 backdrop-blur-lg backdrop-saturate-150 rounded-2xl shadow-xl p-6 relative h-full transition duration-300">
        <div className="absolute top-4 right-4">
          <CopyButton textToCopy={`${questions}\n${answers}`} buttonClass={buttonClasses} />
        </div>
        <h3 className="text-xl font-semibold text-amber-700 mb-4">{title}</h3>
        <div>
          {questionList.map((q, idx) => (
            <div key={idx} className="mb-4">
              <div className="font-semibold text-amber-700">{`Q${idx + 1}. ${q}`}</div>
              <div className="ml-5 text-amber-900">{`A${idx + 1}. ${answerList[idx] || ''}`}</div>
            </div>
          ))}
        </div>
        {onGenerateMore &&
          <button
            onClick={onGenerateMore}
            disabled={!!loadingMore}
            className={buttonClasses + ' mt-6'}
          >
            {loadingMore ? 'Generating...' : 'Generate More'}
          </button>
        }
      </div>
    );
  }

  // Bullets/paragraphs
  if (content) {
    if (Array.isArray(content)) content = content.map(x => `* ${x}`).join('\n');

    const formattedContent = content.split('\n').map((line, index) =>
      line.trim().startsWith('* ')
        ? <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>
        : <p key={index} className="mb-4">{line}</p>
    );

    return (
      <div className="glass-card border border-white/20 bg-white/10 backdrop-blur-lg backdrop-saturate-150 rounded-2xl shadow-xl p-6 relative h-full transition duration-300">
        <div className="absolute top-4 right-4">
          <CopyButton textToCopy={content} buttonClass={buttonClasses} />
        </div>
        <h3 className="text-xl font-semibold text-amber-700 mb-4">{title}</h3>
        <ul className="text-amber-900 text-sm whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
          {formattedContent}
        </ul>
      </div>
    );
  }

  return null;
};

export default OutputSection;
