import React from 'react';

interface GenerateMoreButtonProps {
  onClick: () => void;
  loading?: boolean;
}
const GenerateMoreButton: React.FC<GenerateMoreButtonProps> = ({ onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200"
  >
    {loading ? 'Generating...' : 'Generate Questions'}
  </button>
);

export default GenerateMoreButton;
