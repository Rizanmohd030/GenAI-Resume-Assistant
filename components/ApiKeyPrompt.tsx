
import React from 'react';

interface ApiKeyPromptProps {
  onKeySelected: () => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success and update the UI immediately to avoid race conditions.
      onKeySelected();
    }
  };

  return (
    <div className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl text-center max-w-lg">
        <h2 className="text-2xl font-bold text-sky-400 mb-4">API Key Required</h2>
        <p className="text-slate-400 mb-6">
          To use the GenAI Resume Assistant, you need to select a Gemini API key. This key will be used to make requests to the model.
        </p>
        <button
          onClick={handleSelectKey}
          className="bg-sky-600 text-white font-bold py-3 px-6 rounded-md hover:bg-sky-700 transition-colors duration-300"
        >
          Select API Key
        </button>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
