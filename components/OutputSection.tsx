import React from 'react';
import CopyButton from './CopyButton';

interface OutputSectionProps {
  title: string;
  questions?: string;
  answers?: string;
  content?: string;
}

const OutputSection: React.FC<OutputSectionProps> = ({
  title,
  questions,
  answers,
  content,
}) => {
  // Q&A pair block
  if (questions && answers) {
    const questionList = questions
      .split('\n')
      .filter(line => line.trim().startsWith('* '))
      .map(line => line.substring(2));
    const answerList = answers
      .split('\n')
      .filter(line => line.trim().startsWith('* '))
      .map(line => line.substring(2));

    return (
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl relative h-full">
        <CopyButton textToCopy={`${questions}\n${answers}`} />
        <h3 className="text-lg font-semibold text-sky-400 mb-4">{title}</h3>
        <div>
          {questionList.map((q, idx) => (
            <div key={idx} className="mb-4">
              <div className="font-semibold text-purple-300">{`Q${idx + 1}. ${q}`}</div>
              <div className="ml-5 text-green-300">{`A${idx + 1}. ${answerList[idx] || ''}`}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Bullets/paragraphs for other sections
  if (content) {
    const formattedContent = content.split('\n').map((line, index) =>
      line.trim().startsWith('* ')
        ? <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>
        : <p key={index} className="mb-4">{line}</p>
    );

    return (
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl relative h-full">
        <CopyButton textToCopy={content} />
        <h3 className="text-lg font-semibold text-sky-400 mb-4">{title}</h3>
        <ul className="text-slate-300 text-sm whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
          {formattedContent}
        </ul>
      </div>
    );
  }

  return null;
};

export default OutputSection;
