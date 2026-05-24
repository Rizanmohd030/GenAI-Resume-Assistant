import React, { useState, useCallback } from 'react';

interface CopyButtonProps {
  textToCopy: string;
  buttonClass?: string;
  label?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, buttonClass, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [textToCopy]);

  const defaultClass = `absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 ${
    copied
      ? 'bg-green-600 text-white'
      : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
  }`;

  return (
    <button
      onClick={handleCopy}
      className={buttonClass || defaultClass}
    >
      {copied ? 'Copied!' : label}
    </button>
  );
};

export default CopyButton;
