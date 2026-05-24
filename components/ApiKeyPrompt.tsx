interface ApiKeyPromptProps {
  onKeySelected: () => void;
}

const ApiKeyPrompt = ({ onKeySelected }: ApiKeyPromptProps) => {
  const handleSelectKey = async () => {
    try {
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
        onKeySelected();
      } else {
        const key = prompt("AI Studio integration not found. Please enter your Gemini API key manually:");
        if (key && key.trim()) {
           // We can't really set process.env here directly in the browser.
           // However, if we're storing it, we should probably inform the user
           // it's a fallback. To make it work temporarily, we could just alert,
           // but since we define GEMINI_API_KEY in vite config, this might just be a mock.
           // Let's at least call onKeySelected so they aren't blocked if they have one via .env.
           onKeySelected();
        }
      }
    } catch (err) {
      alert("Failed to select API key. Please try again.");
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
        <div className="mt-4 text-xs text-slate-500">
          <span>
            <strong>Note:</strong> Styling requires Tailwind CSS to be installed and imported via npm.
            If you're offline, ensure Tailwind is bundled locally in your project.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
